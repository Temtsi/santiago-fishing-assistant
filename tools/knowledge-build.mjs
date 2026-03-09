#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const cwd = process.cwd();
const rawPath = path.resolve(cwd, "data/fishbase-raw-cache.json");
const kbPath = path.resolve(cwd, "data/knowledge-base.rag.json");
const targetsPath = path.resolve(cwd, "data/fishbase-targets.json");

function runNode(args) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, args, { cwd, stdio: "inherit" });
    p.on("close", (code) => resolve(code ?? 1));
  });
}

async function readJsonSafe(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyIfExists(src, dst) {
  if (await fileExists(src)) await fs.copyFile(src, dst);
}

function asArray(v) {
  return Array.isArray(v) ? v : [];
}

function buildLocalFallbackKb(targetsConfig) {
  const species = asArray(targetsConfig?.species).map((t) => ({
    name: t.name,
    aliases: Array.from(new Set([...(asArray(t.aliases)), t.name, `${t.genus || ""} ${t.species || ""}`.trim()].filter(Boolean))),
    type: t.type || "mixed",
    locations: asArray(t.locations),
    season: t.season || null,
    methods: asArray(t.methods),
    gear: asArray(t.gear),
    baits: asArray(t.baits),
    fishbase: {
      scientificName: `${t.genus || ""} ${t.species || ""}`.trim(),
      depth: { shallowM: null, deepM: null },
      habitat: { fresh: null, brackish: null, salt: null, demersPelag: null },
      trophic: { troph: null, foodTroph: null, foodSeTroph: null },
      dynamics: { resilience: null, doublingTime: null, vulnerability: null, climate: null },
      spawning: { seasonality: null, months: null },
    },
    source: {
      provider: "Local targets fallback",
      specCode: null,
      syncedAt: new Date().toISOString(),
    },
  }));

  return {
    version: 1,
    regions: asArray(targetsConfig?.regions),
    source: "local-fallback",
    generatedAt: new Date().toISOString(),
    species,
  };
}

async function main() {
  const backupRaw = `${rawPath}.bak`;
  const backupKb = `${kbPath}.bak`;

  await copyIfExists(rawPath, backupRaw);
  await copyIfExists(kbPath, backupKb);

  const syncCode = await runNode(["tools/fishbase-sync.mjs"]);

  if (syncCode !== 0) {
    const hadBackupRaw = await fileExists(backupRaw);
    const hadBackupKb = await fileExists(backupKb);

    if (hadBackupRaw && hadBackupKb) {
      await fs.copyFile(backupRaw, rawPath);
      await fs.copyFile(backupKb, kbPath);
      console.warn("[knowledge-build] FishBase unavailable, restored previous cache.");
    } else {
      console.warn("[knowledge-build] FishBase failed and no previous cache exists.");
    }
  }

  let kb = await readJsonSafe(kbPath);
  if (!kb || !Array.isArray(kb.species) || kb.species.length === 0) {
    const targetsCfg = await readJsonSafe(targetsPath);
    const localFallbackKb = buildLocalFallbackKb(targetsCfg || {});
    await fs.writeFile(kbPath, `${JSON.stringify(localFallbackKb, null, 2)}\n`, "utf8");
    kb = localFallbackKb;
    console.warn(`[knowledge-build] Built local fallback KB with ${kb.species.length} species from targets.`);
  }

  const validateCode = await runNode(["tools/validate-knowledge.mjs"]);
  if (validateCode !== 0) process.exit(validateCode);

  console.log("[knowledge-build] completed");
}

main().catch((err) => {
  console.error(`[knowledge-build] ${err?.message || String(err)}`);
  process.exit(1);
});
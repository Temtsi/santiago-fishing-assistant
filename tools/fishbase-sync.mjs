#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_BASE_URL = "https://fishbase.ropensci.org";
const DEFAULT_TARGETS = "data/fishbase-targets.json";
const DEFAULT_OUT_KB = "data/knowledge-base.rag.json";
const DEFAULT_OUT_RAW = "data/fishbase-raw-cache.json";
const DEFAULT_MIN_DELAY_MS = 3000;
const DEFAULT_MAX_DELAY_MS = 10000;
const DEFAULT_MAX_RETRIES = 4;
const DEFAULT_429_SLEEP_MS = 15 * 60 * 1000;
const DEFAULT_USER_AGENT = "SantiagoResearchBot/1.0 (+local data sync; respectful rate-limit)";

function parseArgs(argv) {
  const args = {
    baseUrl: DEFAULT_BASE_URL,
    targets: DEFAULT_TARGETS,
    outKb: DEFAULT_OUT_KB,
    outRaw: DEFAULT_OUT_RAW,
    minDelayMs: DEFAULT_MIN_DELAY_MS,
    maxDelayMs: DEFAULT_MAX_DELAY_MS,
    maxRetries: DEFAULT_MAX_RETRIES,
    sleep429Ms: DEFAULT_429_SLEEP_MS,
    userAgent: DEFAULT_USER_AGENT,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--base-url" && next) { args.baseUrl = next; i += 1; continue; }
    if (a === "--targets" && next) { args.targets = next; i += 1; continue; }
    if (a === "--out-kb" && next) { args.outKb = next; i += 1; continue; }
    if (a === "--out-raw" && next) { args.outRaw = next; i += 1; continue; }
    if (a === "--delay-ms" && next) {
      const v = Number(next);
      if (Number.isFinite(v) && v > 0) {
        args.minDelayMs = v;
        args.maxDelayMs = v;
      }
      i += 1;
      continue;
    }
    if (a === "--min-delay-ms" && next) { args.minDelayMs = Number(next) || args.minDelayMs; i += 1; continue; }
    if (a === "--max-delay-ms" && next) { args.maxDelayMs = Number(next) || args.maxDelayMs; i += 1; continue; }
    if (a === "--max-retries" && next) { args.maxRetries = Number(next) || args.maxRetries; i += 1; continue; }
    if (a === "--sleep-429-ms" && next) { args.sleep429Ms = Number(next) || args.sleep429Ms; i += 1; continue; }
    if (a === "--user-agent" && next) { args.userAgent = next; i += 1; continue; }
    if (a === "--help") {
      console.log("Usage: node tools/fishbase-sync.mjs [--targets data/fishbase-targets.json] [--out-kb data/knowledge-base.rag.json] [--out-raw data/fishbase-raw-cache.json] [--min-delay-ms 3000] [--max-delay-ms 10000] [--max-retries 4] [--sleep-429-ms 900000]");
      process.exit(0);
    }
  }

  if (args.minDelayMs > args.maxDelayMs) {
    const t = args.minDelayMs;
    args.minDelayMs = args.maxDelayMs;
    args.maxDelayMs = t;
  }
  return args;
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

function randomInt(min, max) {
  const lo = Math.max(0, Math.floor(min));
  const hi = Math.max(lo, Math.floor(max));
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

function parseRetryAfterMs(retryAfterValue) {
  if (!retryAfterValue) return null;
  const asNumber = Number(retryAfterValue);
  if (Number.isFinite(asNumber) && asNumber >= 0) return asNumber * 1000;
  const when = Date.parse(retryAfterValue);
  if (!Number.isNaN(when)) return Math.max(0, when - Date.now());
  return null;
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function writeJson(filePath, value) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function uniq(values) {
  return Array.from(new Set(values.filter(Boolean).map((v) => String(v).trim()).filter(Boolean)));
}

async function fetchTable(baseUrl, table, query, opts) {
  const { minDelayMs, maxDelayMs, maxRetries, sleep429Ms, userAgent } = opts;

  const url = new URL(`${baseUrl.replace(/\/$/, "")}/${table}`);
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") url.searchParams.set(k, String(v));
  });

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const resp = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": userAgent,
      },
    });

    const postDelay = randomInt(minDelayMs, maxDelayMs);
    await sleep(postDelay);

    if (resp.ok) {
      const json = await resp.json();
      if (Array.isArray(json)) return json;
      if (Array.isArray(json.data)) return json.data;
      if (Array.isArray(json.result)) return json.result;
      return [];
    }

    if (resp.status === 429) {
      const retryAfterMs = parseRetryAfterMs(resp.headers.get("retry-after"));
      const pauseMs = retryAfterMs ?? sleep429Ms;
      console.warn(`[rate-limit] ${table} -> HTTP 429. Sleeping ${Math.round(pauseMs / 1000)}s before retry.`);
      await sleep(pauseMs);
      continue;
    }

    if (resp.status >= 500 && attempt < maxRetries) {
      const backoffMs = Math.min(60000, 2000 * (attempt + 1));
      console.warn(`[retry] ${table} -> HTTP ${resp.status}. Retrying in ${Math.round(backoffMs / 1000)}s.`);
      await sleep(backoffMs);
      continue;
    }

    const body = await resp.text();
    throw new Error(`FishBase ${table} ${resp.status}: ${body.slice(0, 200)}`);
  }

  throw new Error(`FishBase ${table}: exhausted retries`);
}

async function resolveSpeciesRow(baseUrl, target, opts) {
  const tries = [
    { Genus: target.genus, Species: target.species },
    { genus: target.genus, species: target.species },
    { Species: target.species },
    { species: target.species },
  ];

  for (const q of tries) {
    const rows = await fetchTable(baseUrl, "species", q, opts);
    if (rows.length) {
      const exact = rows.find((r) => {
        const genus = String(r.Genus || r.genus || "").toLowerCase();
        const species = String(r.Species || r.species || "").toLowerCase();
        return genus === String(target.genus || "").toLowerCase() && species === String(target.species || "").toLowerCase();
      });
      return exact || rows[0];
    }
  }

  return null;
}

function inferType(target, speciesRow) {
  if (target.type) return target.type;
  const salt = Number(speciesRow?.Salt || speciesRow?.salt || 0) > 0;
  const fresh = Number(speciesRow?.Fresh || speciesRow?.fresh || 0) > 0;
  if (salt && !fresh) return "sea";
  if (fresh && !salt) return "fresh";
  return "mixed";
}

function simplifyRow(row) {
  if (!row || typeof row !== "object") return {};
  const keep = [
    "SpecCode", "Genus", "Species", "FBname", "Author", "DemersPelag", "Length", "LengthType", "DepthRangeShallow", "DepthRangeDeep",
    "Fresh", "Brack", "Salt", "Dangerous", "Importance", "UsedforAquaculture", "GameFish", "Aquarium", "Resilience",
  ];
  const out = {};
  for (const k of keep) {
    if (row[k] !== undefined && row[k] !== null && row[k] !== "") out[k] = row[k];
  }
  return out;
}

function safeArray(x) {
  return Array.isArray(x) ? x : [];
}

function buildKnowledgeEntry(target, speciesRow, tables) {
  const scientific = `${speciesRow?.Genus || target.genus} ${speciesRow?.Species || target.species}`.trim();
  const aliases = uniq([
    ...(target.aliases || []),
    target.name,
    speciesRow?.FBname,
    speciesRow?.Species,
    scientific,
  ]);

  const ecology = safeArray(tables.ecology)[0] || {};
  const pop = safeArray(tables.popdynn)[0] || {};
  const spawn = safeArray(tables.spawning)[0] || {};

  const fishbaseFacts = {
    scientificName: scientific,
    depth: {
      shallowM: speciesRow?.DepthRangeShallow ?? null,
      deepM: speciesRow?.DepthRangeDeep ?? null,
    },
    habitat: {
      fresh: speciesRow?.Fresh ?? null,
      brackish: speciesRow?.Brack ?? null,
      salt: speciesRow?.Salt ?? null,
      demersPelag: speciesRow?.DemersPelag ?? null,
    },
    trophic: {
      troph: ecology?.Troph ?? ecology?.troph ?? null,
      foodTroph: ecology?.FoodTroph ?? ecology?.foodtroph ?? null,
      foodSeTroph: ecology?.FoodSeTroph ?? ecology?.foodsetroph ?? null,
    },
    dynamics: {
      resilience: pop?.Resilience ?? speciesRow?.Resilience ?? null,
      doublingTime: pop?.DoublingTime ?? null,
      vulnerability: pop?.Vulnerability ?? null,
      climate: pop?.Climate ?? null,
    },
    spawning: {
      seasonality: spawn?.Seasons ?? spawn?.seasonality ?? null,
      months: spawn?.SpawningMonths ?? spawn?.spawningmonths ?? null,
    },
  };

  return {
    name: target.name,
    aliases,
    type: inferType(target, speciesRow),
    locations: target.locations || [],
    season: target.season || null,
    methods: target.methods || [],
    gear: target.gear || [],
    baits: target.baits || [],
    fishbase: fishbaseFacts,
    source: {
      provider: "FishBase / rOpenSci API",
      specCode: speciesRow?.SpecCode ?? null,
      syncedAt: new Date().toISOString(),
    },
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const cwd = process.cwd();
  const targetsPath = path.resolve(cwd, args.targets);
  const outKbPath = path.resolve(cwd, args.outKb);
  const outRawPath = path.resolve(cwd, args.outRaw);

  const config = await readJson(targetsPath);
  const targets = Array.isArray(config.species) ? config.species : [];
  const raw = { generatedAt: new Date().toISOString(), source: "FishBase / rOpenSci API", results: [] };
  const kb = { version: 1, regions: config.regions || [], source: "fishbase-sync", generatedAt: new Date().toISOString(), species: [] };
  let successCount = 0;

  for (const target of targets) {
    try {
      const speciesRow = await resolveSpeciesRow(args.baseUrl, target, args);
      if (!speciesRow) {
        raw.results.push({ target, error: "Species not found in FishBase" });
        continue;
      }

      const specCode = speciesRow.SpecCode ?? speciesRow.specCode ?? speciesRow.spec_code;
      const tableQueries = [
        { table: "ecology", key: "ecology" },
        { table: "popdynn", key: "popdynn" },
        { table: "spawning", key: "spawning" },
      ];

      const tables = {};
      for (const t of tableQueries) {
        try {
          const q1 = specCode ? { SpecCode: specCode } : { Genus: target.genus, Species: target.species };
          const rows = await fetchTable(args.baseUrl, t.table, q1, args);
          tables[t.key] = rows;
        } catch (err) {
          tables[t.key] = [];
          raw.results.push({ target: target.name, table: t.table, warning: String(err?.message || err) });
        }
      }

      raw.results.push({ target, species: simplifyRow(speciesRow), tables });
      kb.species.push(buildKnowledgeEntry(target, speciesRow, tables));
      console.log(`[ok] ${target.name} -> ${target.genus} ${target.species}`);
      successCount += 1;
    } catch (err) {
      raw.results.push({ target, error: String(err?.message || err) });
      console.error(`[error] ${target.name}: ${String(err?.message || err)}`);
    }
  }

  await writeJson(outRawPath, raw);
  await writeJson(outKbPath, kb);

  console.log(`Saved raw cache: ${outRawPath}`);
  console.log(`Saved RAG KB: ${outKbPath}`);
  console.log(`FishBase sync summary: ${successCount}/${targets.length} species loaded`);

  if (targets.length > 0 && successCount === 0) {
    throw new Error("FishBase sync failed for all species. Check network/API availability.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

function fail(msg) {
  console.error(`[validate] ${msg}`);
  process.exit(1);
}

function warn(msg) {
  console.warn(`[validate] ${msg}`);
}

function info(msg) {
  console.log(`[validate] ${msg}`);
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function asArray(v) {
  return Array.isArray(v) ? v : [];
}

function hasText(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function hasMojibake(v) {
  if (typeof v !== "string") return false;
  return /\?\?\?|Ã|Â|�/.test(v);
}

function isSea(item) {
  const h = item?.fishbase?.habitat || {};
  return Number(h.salt || 0) > 0;
}

function isFresh(item) {
  const h = item?.fishbase?.habitat || {};
  return Number(h.fresh || 0) > 0;
}

function validateSpecies(item, idx, errors, warnings) {
  const id = `${idx + 1}:${item?.name || "<no-name>"}`;
  if (!hasText(item?.name)) errors.push(`${id} missing name`);
  if (!asArray(item?.aliases).length) warnings.push(`${id} has no aliases`);
  if (!["sea", "fresh", "mixed"].includes(item?.type)) warnings.push(`${id} type should be sea|fresh|mixed`);
  if (!asArray(item?.locations).length) warnings.push(`${id} has no locations`);

  const fishbase = item?.fishbase || {};
  if (!hasText(fishbase?.scientificName)) errors.push(`${id} missing fishbase.scientificName`);

  const allText = [item?.name, ...(asArray(item?.aliases)), ...(asArray(item?.locations)), ...(asArray(item?.methods)), ...(asArray(item?.baits))];
  for (const t of allText) {
    if (hasMojibake(t)) {
      errors.push(`${id} mojibake text detected: "${String(t).slice(0, 40)}"`);
      break;
    }
  }

  if (item?.type === "sea" && isFresh(item) && !isSea(item)) warnings.push(`${id} type sea but habitat looks freshwater`);
  if (item?.type === "fresh" && isSea(item) && !isFresh(item)) warnings.push(`${id} type fresh but habitat looks marine`);
}

async function main() {
  const kbPath = path.resolve(process.cwd(), process.argv[2] || "data/knowledge-base.rag.json");
  const kb = await readJson(kbPath);

  if (!kb || typeof kb !== "object") fail("KB is not an object");
  if (!Array.isArray(kb.species)) fail("KB missing species array");

  const errors = [];
  const warnings = [];

  const seen = new Set();
  for (const [idx, item] of kb.species.entries()) {
    validateSpecies(item, idx, errors, warnings);
    const key = String(item?.name || "").trim().toLowerCase();
    if (key) {
      if (seen.has(key)) warnings.push(`duplicate species name: ${item.name}`);
      seen.add(key);
    }
  }

  info(`species: ${kb.species.length}`);
  info(`warnings: ${warnings.length}`);
  if (warnings.length) warnings.slice(0, 20).forEach((w) => warn(w));

  if (errors.length) {
    errors.slice(0, 30).forEach((e) => console.error(`[validate] ${e}`));
    fail(`failed with ${errors.length} error(s)`);
  }

  info("OK");
}

main().catch((err) => fail(err?.message || String(err)));
/**
 * Extracts React Icons into plain JSON data files read at runtime with `fs`.
 *
 * Importing the packs directly is not viable: they ship as one barrel module
 * each, 41MB of JavaScript in total, and a namespace import (`import * as`)
 * opts out of the `optimizePackageImports` transform that would otherwise
 * narrow them down. Bundling that graph cost gigabytes of compiler memory.
 *
 * Every icon is declared as `GenIcon(<literal JSON>)`, so the tree can be
 * lifted straight out of the source and stored as data. Nothing then imports
 * `react-icons`, and the server parses only the packs a page actually uses.
 *
 * Run via `npm run icons` (wired into `dev` and `build`).
 */

import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

/** Mirrors the packs the icon picker offers. */
const PACKS = [
  "ai", "bi", "bs", "cg", "ci", "di", "fa", "fa6", "fc", "fi",
  "gi", "go", "gr", "hi", "hi2", "im", "io", "io5", "lia", "lu",
  "md", "pi", "ri", "rx", "si", "sl", "tb", "tfi", "ti", "vsc", "wi",
] as const;

const PACKAGE_DIR = path.join(process.cwd(), "node_modules", "react-icons");
const OUT_DIR = path.join(process.cwd(), ".icon-data");

/**
 * `export function LuSun (props) { return GenIcon({...})(props); };`
 *
 * The tree is matched lazily up to the `)(props)` call that closes it, which no
 * icon body contains, so each match stops at its own icon.
 */
const ICON_PATTERN = /export function (\w+)\s*\(props\)\s*\{\s*return GenIcon\((\{[\s\S]*?\})\)\(props\)/g;

interface PackResult {
  pack: string;
  count: number;
  skipped: string[];
  bytes: number;
}

async function buildPack(pack: string): Promise<PackResult> {
  const source = await readFile(path.join(PACKAGE_DIR, pack, "index.mjs"), "utf8");
  const icons: Record<string, unknown> = {};
  const skipped: string[] = [];

  for (const match of source.matchAll(ICON_PATTERN)) {
    const [, name, tree] = match;

    try {
      icons[name] = JSON.parse(tree);
    } catch {
      skipped.push(name);
    }
  }

  const json = JSON.stringify(icons);
  await writeFile(path.join(OUT_DIR, `${pack}.json`), json, "utf8");

  return { pack, count: Object.keys(icons).length, skipped, bytes: json.length };
}

async function main() {
  try {
    await readdir(PACKAGE_DIR);
  } catch {
    throw new Error(`react-icons not found at ${PACKAGE_DIR}. Run an install first.`);
  }

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const results = await Promise.all(PACKS.map(buildPack));

  // One flat, sorted, unique list backs the picker's search box.
  // fa + fa6 (and similar) share many export names; duplicates break React keys.
  const names = new Set<string>();
  for (const { pack } of results) {
    const raw = await readFile(path.join(OUT_DIR, `${pack}.json`), "utf8");
    for (const name of Object.keys(JSON.parse(raw) as Record<string, unknown>)) {
      names.add(name);
    }
  }
  const sortedNames = [...names].sort();

  await writeFile(
    path.join(OUT_DIR, "names.json"),
    JSON.stringify(sortedNames),
    "utf8",
  );

  const totalIcons = results.reduce((sum, r) => sum + r.count, 0);
  const totalBytes = results.reduce((sum, r) => sum + r.bytes, 0);
  const failed = results.filter((r) => r.count === 0);
  const skipped = results.flatMap((r) => r.skipped.map((n) => `${r.pack}/${n}`));

  console.log(
    `icons: ${totalIcons} across ${results.length} packs ` +
      `(${sortedNames.length} unique names, ${(totalBytes / 1024 / 1024).toFixed(1)}MB) -> .icon-data/`,
  );

  if (skipped.length > 0) {
    console.warn(`icons: could not parse ${skipped.length}: ${skipped.slice(0, 10).join(", ")}`);
  }

  if (failed.length > 0) {
    throw new Error(`No icons extracted from: ${failed.map((r) => r.pack).join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

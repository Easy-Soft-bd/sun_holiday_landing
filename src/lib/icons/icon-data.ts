/**
 * Server-side access to the React Icons catalogue.
 *
 * The packs are read from the JSON files written by `scripts/generate-icon-data.ts`
 * using `fs`, deliberately not `import`. A static or dynamic import would pull
 * all 37MB into the module graph for the bundler to parse and cache, which is
 * exactly the cost this indirection exists to avoid. Reading at runtime keeps
 * `react-icons` out of every bundle and loads only the packs a page asks for.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

export interface IconTree {
  tag: string;
  attr: Record<string, string>;
  child: IconTree[];
}

type Pack = Record<string, IconTree>;

const DATA_DIR = path.join(process.cwd(), ".icon-data");

/**
 * Prefixes shared by several packs list every candidate in priority order:
 * `FaXTwitter` only exists in fa6, `FaHome` only in fa.
 */
const PREFIX_PACKS: Record<string, readonly string[]> = {
  Ai: ["ai"],
  Bi: ["bi"],
  Bs: ["bs"],
  Cg: ["cg"],
  Ci: ["ci"],
  Di: ["di"],
  Fa: ["fa6", "fa"],
  Fc: ["fc"],
  Fi: ["fi"],
  Gi: ["gi"],
  Go: ["go"],
  Gr: ["gr"],
  Hi: ["hi2", "hi"],
  Im: ["im"],
  Io: ["io5", "io"],
  Lia: ["lia"],
  Lu: ["lu"],
  Md: ["md"],
  Pi: ["pi"],
  Ri: ["ri"],
  Rx: ["rx"],
  Si: ["si"],
  Sl: ["sl"],
  Tb: ["tb"],
  Tfi: ["tfi"],
  Ti: ["ti"],
  Vsc: ["vsc"],
  Wi: ["wi"],
};

// Longest first so `Tfi` is not swallowed by a shorter overlapping prefix.
const PREFIXES = Object.keys(PREFIX_PACKS).sort((a, b) => b.length - a.length);

/** Promises are cached, not results, so concurrent requests read the file once. */
const packCache = new Map<string, Promise<Pack>>();
let namesCache: Promise<string[]> | undefined;

function loadPack(pack: string): Promise<Pack> {
  let pending = packCache.get(pack);

  if (!pending) {
    pending = readFile(path.join(DATA_DIR, `${pack}.json`), "utf8")
      .then((raw) => JSON.parse(raw) as Pack)
      .catch(() => {
        // A missing pack file means the generator has not run. Resolving empty
        // lets the caller fall back instead of failing the whole render.
        packCache.delete(pack);
        return {} as Pack;
      });

    packCache.set(pack, pending);
  }

  return pending;
}

function packsForIcon(name: string): readonly string[] {
  const prefix = PREFIXES.find((candidate) => name.startsWith(candidate));
  return prefix ? PREFIX_PACKS[prefix] : [];
}

/** Resolves a React Icons name to its drawing tree, or null when unknown. */
export async function getIconTree(name: string): Promise<IconTree | null> {
  if (!name) {
    return null;
  }

  for (const pack of packsForIcon(name)) {
    const icons = await loadPack(pack);

    if (icons[name]) {
      return icons[name];
    }
  }

  return null;
}

/** Every available icon name, sorted and unique. Backs the picker's search. */
export async function getIconNames(): Promise<string[]> {
  namesCache ??= readFile(path.join(DATA_DIR, "names.json"), "utf8")
    .then((raw) => {
      const parsed = JSON.parse(raw) as string[];
      // Older generated manifests listed fa + fa6 names twice; keep React keys unique.
      return [...new Set(parsed)].sort();
    })
    .catch(() => {
      namesCache = undefined;
      return [];
    });

  return namesCache;
}

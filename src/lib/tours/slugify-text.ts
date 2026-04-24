/** URL-safe slug from arbitrary text (lowercase, hyphenated). Safe for client bundles. */
export function slugifyText(input: string): string {
  const s = input
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);

  return s || "tour";
}

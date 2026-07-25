import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

/**
 * One-off: add `sailor_moon_resorts_page` to `page_home` if missing.
 * Run: npx tsx scripts/ensure-sailor-moon-resorts-column.ts
 */
async function main() {
  const { default: sequelize } = await import("../src/lib/db");
  await import("../src/models/HomePage");
  const { ensureJsonColumn } = await import("./ensure-json-column");

  await sequelize.authenticate();
  await ensureJsonColumn(sequelize, "page_home", "sailor_moon_resorts_page");
  console.log("Done.");
  await sequelize.close();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

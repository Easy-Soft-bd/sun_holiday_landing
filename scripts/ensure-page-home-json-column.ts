import type { Sequelize } from "sequelize";

/**
 * Adds a JSON column to `page_home` if it is missing.
 * Sequelize `sync({ alter: true })` sometimes skips new columns; this is idempotent for MySQL.
 */
export async function ensurePageHomeJsonColumn(sequelize: Sequelize, columnName: string): Promise<void> {
  try {
    await sequelize.query(`ALTER TABLE \`page_home\` ADD COLUMN \`${columnName}\` JSON NULL`);
    console.log(`Added column page_home.${columnName}`);
  } catch (err: unknown) {
    const e = err as { parent?: { errno?: number; sqlMessage?: string }; message?: string };
    const errno = e?.parent?.errno;
    const sqlMsg = String(e?.parent?.sqlMessage ?? e?.message ?? "");
    if (errno === 1060 || sqlMsg.includes("Duplicate column name")) {
      return;
    }
    throw err;
  }
}

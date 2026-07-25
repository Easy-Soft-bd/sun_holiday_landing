import type { Sequelize } from "sequelize";

/**
 * Adds a JSON column to a table if it is missing.
 * Sequelize `sync({ alter: true })` sometimes skips new columns; this is idempotent for MySQL.
 */
export async function ensureJsonColumn(
  sequelize: Sequelize,
  tableName: string,
  columnName: string,
): Promise<void> {
  try {
    await sequelize.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` JSON NULL`);
    console.log(`Added column ${tableName}.${columnName}`);
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

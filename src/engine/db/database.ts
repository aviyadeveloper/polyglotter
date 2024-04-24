import Database from "better-sqlite3";
import {Language} from "../types";
import {flushDirSync} from "../util";

/**
 * Wipe any old sqlite database and setup up new database with base tables.
 */
export const setupDatabase = (lang: Language) => {
  // New fresh database.
  flushDirSync("data/sqlite");
  const db = new Database(`data/sqlite/dict_${lang}.db`);

  // Setup basic tables.
  db.prepare(
    `
      CREATE TABLE forms (
        id INTEGER PRIMARY KEY,
        form TEXT
      );
    `
  ).run();

  db.prepare(
    `
      CREATE INDEX idx_form
      ON forms (form);
      `
  );
  return db;
};

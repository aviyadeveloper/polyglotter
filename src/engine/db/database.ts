import Database from "better-sqlite3";
import {Language} from "../types";
import {flushDirSync} from "../util";

export const setupDatabase = (lang: Language) => {
  console.log("flushing db dir.");
  flushDirSync("data/sqlite");
  console.log("create new db.");
  const db = new Database(`data/sqlite/dict_${lang}.db`);
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

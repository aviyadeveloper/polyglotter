import {Language} from "./types";
import {Parser} from "./parser/parser";
import {setupDatabase} from "./db/database";

/**
 * Run the engine according to the language give.
 * Depends on a availability of language configuartion setup,
 * and access to raw xml wiktionary dump file (not part of git control due to size).
 */
export const runEngine = async (lang: Language) => {
  // Load
  console.log("loading db, parser, and reader.");
  const db = setupDatabase(lang);
  const parser = new Parser();
  parser.loadReader();

  // Run
  console.log("scanning data.");
  console.time("scanData");
  await parser.collectAndProcessPages();

  // Finish
  console.log("Finished running parser!");
  console.log("found", parser.getDictoniaryEntriesLength(), "relevant forms");
  console.timeEnd("scanData");
  db.close();
};

// console.log(JSON.stringify(dictionary, null, 2));
// console.time("writeAllRows");
// nativeFormsWriter.writeAllRows();
// console.timeEnd("writeAllRows");

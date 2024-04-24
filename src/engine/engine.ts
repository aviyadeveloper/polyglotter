import {once} from "events";
import {Language} from "./types";
import {Parser} from "./parser/parser";
import {flushDirSync} from "./util";
import {setupDatabase} from "./db/database";
import {Dictionary} from "./dictionary";

const fs = require("fs");
const readline = require("readline");

enum IteratorState {
  COLLECT,
  NULL,
}

/**
 * Run the engine according to the language give.
 * Depends on a availability of language configuartion setup,
 * and access to raw xml wiktionary dump file (not part of git control due to size).
 */
export const runEngine = async (lang: Language) => {
  const db = setupDatabase(lang);
  const parser = new Parser(lang);

  flushDirSync("data/pages/");
  const dictionary: Dictionary = {
    forms: {},
  };

  let iteratorState = IteratorState.NULL;
  let page: string = "";

  // Load up file
  const rl = readline.createInterface({
    input: fs.createReadStream(parser.getRawFilePath()),
    crlfDelay: Infinity,
  });

  console.time("scanData");
  // Iterate line by line
  rl.on("line", (line: string) => {
    switch (iteratorState) {
      case IteratorState.NULL:
        if (line.indexOf("<page>") > -1) {
          iteratorState = IteratorState.COLLECT;
        }
        break;
      case IteratorState.COLLECT:
        if (line.indexOf("</page>") > -1) {
          iteratorState = IteratorState.NULL;
          parser.processor.page(page, dictionary);
          page = "";
        } else {
          page += `${line}\n`;
        }
        break;
      default:
        break;
    }
  });

  await once(rl, "close");

  console.log("Finished running parser!");
  console.log("found", Object.keys(dictionary.forms).length, "relevant forms");
  console.log(JSON.stringify(dictionary, null, 2));

  console.timeEnd("scanData");

  // console.time("writeAllRows");
  // nativeFormsWriter.writeAllRows();
  // console.timeEnd("writeAllRows");
  db.close();
  console.log("closed db.");
};

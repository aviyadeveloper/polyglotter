const fs = require("fs");
const readline = require("readline");

import {Config} from "./config";
import {Validator} from "./validator";
import {Extractor} from "./extractor";
import {Processor} from "./processor";
import {Dictionary} from "../dictionary";
import {once} from "events";

/**
 * Container class for validator, extractor and processor tools.
 * @constructor
 * @param lang Langauge
 */
export class Parser {
  config: Config;
  validator: Validator;
  extractor: Extractor;
  processor: Processor;
  reader: any;
  dictionary: Dictionary = {
    forms: {},
  };

  constructor() {
    this.config = new Config();
    this.validator = new Validator(this.config);
    this.extractor = new Extractor(this.config);
    this.processor = new Processor(this.config, this.validator, this.extractor);
  }

  /* Private Methods */

  private _getRawFilePath = () => this.config.FILES.RAW_FILE_PATH;
  private _pageTagOpened = (line: string) => line.indexOf("<page>") > -1;
  private _pageTagClosed = (line: string) => line.indexOf("</page>") > -1;

  /* Public Methods */

  public loadReader = () => {
    // Load up file
    this.reader = readline.createInterface({
      input: fs.createReadStream(this._getRawFilePath()),
      crlfDelay: Infinity,
    });
  };

  public collectAndProcessPages = async () => {
    let collectLines = false;
    let page: string = "";

    // Iterate line by line
    this.reader.on("line", (line: string) => {
      // Page xml tag opened, start collecting lines.
      this._pageTagOpened(line) && (collectLines = true);

      // Collect lines but avoid first page tag line
      collectLines && !this._pageTagOpened(line) && (page += `${line}\n`);

      // Page xml tag closed:
      // stop collecting lines, process collected page, clear buffer.
      if (this._pageTagClosed(line)) {
        collectLines = false;
        this.processor.processPage(page, this.dictionary);
        page = "";
      }
    });

    await once(this.reader, "close");
  };

  public getDictoniaryEntriesLength = () =>
    Object.keys(this.dictionary.forms).length;
}

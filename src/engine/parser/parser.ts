import {Language} from "../types";
import {PARSER_CONFIG} from "./config";
import {Validator} from "./validator";
import {ParserConfigLanguageData} from "./config";
import {Extractor} from "./extractor";
import {Processor} from "./processor";

/**
 * Container class for validator, extractor and processor tools.
 * @constructor
 * @param lang Langauge
 */
export class Parser {
  config: ParserConfigLanguageData;
  validator: Validator;
  extractor: Extractor;
  processor: Processor;

  constructor(lang: Language) {
    this.config = PARSER_CONFIG[`${lang}`];
    this.validator = new Validator(this.config);
    this.extractor = new Extractor(this.config);
    this.processor = new Processor(this.config, this.validator, this.extractor);
  }

  // Get raw xml file path from config.
  getRawFilePath = () => this.config.FILES.RAW_FILE_PATH;
}

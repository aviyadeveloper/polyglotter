import {Language} from "../types";
import {PARSER_CONFIG} from "./config";
import {Validator} from "./validator";
import {ParserConfigLanguageData} from "./config";
import {Extractors} from "./extractors";
import {Processors} from "./processors";

export type Parser = {
  config: ParserConfigLanguageData;
  validate: Validator;
  extract: Extractors;
  process: Processors;
  getRawFilePath: () => string;
};

export function Parser(lang: Language): Parser {
  const config = PARSER_CONFIG[`${lang}`];
  const validate = new Validator(config);
  const extract = Extractors(config);
  const process = Processors(config, extract, validate);

  const getRawFilePath = () => config.FILES.RAW_FILE_PATH;

  return {
    config,
    validate,
    extract,
    process,
    getRawFilePath,
  };
}

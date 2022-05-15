import {Language} from "../types";
import {PARSER_CONFIG} from "./config";
import {Validators} from "./validators";
import {ParserConfigLanguageData} from "./config";
import {Extractors} from "./extractors";
import {Processors} from "./processors";

export type Parser = {
  config: ParserConfigLanguageData;
  validate: Validators;
  extract: Extractors;
  process: Processors;
  getRawFilePath: () => string;
};

export function Parser(lang: Language): Parser {
  const config = PARSER_CONFIG[`${lang}`];
  const validate = Validators(config);
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

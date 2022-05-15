import {ParserConfigLanguageData} from "./config";
import {getFirstMatch} from "./util";
import {Tenses, VerbData} from "../dictionary/verbs";
import {Extractors} from "./extractors";
import {Dictionary} from "../dictionary";
import {Validators} from "./validators";

export type Processors = {
  Page: (page: string, dictionary: Dictionary) => void;
};

export const Processors = (
  config: ParserConfigLanguageData,
  extract: Extractors,
  validate: Validators
): Processors => {
  /*
   * Private Methods
   */
  const _Verb = (content: string): VerbData => {
    const tensesRaw = getFirstMatch(
      content,
      config.TAGS.WORD.DATA.VERB.TENSES.ALL
    );

    const tenses: Tenses = extract.Tenses(tensesRaw);
    return {
      irregular: false,
      transitive: false,
      reflexive: false,
      tenses,
    };
  };

  /*
   * Public Methods
   */

  const Page = (page: string, dictionary: Dictionary) => {
    const form = extract.Form(page);

    type Entry = {
      form: string;
      words: any[];
    };

    const entry: Entry = {
      form,
      words: [],
    };

    const content = extract.ContentFromPage(page);
    const lngSections = extract.LanguageSections(content);
    for (let lngSection of lngSections) {
      if (validate.isLanguageSectionNative(lngSection)) {
        const wordUnits = extract.WordUnits(lngSection);
        for (let unit of wordUnits) {
          const types = extract.WordTypes(unit);
          if (validate.hasRelevantType(types)) {
            // TODO: map type

            // TODO: get type-specific data
            const typeSpecificData = types.includes(config.TAGS.WORD.TYPES.VERB)
              ? _Verb(unit)
              : {
                  extraData:
                    "This word type still does not have an extra data processor.",
                };

            // get generic data

            const definitions = extract.Definitions(unit);
            const examples = extract.Examples(unit);
            const synonyms = extract.Synonyms(unit);
            const antonyms = extract.Antonymes(unit);

            // Map generic data by definitions and build word.
            for (const definition of definitions) {
              const tag = definition.substring(0, definition.indexOf("]") + 1);
              if (tag) {
                const word = {
                  definition,
                  types,
                  examples: examples.filter((e) => e.indexOf(tag) > -1),
                  synonyms: synonyms.filter((s) => s.indexOf(tag) > -1),
                  antonyms: antonyms.filter((a) => a.indexOf(tag) > -1),
                  ...typeSpecificData,
                };
                entry.words.push(word);
              }
            }
            dictionary.forms[form] = {words: entry.words};
          }
        }
      }
    }
  };

  return {
    Page,
  };
};

import {ParserConfigLanguageData} from "./config";
import {getFirstMatch} from "./util";
import {Tenses, Transitivity, VerbData} from "../dictionary/verbs";
import {Extractors} from "./extractors";
import {Dictionary} from "../dictionary";
import {Validator} from "./validator";

type TypeSpecificData = {
  verb?: VerbData;
  extra?: string;
};

export type Processors = {
  page: (page: string, dictionary: Dictionary) => void;
  transitivity: (content: string) => Transitivity;
};

export const Processors = (
  config: ParserConfigLanguageData,
  extract: Extractors,
  validate: Validator
): Processors => {
  /*
   * Private Methods
   */
  const _Verb = (unit: string): VerbData => {
    const firstLine = unit.substring(0, unit.indexOf("\n"));
    const tensesRaw = getFirstMatch(
      unit,
      config.TAGS.WORD.DATA.VERB.TENSES.ALL
    );

    const irregular = validate.isIrregular(firstLine);
    const transitive = transitivity(firstLine);
    const reflexive = validate.isReflexive(firstLine);
    const seperable = validate.isSeperable(firstLine);
    const tenses: Tenses = extract.Tenses(tensesRaw);

    return {
      irregular,
      transitive,
      reflexive,
      seperable,
      tenses,
    };
  };

  /*
   * Public Methods
   */

  const page = (page: string, dictionary: Dictionary) => {
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

            // get type-specific data
            const typeSpecificData: TypeSpecificData = types.includes(
              config.TAGS.WORD.TYPES.VERB
            )
              ? {verb: _Verb(unit)}
              : {
                  extra:
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
              let extraData = undefined;
              if (tag) {
                if (typeSpecificData.verb) {
                  const irregular = validate.isIrregular(definition);
                  const transitive = transitivity(definition);
                  const reflexive = validate.isReflexive(definition);
                  const seperable = validate.isSeperable(definition);

                  // overwrite general data if got specific data from direct definition.
                  extraData = {
                    irregular: irregular || typeSpecificData.verb.irregular,
                    reflexive: reflexive || typeSpecificData.verb.reflexive,
                    seperable: seperable || typeSpecificData.verb.seperable,
                    transitive:
                      transitive !== Transitivity.UNKNOWN
                        ? transitive
                        : typeSpecificData.verb.irregular,
                    tenses: typeSpecificData.verb.tenses,
                  };
                } else {
                  extraData = {
                    data: "This word type still does not have an extra data processor.",
                  };
                }

                const word = {
                  definition,
                  types,
                  examples: examples.filter((e) => e.indexOf(tag) > -1),
                  synonyms: synonyms.filter((s) => s.indexOf(tag) > -1),
                  antonyms: antonyms.filter((a) => a.indexOf(tag) > -1),
                  ...extraData,
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

  const transitivity = (content: string) => {
    let transitivity = Transitivity.UNKNOWN;

    if (validate.isTransitive(content)) {
      transitivity = Transitivity.TRANSITIVE;
    }
    if (validate.isIntransitive(content)) {
      transitivity = Transitivity.INTRANSITIVE;
    }

    // Possibly redundant, check if any mixed state actually exists from data.
    if (validate.isTransitive(content) && validate.isIntransitive(content)) {
      transitivity = Transitivity.MIXED;
    }

    return transitivity;
  };

  return {
    page,
    transitivity,
  };
};

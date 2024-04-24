import {ParserConfigLanguageData} from "./config";
import {getFirstMatch} from "./util";
import {Transitivity, VerbData} from "../dictionary/verbs";
import {Extractor} from "./extractor";
import {Dictionary} from "../dictionary";
import {Validator} from "./validator";

type TypeSpecificData = {
  verb?: VerbData;
  extra?: string;
};

type Entry = {
  form: string;
  words: any[];
};

/**
 * Process raw data using validator and extractor.
 * @constructor
 * @param config ParserConfigLanguageData
 * @param validator Validator
 * @param extractor Extractor
 */
export class Processor {
  config: ParserConfigLanguageData;
  validator: Validator;
  extractor: Extractor;

  constructor(
    config: ParserConfigLanguageData,
    validator: Validator,
    extractor: Extractor
  ) {
    this.config = config;
    this.extractor = extractor;
    this.validator = validator;
  }

  /* Private Methods */

  private _processVerb = (unit: string): VerbData => {
    const firstLine = unit.substring(0, unit.indexOf("\n"));
    const tensesRaw = getFirstMatch(
      unit,
      this.config.TAGS.WORD.DATA.VERB.TENSES.ALL
    );

    return {
      irregular: this.validator.isIrregular(firstLine),
      transitive: this.transitivity(firstLine),
      reflexive: this.validator.isReflexive(firstLine),
      seperable: this.validator.isSeperable(firstLine),
      tenses: this.extractor.getTenses(tensesRaw),
    };
  };

  /* Public Methods */

  page = (page: string, dictionary: Dictionary) => {
    const form = this.extractor.getForm(page);

    const entry: Entry = {
      form,
      words: [],
    };

    const content = this.extractor.getContentFromPage(page);
    const lngSections = this.extractor.getLanguageSections(content);

    for (let lngSection of lngSections) {
      if (this.validator.isLanguageSectionNative(lngSection)) {
        const wordUnits = this.extractor.getWordUnits(lngSection);
        for (let unit of wordUnits) {
          const types = this.extractor.getWordTypes(unit);
          if (this.validator.hasRelevantType(types)) {
            // TODO: map type

            // get type-specific data
            const typeSpecificData: TypeSpecificData = types.includes(
              this.config.TAGS.WORD.TYPES.VERB
            )
              ? {verb: this._processVerb(unit)}
              : {
                  extra:
                    "This word type still does not have an extra data processor.",
                };

            // get generic data
            const definitions = this.extractor.getDefinitions(unit);
            const examples = this.extractor.getExamples(unit);
            const synonyms = this.extractor.getSynonyms(unit);
            const antonyms = this.extractor.getAntonymes(unit);

            // Map generic data by definitions and build word.
            for (const definition of definitions) {
              const tag = definition.substring(0, definition.indexOf("]") + 1);
              let extraData = undefined;
              if (tag) {
                if (typeSpecificData.verb) {
                  const irregular = this.validator.isIrregular(definition);
                  const transitive = this.transitivity(definition);
                  const reflexive = this.validator.isReflexive(definition);
                  const seperable = this.validator.isSeperable(definition);

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

  transitivity = (content: string) => {
    let transitivity = Transitivity.UNKNOWN;

    if (this.validator.isTransitive(content)) {
      transitivity = Transitivity.TRANSITIVE;
    }
    if (this.validator.isIntransitive(content)) {
      transitivity = Transitivity.INTRANSITIVE;
    }

    // Possibly redundant, check if any mixed state actually exists from data.
    if (
      this.validator.isTransitive(content) &&
      this.validator.isIntransitive(content)
    ) {
      transitivity = Transitivity.MIXED;
    }

    return transitivity;
  };
}

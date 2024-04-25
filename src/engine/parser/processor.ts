import {Config} from "./config";
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
 * Process raw data using validator to identify it and extractor to extract accordingly.
 * @constructor
 * @param config Config
 * @param validator Validator
 * @param extractor Extractor
 */
export class Processor {
  config: Config;
  validator: Validator;
  extractor: Extractor;

  constructor(config: Config, validator: Validator, extractor: Extractor) {
    this.config = config;
    this.extractor = extractor;
    this.validator = validator;
  }

  /* Private Methods */

  private _processExtraData = (
    typeSpecificData: TypeSpecificData,
    definition: string
  ) => {
    // Return Verb Extra Data
    if (typeSpecificData.verb) {
      return this._processExtraDataVerb(typeSpecificData, definition);
    }

    // Default to warning.
    return {data: "No extra data processor for type yet."};
  };

  private _processVerb = (unit: string): VerbData => {
    const firstLine = unit.substring(0, unit.indexOf("\n"));
    const tensesRaw = getFirstMatch(
      unit,
      this.config.TAGS.WORD.DATA.VERB.TENSES.ALL
    );

    return {
      irregular: this.validator.isIrregular(firstLine),
      transitive: this._getTransitivity(firstLine),
      reflexive: this.validator.isReflexive(firstLine),
      seperable: this.validator.isSeperable(firstLine),
      tenses: this.extractor.getTenses(tensesRaw),
    };
  };

  private _processExtraDataVerb = (
    typeSpecificData: TypeSpecificData,
    definition: string
  ) => {
    const irregular = this.validator.isIrregular(definition);
    const reflexive = this.validator.isReflexive(definition);
    const seperable = this.validator.isSeperable(definition);
    const transitive = this._getTransitivity(definition);

    // overwrite general data if got specific data from direct definition.
    return {
      irregular: irregular || typeSpecificData?.verb?.irregular,
      reflexive: reflexive || typeSpecificData?.verb?.reflexive,
      seperable: seperable || typeSpecificData?.verb?.seperable,
      transitive:
        transitive !== Transitivity.UNKNOWN
          ? transitive
          : typeSpecificData?.verb?.irregular,
      tenses: typeSpecificData?.verb?.tenses,
    };
  };

  private _getTransitivity = (content: string) => {
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

  /* Public Methods */

  public processPage = (page: string, dictionary: Dictionary) => {
    const form = this.extractor.getForm(page);

    const entry: Entry = {
      form,
      words: [],
    };

    const content = this.extractor.getContentFromPage(page);
    const lngSections = this.extractor.getLanguageSections(content);

    for (let lngSection of lngSections) {
      // Only process native language content.
      if (!this.validator.isLanguageSectionNative(lngSection)) {
        break;
      }

      /**
       * Data structure on wiktionary is inconsistent:
       * sometimes there are multiple word sections per form,
       * sometimes there is a single word section but a lot of definition tags,
       * somtimes both.
       *
       * It is required to consider all options when processing the sections.
       */
      const wordSections = this.extractor.getWordUnits(lngSection);

      for (let wordSection of wordSections) {
        const types = this.extractor.getWordTypes(wordSection);

        // No relevant types to process?
        if (!this.validator.hasRelevantType(types)) {
          break;
        }

        // Get type-specific data if specialized processor implemented.
        const typeSpecificData: TypeSpecificData = types.includes(
          this.config.TAGS.WORD.TYPES.VERB
        )
          ? {verb: this._processVerb(wordSection)}
          : {
              extra:
                "This word type still does not have an extra data processor.",
            };

        // Get generic data relevant for all words types
        const genericData = {
          definitions: this.extractor.getDefinitions(wordSection),
          examples: this.extractor.getExamples(wordSection),
          synonyms: this.extractor.getSynonyms(wordSection),
          antonyms: this.extractor.getAntonymes(wordSection),
        };

        // Map generic data by definitions and build word.
        for (const definition of genericData.definitions) {
          /**
           * Each definition starts with a (usually numerical) identifier tag ([1], [2], etc)
           * This tag is used to associated the various entries in the different sections with
           * the specific definition.
           *
           * Therefore the tag is crucial for the organization of the data extracted.
           */
          const tag = this.extractor.getTag(definition);

          /**
           * Since tag associated data is more specific than general data,
           * and since a lot of time, when a tags are given, no general untagged data is given
           * fetch the tag associated data prioritize it when processing the word.
           */
          if (tag) {
            /**
             * Word is a combination of form & definition. No word has 2 definitions.
             * Processor splits multi-definition forms to multiple words for better organization of data.
             */
            const word = {
              definition,
              types,
              examples: this.extractor.getDataForTag(tag, genericData.examples),
              synonims: this.extractor.getDataForTag(tag, genericData.synonyms),
              antonyms: this.extractor.getDataForTag(tag, genericData.antonyms),
              ...this._processExtraData(typeSpecificData, definition),
            };

            entry.words.push(word);
          }
        }

        /**
         * All form definition are divided in words, add words to form entry in dictionary.
         */
        dictionary.forms[form] = {words: entry.words};
      }
    }
  };
}

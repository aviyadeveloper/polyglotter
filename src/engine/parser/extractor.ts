import {Config} from "./config";
import {getFirstMatch, getStringBetween, toEndOfLine} from "./util";
import {HelpVerb, Tenses} from "../dictionary/verbs";

/**
 * Extract specific content from raw data according to type.
 * @constructor
 * @param config ParserConfigLanguageData
 */
export class Extractor {
  config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  /* Private Methods */

  private _getContentPart = (content: string, partTag: string) => {
    const allParts = content
      .match(this.config.TAGS.WORD.PARTS.ALL)
      ?.map((item) => item.split("\n"));
    const part = allParts?.filter((part) => part[0] === partTag).flat();
    const clean = part?.filter((line) => line !== partTag && line.length > 0);
    return clean || [];
  };

  private _getTense = (content: string, tenseTag: string) => {
    return getFirstMatch(content, RegExp(tenseTag + toEndOfLine)).slice(
      tenseTag.length - 1
    );
  };

  /* Public Methods */

  getAntonymes = (unit: string) =>
    this._getContentPart(unit, this.config.TAGS.WORD.PARTS.ANTONYMES);

  getContentFromPage = (page: string) => page.slice(page.indexOf("<text"));

  getDefinitions = (unit: string) =>
    this._getContentPart(unit, this.config.TAGS.WORD.PARTS.MEANINGS);

  getExamples = (unit: string) =>
    this._getContentPart(unit, this.config.TAGS.WORD.PARTS.EXAMPLES);

  getForm = (page: string) => {
    const form = getStringBetween("<title>", "</title>", page);
    return form.replace("'", "''");
  };

  getLanguageSections = (content: string) => {
    const sections: string[] = [];
    const matches = content.matchAll(this.config.TAGS.HEADERS.LNG_SECTION.ANY);
    const indexes = [];
    for (const match of matches) {
      indexes.push(match.index);
    }
    for (let i = 0; i < indexes.length; i++) {
      const start = indexes[i];
      const end = indexes[i + 1] || content.length;
      const section = content.slice(start, end);
      sections.push(section);
    }
    return sections ? [...sections] : [];
  };

  getSynonyms = (unit: string) =>
    this._getContentPart(unit, this.config.TAGS.WORD.PARTS.SYNONYMS);

  getWordTypes = (content: string) => {
    const types = content.match(this.config.TAGS.WORD.TYPES.ALL_SEPERATED);
    return types ? [...types] : [];
  };

  getWordUnits = (lngSection: string): string[] => {
    const units: string[] = [];
    const matches = lngSection.matchAll(this.config.TAGS.HEADERS.WORD_UNIT.ANY);
    const indexes = [];
    for (const match of matches) {
      indexes.push(match.index);
    }
    for (let i = 0; i < indexes.length; i++) {
      const start = indexes[i];
      const end = indexes[i + 1] || lngSection.length;
      const unit = lngSection.slice(start, end);
      units.push(unit);
    }
    return units ? [...units] : [];
  };

  getTenses = (tensesRaw: string): Tenses => ({
    present: {
      i: this._getTense(
        tensesRaw,
        this.config.TAGS.WORD.DATA.VERB.TENSES.PRESENT.I
      ),
      you: this._getTense(
        tensesRaw,
        this.config.TAGS.WORD.DATA.VERB.TENSES.PRESENT.YOU
      ),
      it: this._getTense(
        tensesRaw,
        this.config.TAGS.WORD.DATA.VERB.TENSES.PRESENT.IT
      ),
    },
    past: this._getTense(
      tensesRaw,
      this.config.TAGS.WORD.DATA.VERB.TENSES.PAST
    ),
    pastPerfect: {
      form: this._getTense(
        tensesRaw,
        this.config.TAGS.WORD.DATA.VERB.TENSES.PAST_PERFECT.NATIVE_SECTION
      ),
      helpVerb:
        this._getTense(
          tensesRaw,
          this.config.TAGS.WORD.DATA.VERB.TENSES.PAST_PERFECT.HELP_VERB
        ) === "sein"
          ? HelpVerb.SEIN
          : HelpVerb.HABEN,
    },
    imperative: {
      singular: this._getTense(
        tensesRaw,
        this.config.TAGS.WORD.DATA.VERB.TENSES.IMPERATIVE.SINGULAR
      ),
      plural: this._getTense(
        tensesRaw,
        this.config.TAGS.WORD.DATA.VERB.TENSES.IMPERATIVE.PLURAL
      ),
    },
    subjunctive2: this._getTense(
      tensesRaw,
      this.config.TAGS.WORD.DATA.VERB.TENSES.SUBJUNCTIVE_2
    ),
  });

  getTag = (definition: string) =>
    definition.substring(0, definition.indexOf("]") + 1);

  _hasTag = (tag: string, data: string) => data.indexOf(tag) > -1;

  /**
   * Filter data by tag association
   */
  getDataForTag = (tag: string, data: string[]) =>
    data.filter((d) => this._hasTag(tag, d));
}

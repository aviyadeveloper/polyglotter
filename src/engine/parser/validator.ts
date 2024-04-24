import {ParserConfigLanguageData} from "./config";

/**
 * Distinguish and cataogrize different linguistic forms using the language configuration.
 * @constructor
 * @param config ParserConfigLanguageData
 */
export class Validator {
  config: ParserConfigLanguageData;

  constructor(config: ParserConfigLanguageData) {
    this.config = config;
  }

  /* Private Methods */

  private _isAbbreviation = (types: string[]) =>
    types.includes(this.config.TAGS.WORD.TYPES.ABBREVIATION);

  private _isAdjective = (types: string[]) =>
    types.includes(this.config.TAGS.WORD.TYPES.ADJECTIVE);

  private _isAdverb = (types: string[]) =>
    types.includes(this.config.TAGS.WORD.TYPES.ADVERB);

  private _isArticle = (types: string[]) =>
    types.includes(this.config.TAGS.WORD.TYPES.ARTICLE);

  private _isNoun = (types: string[]) =>
    types.includes(this.config.TAGS.WORD.TYPES.NOUN);

  private _isPrefix = (types: string[]) =>
    types.includes(this.config.TAGS.WORD.TYPES.PREFIX);

  private _isPronoun = (types: string[]) =>
    // Type pronoun options: "personalPronomen, Pronomen" etc. requires regex for P/p
    types.join(" ").match(this.config.TAGS.WORD.TYPES.PRONOUN) ? true : false;

  private _isVerb = (types: string[]) =>
    types.includes(this.config.TAGS.WORD.TYPES.VERB);

  /* Public Methods */

  public hasRelevantType = (types: string[]) =>
    this._isVerb(types) ||
    this._isNoun(types) ||
    this._isAdjective(types) ||
    this._isAdverb(types) ||
    this._isPrefix(types) ||
    this._isArticle(types) ||
    this._isAbbreviation(types) ||
    this._isPronoun(types);

  public isTransitive = (content: string) =>
    content.match(this.config.TAGS.WORD.DATA.VERB.TRANSITIVE) ? true : false;

  public isIntransitive = (content: string) =>
    content.match(this.config.TAGS.WORD.DATA.VERB.INTRANSITIVE) ? true : false;

  public isIrregular = (content: string) =>
    content.match(RegExp(this.config.TAGS.WORD.DATA.VERB.IRREGULAR))
      ? true
      : false;

  public isLanguageSectionNative = (section: string) => {
    // Take section header line and check if it is native
    const sectionHeader = section.split("\n", 1)[0];
    return sectionHeader.indexOf(this.config.TAGS.NATIVE_SECTION) > -1;
  };

  public isReflexive = (content: string) =>
    // Todo: Also check for references to "sich"
    content.match(this.config.TAGS.WORD.DATA.VERB.REFLEXIVE) ? true : false;

  public isSeperable = (content: string) =>
    content.match(this.config.TAGS.WORD.DATA.VERB.SEPERABLE) ? true : false;
}

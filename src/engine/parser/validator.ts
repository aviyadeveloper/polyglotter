import {ParserConfigLanguageData} from "./config";

export class Validator {
  config: ParserConfigLanguageData;

  constructor(config: ParserConfigLanguageData) {
    this.config = config;
  }

  /*
   * Private Methods
   */

  private isAbbreviation = (types: string[]) =>
    types.includes(this.config.TAGS.WORD.TYPES.ABBREVIATION);

  private isAdjective = (types: string[]) =>
    types.includes(this.config.TAGS.WORD.TYPES.ADJECTIVE);

  private isAdverb = (types: string[]) =>
    types.includes(this.config.TAGS.WORD.TYPES.ADVERB);

  private isArticle = (types: string[]) =>
    types.includes(this.config.TAGS.WORD.TYPES.ARTICLE);

  private isNoun = (types: string[]) =>
    types.includes(this.config.TAGS.WORD.TYPES.NOUN);

  private isPrefix = (types: string[]) =>
    types.includes(this.config.TAGS.WORD.TYPES.PREFIX);

  private isPronoun = (types: string[]) =>
    // Type pronoun options: "personalPronomen, Pronomen" etc. requires regex for P/p
    types.join(" ").match(this.config.TAGS.WORD.TYPES.PRONOUN) ? true : false;

  private isVerb = (types: string[]) =>
    types.includes(this.config.TAGS.WORD.TYPES.VERB);

  /*
   * Public Methods
   */

  public hasRelevantType = (types: string[]) =>
    this.isVerb(types) ||
    this.isNoun(types) ||
    this.isAdjective(types) ||
    this.isAdverb(types) ||
    this.isPrefix(types) ||
    this.isArticle(types) ||
    this.isAbbreviation(types) ||
    this.isPronoun(types);

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

  public isTransitive = (content: string) =>
    content.match(this.config.TAGS.WORD.DATA.VERB.TRANSITIVE) ? true : false;
}

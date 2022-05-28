import {ParserConfigLanguageData} from "./config";

export type Validators = {
  hasRelevantType: (types: string[]) => boolean;
  isIntransitive: (content: string) => boolean;
  isIrregular: (content: string) => boolean;
  isLanguageSectionNative: (section: string) => boolean;
  isReflexive: (content: string) => boolean;
  isSeperable: (content: string) => boolean;
  isTransitive: (content: string) => boolean;
};

export const Validators = (config: ParserConfigLanguageData): Validators => {
  /*
   * Private Methods
   */

  const _isAbbreviation = (types: string[]) =>
    types.includes(config.TAGS.WORD.TYPES.ABBREVIATION);

  const _isAdjective = (types: string[]) =>
    types.includes(config.TAGS.WORD.TYPES.ADJECTIVE);

  const _isAdverb = (types: string[]) =>
    types.includes(config.TAGS.WORD.TYPES.ADVERB);

  const _isArticle = (types: string[]) =>
    types.includes(config.TAGS.WORD.TYPES.ARTICLE);

  const _isNoun = (types: string[]) =>
    types.includes(config.TAGS.WORD.TYPES.NOUN);

  const _isPrefix = (types: string[]) =>
    types.includes(config.TAGS.WORD.TYPES.PREFIX);

  const _isPronoun = (types: string[]) =>
    // Type pronoun options: "personalPronomen, Pronomen" etc. requires regex for P/p
    types.join(" ").match(config.TAGS.WORD.TYPES.PRONOUN) ? true : false;

  const _isVerb = (types: string[]) =>
    types.includes(config.TAGS.WORD.TYPES.VERB);
  /*
   * Public Methods
   */

  const hasRelevantType = (types: string[]) =>
    _isVerb(types) ||
    _isNoun(types) ||
    _isAdjective(types) ||
    _isAdverb(types) ||
    _isPrefix(types) ||
    _isArticle(types) ||
    _isAbbreviation(types) ||
    _isPronoun(types);

  const isIntransitive = (content: string) =>
    content.match(config.TAGS.WORD.DATA.VERB.INTRANSITIVE) ? true : false;

  const isIrregular = (content: string) =>
    content.match(RegExp(config.TAGS.WORD.DATA.VERB.IRREGULAR)) ? true : false;

  const isLanguageSectionNative = (section: string) => {
    // Take section header line and check if it is native
    const sectionHeader = section.split("\n", 1)[0];
    return sectionHeader.indexOf(config.TAGS.NATIVE_SECTION) > -1;
  };

  const isReflexive = (content: string) =>
    // Todo: Also check for references to "sich"
    content.match(config.TAGS.WORD.DATA.VERB.REFLEXIVE) ? true : false;

  const isSeperable = (content: string) =>
    content.match(config.TAGS.WORD.DATA.VERB.SEPERABLE) ? true : false;

  const isTransitive = (content: string) =>
    content.match(config.TAGS.WORD.DATA.VERB.TRANSITIVE) ? true : false;

  return {
    hasRelevantType,
    isIntransitive,
    isIrregular,
    isLanguageSectionNative,
    isReflexive,
    isSeperable,
    isTransitive,
  };
};

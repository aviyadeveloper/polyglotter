import {ParserConfigLanguageData} from "./config";
import {getFirstMatch, getStringBetween, toEndOfLine} from "./util";
import {HelpVerb, Tenses} from "../dictionary/verbs";

export type Extractors = {
  Antonymes: (unit: string) => string[];
  ContentFromPage: (page: string) => string;
  Definitions: (unit: string) => string[];
  Examples: (unit: string) => string[];
  Form: (page: string) => string;
  LanguageSections: (page: string) => string[];
  Synonyms: (unit: string) => string[];
  Tenses: (tensesRaw: string) => Tenses;
  WordTypes: (content: string) => string[];
  WordUnits: (lngSection: string) => string[];
};

export const Extractors = (config: ParserConfigLanguageData): Extractors => {
  /*
   * Private Methods
   */

  const _ContentPart = (content: string, partTag: string) => {
    const allParts = content
      .match(config.TAGS.WORD.PARTS.ALL)
      ?.map((item) => item.split("\n"));
    const part = allParts?.filter((part) => part[0] === partTag).flat();
    const clean = part?.filter((line) => line !== partTag && line.length > 0);
    return clean || [];
  };

  const _Tense = (content: string, tenseTag: string) => {
    return getFirstMatch(content, RegExp(tenseTag + toEndOfLine)).slice(
      tenseTag.length - 1
    );
  };

  /*
   * Public Methods
   */

  const Antonymes = (unit: string) =>
    _ContentPart(unit, config.TAGS.WORD.PARTS.ANTONYMES);

  const ContentFromPage = (page: string) => page.slice(page.indexOf("<text"));

  const Definitions = (unit: string) =>
    _ContentPart(unit, config.TAGS.WORD.PARTS.MEANINGS);

  const Examples = (unit: string) =>
    _ContentPart(unit, config.TAGS.WORD.PARTS.EXAMPLES);

  const Form = (page: string) => {
    const form = getStringBetween("<title>", "</title>", page);
    return form.replace("'", "''");
  };

  const LanguageSections = (content: string) => {
    const sections: string[] = [];
    const matches = content.matchAll(config.TAGS.HEADERS.LNG_SECTION.ANY);
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

  const Synonyms = (unit: string) =>
    _ContentPart(unit, config.TAGS.WORD.PARTS.SYNONYMS);

  const WordTypes = (content: string) => {
    const types = content.match(config.TAGS.WORD.TYPES.ALL_SEPERATED);
    return types ? [...types] : [];
  };

  const WordUnits = (lngSection: string): string[] => {
    const units: string[] = [];
    const matches = lngSection.matchAll(config.TAGS.HEADERS.WORD_UNIT.ANY);
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

  const Tenses = (tensesRaw: string) => ({
    present: {
      i: _Tense(tensesRaw, config.TAGS.WORD.DATA.VERB.TENSES.PRESENT.I),
      you: _Tense(tensesRaw, config.TAGS.WORD.DATA.VERB.TENSES.PRESENT.YOU),
      it: _Tense(tensesRaw, config.TAGS.WORD.DATA.VERB.TENSES.PRESENT.IT),
    },
    past: _Tense(tensesRaw, config.TAGS.WORD.DATA.VERB.TENSES.PAST),
    pastPerfect: {
      form: _Tense(
        tensesRaw,
        config.TAGS.WORD.DATA.VERB.TENSES.PAST_PERFECT.NATIVE_SECTION
      ),
      helpVerb:
        _Tense(
          tensesRaw,
          config.TAGS.WORD.DATA.VERB.TENSES.PAST_PERFECT.HELP_VERB
        ) === "sein"
          ? HelpVerb.SEIN
          : HelpVerb.HABEN,
    },
    imperative: {
      singular: _Tense(
        tensesRaw,
        config.TAGS.WORD.DATA.VERB.TENSES.IMPERATIVE.SINGULAR
      ),
      plural: _Tense(
        tensesRaw,
        config.TAGS.WORD.DATA.VERB.TENSES.IMPERATIVE.PLURAL
      ),
    },
    subjunctive2: _Tense(
      tensesRaw,
      config.TAGS.WORD.DATA.VERB.TENSES.SUBJUNCTIVE_2
    ),
  });

  return {
    Antonymes,
    ContentFromPage,
    Definitions,
    Examples,
    Form,
    LanguageSections,
    Synonyms,
    Tenses,
    WordTypes,
    WordUnits,
  };
};

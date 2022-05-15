import {VerbData} from "./verbs";

export type Dictionary = {
  forms: Form;
};

export type Form = {
  [k: string]: {
    words: Word[];
  };
};

export type Word = {
  id: number;
  type: WordType;
  explanations: string[];
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  extraData:
    | NounData
    | VerbData
    | AdjectiveData
    | AdverbData
    | PronounData
    | AbbreviationData
    | PrefixData
    | ArticleData;
};

export enum WordType {
  NOUN = "noun",
  VERB = "verb",
  ADJECIVE = "adjective",
  ADVERB = "adverb",
  PRONOUN = "pronoun",
  ABBREVIATION = "abbreviation",
  PREFIX = "prefix",
  ARTICLE = "article",
}

export type NounData = {};
export type AdjectiveData = {};
export type AdverbData = {};
export type PronounData = {};
export type AbbreviationData = {};
export type PrefixData = {};
export type ArticleData = {};

export type VerbData = {
  irregular: boolean; // inconsistent in de.wiktionary, default to false and fill later.
  reflexive: boolean;
  seperable: boolean;
  tenses: Tenses;
  transitive: Transitivity; // requires an object to affect.
};

export enum Transitivity {
  TRANSITIVE = "transitive",
  INTRANSITIVE = "intransitive",
  UNKNOWN = "unknown",
  MIXED = "mixed",
}

export enum HelpVerb {
  SEIN = "sein",
  HABEN = "haben",
}

export type Tenses = {
  present: {
    i: string;
    you: string;
    it: string;
  };
  pastPerfect: {
    form: string;
    helpVerb: HelpVerb;
  };
  past: string;
  subjunctive2: string;
  imperative: {
    singular: string;
    plural: string;
  };
};

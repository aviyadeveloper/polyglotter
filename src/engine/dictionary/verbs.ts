export type VerbData = {
  irregular: boolean; // inconsistent in de.wiktionary, default to false and fill later.
  transitive: boolean;
  reflexive: boolean;
  tenses: Tenses;
};

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

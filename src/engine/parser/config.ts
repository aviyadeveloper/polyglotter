export type ParserConfig = {
  GERMAN: ParserConfigLanguageData;
};

export type ParserConfigLanguageData = {
  FILES: {
    RAW_FILE_PATH: string;
  };
  TAGS: {
    HEADERS: {
      LNG_SECTION: {
        NATIVE: RegExp;
        ANY: RegExp;
      };
      WORD_UNIT: {
        ANY: RegExp;
      };
    };
    NATIVE_SECTION: string;
    WORD: {
      TYPES: {
        ALL_SEPERATED: RegExp;
        ALL_LINE_COMBINED: RegExp;
        NOUN: string;
        VERB: string;
        ADJECTIVE: string;
        ADVERB: string;
        PREFIX: string;
        PRONOUN: RegExp;
        ARTICLE: string;
        ABBREVIATION: string;
      };
      PARTS: {
        ALL: RegExp;
        SYNONYMS: string;
        ANTONYMES: string;
        EXAMPLES: string;
        MEANINGS: string;
      };
      DATA: {
        VERB: {
          TRANSITIVE: RegExp;
          INTRANSITIVE: RegExp;
          IRREGULAR: RegExp;
          REFLEXIVE: RegExp;
          SEPERABLE: RegExp;
          TENSES: {
            ALL: RegExp;
            PRESENT: {
              I: string;
              YOU: string;
              IT: string;
            };
            PAST: string;
            PAST_PERFECT: {
              NATIVE_SECTION: string;
              HELP_VERB: string;
            };
            IMPERATIVE: {
              SINGULAR: string;
              PLURAL: string;
            };
            SUBJUNCTIVE_2: string;
          };
        };
      };
    };
  };
};

export const PARSER_CONFIG: ParserConfig = {
  GERMAN: {
    FILES: {
      RAW_FILE_PATH: "data/raw/dewiktionary-20240420-pages-articles.xml",
                               
    },
    TAGS: {
      HEADERS: {
        LNG_SECTION: {
          NATIVE: /(?<=[^=])==\s.*?\({{Sprache\|Deutsch}}\).*?\s==$/gm,
          ANY: /(?<=[^=])==[^=].*?==$/gm,
        },
        WORD_UNIT: {
          ANY: /(?<=[^=])===[^=].*?===$/gm,
        },
      },
      NATIVE_SECTION: "({{Sprache|Deutsch}}",
      WORD: {
        TYPES: {
          ALL_SEPERATED: /{{Wortart\|.*?\|Deutsch}}/g,
          ALL_LINE_COMBINED: /{{Wortart\|.*?\|Deutsch}}.*/g,
          NOUN: "{{Wortart|Substantiv|Deutsch}}",
          VERB: "{{Wortart|Verb|Deutsch}}",
          ADJECTIVE: "{{Wortart|Adjektiv|Deutsch}}",
          ADVERB: "{{Wortart|Adverb|Deutsch}}",
          PREFIX: "{{Wortart|Präfix|Deutsch}}",
          PRONOUN: /{{Wortart\|.*?[Pp]ronomen\|Deutsch}}/,
          ARTICLE: "{{Wortart|Artikel|Deutsch}}",
          ABBREVIATION: "{{Wortart|Abkürzung|Deutsch}}",
        },
        PARTS: {
          ALL: /{{.*?}}.*?\n\n/gms,
          SYNONYMS: "{{Synonyme}}",
          ANTONYMES: "{{Gegenwörter}}",
          EXAMPLES: "{{Beispiele}}",
          MEANINGS: "{{Bedeutungen}}",
        },
        DATA: {
          VERB: {
            TRANSITIVE: /[^in]trans.*?/,
            INTRANSITIVE: /intrans.*?/,
            REFLEXIVE: /refl.*?/,
            IRREGULAR: /unreg.*?/,
            SEPERABLE: /trenn.*?/,
            TENSES: {
              ALL: /\{\{Deutsch Verb Übersicht.*?\}\}/gms,
              PRESENT: {
                I: "\\|Präsens_ich=",
                YOU: "\\|Präsens_du=",
                IT: "\\|Präsens_er, sie, es=",
              },
              PAST: "\\|Präteritum_ich=",
              PAST_PERFECT: {
                NATIVE_SECTION: "\\|Partizip II=",
                HELP_VERB: "\\|Hilfsverb=",
              },
              IMPERATIVE: {
                SINGULAR: "\\|Imperativ Singular=",
                PLURAL: "\\|Imperativ Plural=",
              },
              SUBJUNCTIVE_2: "\\|Konjunktiv II_ich=",
            },
          },
        },
      },
    },
  },
};

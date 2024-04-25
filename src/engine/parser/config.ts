/**
 * General config for the parser, currently for one language only.
 * @prop TAGS A set of constant strings/regex sectioning the raw wiktionary data.
 * @prop FILES Relevant file paths.
 */

export class Config {
  FILES = {
    RAW_FILE_PATH: "data/raw/dewiktionary-20240420-pages-articles.xml",
  };
  TAGS = {
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
  };
}

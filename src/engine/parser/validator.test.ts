import {Language} from "../types";
import {PARSER_CONFIG} from "./config";
import {Validator} from "./validator";

describe("Test parser validator", () => {
  test("validator initalized correctly", () => {
    // Arrange
    const config = PARSER_CONFIG[Language.GERMAN];

    // Act
    const validator = new Validator(config);

    // Assert
    expect(validator.config).toBe(config);
    expect(validator.hasRelevantType).toBeDefined();
    expect(validator.isIntransitive).toBeDefined();
    expect(validator.isIrregular).toBeDefined();
    expect(validator.isLanguageSectionNative).toBeDefined();
    expect(validator.isReflexive).toBeDefined();
    expect(validator.isSeperable).toBeDefined();
    expect(validator.isTransitive).toBeDefined();
  });

  test("validate has relevant type", () => {
    // Arrange
    const config = PARSER_CONFIG[Language.GERMAN];
    const validator = new Validator(config);

    const allRelevantTypes = [
      "{{Wortart|Substantiv|Deutsch}}",
      "{{Wortart|Verb|Deutsch}}",
      "{{Wortart|Adjektiv|Deutsch}}",
      "{{Wortart|Adverb|Deutsch}}",
      "{{Wortart|Präfix|Deutsch}}",
      "{{Wortart|Pronomen|Deutsch}}",
      "{{Wortart|Personalpronomen|Deutsch}}",
      "{{Wortart|Artikel|Deutsch}}",
      "{{Wortart|Abkürzung|Deutsch}}",
    ];

    for (let type of allRelevantTypes) {
      // Act
      const result = validator.hasRelevantType(["foo", "bar", type]);

      // Assert
      expect(result).toBeTruthy();
    }
  });

  test("validate has relevant type without relevant type", () => {
    // Arrange
    const config = PARSER_CONFIG[Language.GERMAN];
    const validator = new Validator(config);

    // Act
    const result = validator.hasRelevantType(["foo", "bar"]);

    // Assert
    expect(result).toBeFalsy();
  });

  test("validate section is native language", () => {
    //TODO: Write test
  });

  test("validate verb is reflexive", () => {
    //TODO: Write test
  });

  test("validate verb is irregular", () => {
    //TODO: Write test
  });

  test("validate verb is trasitive", () => {
    //TODO: Write test
  });

  test("validate verb is intransitive", () => {
    //TODO: Write test
  });

  test("validate verb is seperable", () => {
    //TODO: Write test
  });
});

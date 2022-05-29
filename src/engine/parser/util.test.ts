import {getStringBetween, getFirstMatch} from "./util";

test("get string between two tags", () => {
  // Arrange
  const result = "foobar";
  const str1 = `<text>${result}</text>`;
  const str2 = `just some more text berfore tag <text>${result}</text>`;
  const str3 = `<text>${result}</text> just some more text after tag`;
  const str4 = `text before tag and also <text>${result}</text> text after tag`;
  const str5 = `some text <text>${result}</text> and a second <text>tag</text>`;

  // Act
  const res1 = getStringBetween("<text>", "</text>", str1);
  const res2 = getStringBetween("<text>", "</text>", str2);
  const res3 = getStringBetween("<text>", "</text>", str3);
  const res4 = getStringBetween("<text>", "</text>", str4);
  const res5 = getStringBetween("<text>", "</text>", str5);

  // Assert
  expect(res1).toBe(result);
  expect(res2).toBe(result);
  expect(res3).toBe(result);
  expect(res4).toBe(result);
  expect(res5).toBe(result);

  // Errors
  expect(() => {
    getStringBetween("notFound", "</text>", str5);
  }).toThrow("Opening Tag not found in string.");

  expect(() => {
    getStringBetween("<text>", "notFound", str5);
  }).toThrow("Closing Tag not found in string.");
});

test("get first match", () => {
  // Arrange
  const str1 =
    "some text with a few <foo> repeating <bar> elements to match on <baz> and so on";

  // Act
  const res1 = getFirstMatch(str1, /\<.*?\>/);
  const res2 = getFirstMatch(str1, /\<b.*?\>/);
  const res3 = getFirstMatch(str1, /\<notFound.*?\>/);

  // Assert
  expect(res1).toBe("<foo>");
  expect(res2).toBe("<bar>");
  expect(res3).toBe("");
});

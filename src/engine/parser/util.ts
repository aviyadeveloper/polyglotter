export const getStringBetween = (
  openingTag: string,
  closingTag: string,
  string: string
) =>
  string.slice(
    string.indexOf(openingTag) + openingTag.length,
    string.indexOf(closingTag)
  );

export const getFirstMatch = (content: string, regex: RegExp): string => {
  const match = content.match(regex);
  return match ? [...match][0] : "";
};

export const toEndOfLine = ".*";

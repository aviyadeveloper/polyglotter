import {throwIf} from "../util";

export const getStringBetween = (
  openingTag: string,
  closingTag: string,
  string: string
) => {
  const openingIndex = string.indexOf(openingTag);
  const closingIndex = string.indexOf(closingTag);
  throwIf(openingIndex < 0, "Opening Tag not found in string.");
  throwIf(closingIndex < 0, "Closing Tag not found in string.");
  return string.slice(openingIndex + openingTag.length, closingIndex);
};

export const getFirstMatch = (content: string, regex: RegExp): string => {
  const match = content.match(regex);
  return match ? [...match][0] : "";
};

export const toEndOfLine = ".*";

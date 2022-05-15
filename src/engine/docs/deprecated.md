# Deprecated Code

This is just a container to hold some deprecated methods that might be of later use or inspiration when working with the engine.

## Extractor

```ts
const extractNativeSections = (content: string) => {
  const matches = content.matchAll(/\=\=.*?{{Sprache\|.*?}}\).*?\=\=$/gm);

  const indexes = [];

  for (const match of matches) {
    indexes.push(match.index);
  }
  const start = indexes[0] || 0;
  const end = indexes[1] || content.length;

  return content.slice(start, end);
};
```

```ts
const extractWords = (
  content: string,
  meanings: string[]
): {
  explanations: string[];
  synonyms: string[];
  antonyms: string[];
  examples: string[];
}[] => {
  const words: {[k: string]: any} = meanings
    .map((x) => x.split(" ")[0])
    .reduce((a, b) => ({...a, [b]: {}}), {});

  const synonyms =
    extractContentPart(content, config.TAGS.WORD.PARTS.SYNONYMS) || [];
  const antonyms =
    extractContentPart(content, config.TAGS.WORD.PARTS.ANTONYMES) || [];
  const examples =
    extractContentPart(content, config.TAGS.WORD.PARTS.EXAMPLES) || [];

  Object.keys(words).forEach((k) => {
    words[k] = {
      explanations: extractPartContentByKey(meanings, k),
      synonyms: extractPartContentByKey(synonyms, k),
      antonyms: extractPartContentByKey(antonyms, k),
      examples: extractPartContentByKey(examples, k),
    };
  });
  return Object.values(words);
};
```

```ts
const extractPartContentByKey = (part: string[], key: string): string[] => {
  return part.reduce<string[]>((t, i) => {
    let [first, ...second] = i.split(" ");
    return first === key
      ? [...t, second.join(" ").replace(/\'|\[|\]/g, "")]
      : [...t];
  }, []);
};
```

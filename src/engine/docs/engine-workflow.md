# Steps

## Page

1. Get page
2. Get form
3. Create new form entry with empty words array

```js
forms: {
    form: "Leiter",
    words: []
}
```

4. Get page content
5. Get language sections

## Section

Per section:

1. Validate that native.
2. Get word definitions

## Word Unit

Per word unit:

1. validate that type is relevant
2. identify definitions.

## Word definition

per definition:

1. Create word object.

```js
word: {
    type: "Substantiv",
    typeSpecificData: {},
    definition: "Person, die etwas leitet..."
}
```

2. Scan word for the rest of the meaning-relevant data.

```js
{
    examples: [],
    synonyms: [],
    antonyms: [],
}
```

3. push full word object to `form.words`.

```js
forms: {
    form: "Leiter",
    words: [
        {
        type: "Substantiv",
        typeSpecificData: {},
        definition: "Person, die etwas leitet...",
        examples: [],
        synonyms: [],
        antonyms: [],
        },
        {
        type: "Substantiv",
        typeSpecificData: {},
        definition: "Physik, Technik: Stoff, der Energie [...] leitet...",
        examples: [],
        synonyms: [],
        antonyms: [],
        },
    ]
}
```

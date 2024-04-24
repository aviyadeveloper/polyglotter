# Intro

This engine takes wiktionary data dumps (`.xml`) and processes them into SQLITE databases with various linguistic structures according to the different langauge.

Supported Languages:

German

# Engine

## Steps:

1. Scan file for pages line by line.
2. From each page, take the [Form](#form)
3. Identify the various [Sections](#sections) in the page, and extract only the german ones.
4. For each section, parse out all meanings, create a Word object for each meaning, and populate it with the according data found in the section.
5. For each word, parse out the relevant extra data according to the word type.

## Glossary

### Form

The simple linguistic written form, it is unique to each page.

### Extended Form Data

Extension of the simply linguistic shape of the [Form](#form): gender for nouns, various tenses for verbs, and so on.

### Sections

Each page, while constrained to one form, may have various sections with different details relevant for the form. This may be the case when a form has various word-types associated to it, or relates to different words with basic data difference. Sometimes it is just due to general disorginzation of the wikitionray data.

For example: The form "Leiter" has 3 different sections:

1. Noun, Male: A leader.
2. Noun, Female: A ladder.
3. Noun, Female: German slang for textile types.

There is a clear need to seperate section 1, from 2 and 3, since data pertaining to the [Extended form data](#extended-form-data) (gender) is different. However, sections 2 and 3 should not be seprated. Various meanings can exist under one similar shape of form and form-data, and they should be united into one.

Note: Sections might be for a different language. This engine is concerened only with native linguistic data.

### Words

As forms are nothing but linguistic shapes, simple and extended, they may convey various meanings. This is the case with the vast majority of forms in the wiktionary. A word is derived from the connection of the form and the meaning, along with the extra information this connection has:

- Form
- Meaning
- Type
- Examples
- Antonyms
- Synonyms
- Extra Data Dependant on type

### Word Types

In order to process various words with various types it is important to identify the word type and parse the specific data accordingly. Nouns of example require gender, verbs however, require tenses and so on.

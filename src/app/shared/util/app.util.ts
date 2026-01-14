/**
 * Transforms a string containing {} in it by replacing all pair of
 * brackets {} with the specified arguments passed
 * @param template The input string to transform
 * @param replacements Optional values to replace {} in the string with
 * @returns The transformed string
 */
export function replace(template: string, ...replacements: any) {
  if (!template) return '';
  for (let val of replacements)
    template = template.replace('{}', (val ?? '').toString());
  return template;
}

/**
 * Creates unique ID for displayed verses
 * @param bookName Book name
 * @param verseOrdinal Consecutive verse number in chapter
 * @returns Unique ID
 */
export function getVerseHashtag(bookName: string, chapterId: number, verseOrdinal: number): string {
  bookName = bookName.toLowerCase();
  const numberInBookName = Number.parseInt(bookName.substring(0, 1))
  let hashtag = '';
  if (Number.isFinite(numberInBookName)) {
    hashtag = bookName.split(' ')[1].substring(0, 3) + chapterId.toString() + verseOrdinal;
  } else {
    hashtag = bookName.substring(0, 3) + chapterId.toString() + verseOrdinal;
  }
  return hashtag;
}

/**
 * Parses the modifier character in the data
 * @param value Data to parse
 * @returns Display value of the data
 */
export function parseCharacterMod(value: string) {
  const characterMod = value.charAt(0);
  const data = value.substring(1);
  switch (characterMod) {
    case '~': return `por el año ${data}`;
    case '!': return 'Incierto';
    case '.': return `a fin del siglo ${data}`;
    case '?': return `Tal vez ${data}`;
    case '/': return `entre los años ${data}`;
    case ':': return `en el siglo ${data}`;
    case '=': return `en el año ${data}`;
    case '<': return `antes del año ${data}`;
    case '>': return `después del año ${data}`;
    default: return value;
  }
}
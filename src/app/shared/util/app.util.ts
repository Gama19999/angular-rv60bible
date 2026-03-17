import { StateService } from '../services/state.service';
import { FavouriteData, Language, MenuData, NavigationData, VerseData } from './app.interfaces';

/**
 * @param template The input string to transform
 * @param values Optional values to use as replacements for `{keyword}` in the string
 * @returns String with all ocurrences of `{keyword}` replaced with the specified values
 */
export function replace(template: string, ...values: any) {
  if (!template) return '';
  for (let val of values)
    template = template.replace(/\{([^}]+)\}/, (val ?? '').toString());
  return template;
}

/**
 * @param bookName Book name
 * @param targetId Target ID
 * @returns If `targetId` is present returns a unique ID for displayed (`chapter` or `verse`)
 */
export function getTargetHashtag(bookName: string, targetId: any): string {
  let hashtag;
  bookName = normalize(bookName);
  const numberInBookName = Number.parseInt(bookName.substring(0, 1));
  if (Number.isFinite(numberInBookName))
    hashtag = targetId ? bookName.split(' ')[1].substring(0, 3) + targetId : '';
  else
    hashtag = targetId ? bookName.substring(0, 3) + targetId : '';
  return hashtag;
}

/**
 * @param str String to normalize
 * @returns String in `lower-case` and `without accents` nor `ñ`
 */
export function normalize(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Opens the target view with the element attached data
 * @param el Lookup match element
 * @param versionKey Current bible KEY
 * @param stateSrv State service instance
 */
export function openTargetWith(el: HTMLElement, versionKey: string, stateSrv: StateService) {
  const { bookName, verseId, chapterId } = el.dataset;
  const navData: NavigationData = { ...el.dataset, versionKey: versionKey };
  if (verseId) {
    navData.hash = getTargetHashtag(bookName!, verseId!);
    stateSrv.navigate('verses', navData);
  } else {
    navData.hash = getTargetHashtag(bookName!, chapterId!);
    stateSrv.navigate('chapters', navData);
  }
}

/**
 * Opens the reader view on the specified favourite
 * @param favourite Favourite data
 * @param versionKey Current bible KEY
 * @param stateSrv State service instance
 */
export function openReaderOn(favourite: FavouriteData, versionKey: string, stateSrv: StateService) {
  const hash = getTargetHashtag(favourite.bookName, favourite.verseId);
  const navData: NavigationData = { ...favourite, versionKey: versionKey, hash: hash };
  stateSrv.navigate('verses', navData);
}

/**
 * @param evt Client pointer event
 * @param verse Verse data
 * @returns Context menu data
 */
export function getMenuData(evt: PointerEvent, verse?: VerseData): MenuData {
  evt.preventDefault();
  const topOffset = (window.innerHeight - 235) > evt.pageY ? evt.pageY : window.innerHeight - 240;
  const leftOffset = (window.innerWidth - 200) > evt.pageX ? evt.pageX : window.innerWidth - 205;
  return { top: topOffset, left: leftOffset, verse: verse };
}

/**
 * Parses the modifier character in the data
 * @param value Data to parse
 * @returns Display value of the data
 */
export function parseCharacterMod(value: string, lang: Language) {
  const characterMod = value.charAt(0);
  const data = value.substring(1);
  return /^\p{Letter}/u.test(characterMod) ? value : lang.str.books.character[characterMod](data);
}
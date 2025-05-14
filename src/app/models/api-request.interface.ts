import { VerseRequest } from './verse-request.template';

/**
 * Representation of PHP API request
 */
export interface APIRequest {
  endpoint: string;
  vr: VerseRequest | undefined;
}

/**
 * JSON generator for endpoint <b>get-all-books</b>
 */
export const apiGetAllBooks = (): APIRequest => { return {endpoint: 'get-all-books', vr: undefined}; }

/**
 * JSON generator for endpoint <b>get-verses-on</b>
 * @param vr VerseRequest JSON
 */
export const apiGetVersesOn = (vr: VerseRequest): APIRequest => {
  return {endpoint: 'get-verses-on', vr: vr};
};

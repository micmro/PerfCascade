/**
 *  Misc Helpers
 */

/**
 * Parses URL into its components
 * @param  {string} url
 */
function parseUrl(url: string) {
  let pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
  let matches = url.match(pattern);
  return {
    authority: matches[4],
    fragment: matches[9],
    path: matches[5],
    query: matches[7],
    scheme: matches[2],
  };
}

/**
 * @param  {T[]} arr - array to search
 * @param  {T} item - item to search for
 * @returns boolean - true if `item` is in `arr`
 */
export function contains<T>(arr: T[], item: T): boolean {
  return arr.some((x) => x === item);
}

/**
 * Returns Index of first match to `predicate` in `arr`
 * @param arr Array to search
 * @param predicate Function that returns true for a match
 */
export function findIndex<T>(arr: T[], predicate: {(el: T, index: number): Boolean}) {
  let i = 0;
  if (!arr || arr.length < 1) {
    return undefined;
  }
  const len = arr.length;
  while (i < len) {
    if (predicate(arr[i], i)) {
      return i;
    }
    i++;
  }
  return undefined;
}

/**
 * Returns first match to `predicate` in `arr`
 * @param arr Array to search
 * @param predicate Function that returns true for a match
 */
export function find<T>(arr: T[], predicate: {(el: T, index: number): Boolean}) {
  const index = findIndex(arr, predicate);
  if (index === undefined) {
    return undefined;
  }
  return arr[index];
}

/**
 * Formats and shortens a url for ui
 * @param  {string} url
 * @param  {number} maxLength - max length of shortened url
 * @returns string
 */
export function resourceUrlFormatter(url: string, maxLength: number): string {
  if (url.length < maxLength) {
    return url.replace(/https?:\/\//, "");
  }

  let matches = parseUrl(url);

  if ((matches.authority + matches.path).length < maxLength) {
    return matches.authority + matches.path;
  }

  const maxAuthLength = Math.floor(maxLength / 2) - 3;
  const maxPathLength = Math.floor(maxLength / 2) - 5;
  // maybe we could fine tune these numbers
  let p = matches.path.split("/");
  if (matches.authority.length > maxAuthLength) {
    return matches.authority.substr(0, maxAuthLength) + "..." + p[p.length - 1].substr(-maxPathLength);
  }
  return matches.authority + "..." + p[p.length - 1].substr(-maxPathLength);
}

/**
 * Helper to add a precision to `Math.round`.
 *
 * _defaults to 2 decimals_
 * @param  {number} num - number to round
 * @param  {number} [decimals=2] - decimal precision to round to
 */
export function roundNumber(num: number, decimals: number = 2) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 *
 * Checks if `status` code is `>= lowerBound` and `<= upperBound`
 * @param  {number} status  HTTP status code
 * @param  {number} lowerBound  inclusive lower bound
 * @param  {number} upperBound  inclusive upper bound
 */
export function isInStatusCodeRange(status: number, lowerBound: number, upperBound: number) {
  return status >= lowerBound && status <= upperBound;
}

/** precompiled regex */
const cssClassRegEx = /[^a-z-]/g;

/**
 * Converts a seed string to a CSS class by stripping out invalid characters
 * @param {string} seed string to base the CSS class off
 */
export function toCssClass(seed: string) {
  return seed.toLowerCase().replace(cssClassRegEx, "");
}

/**
 * Conditionally pluralizes (adding 's') `word` based on `count`
 * @param {string} word word to pluralize
 * @param {number} count counter to deceide weather or not `word` should be pluralized
 */
export function pluralize(word: string, count: number) {
  return word + (count > 1 ? "s" : "");
}

/**
 * Check if event is `tab` + `shift` key, to move to previous input element
 * @param {KeyboardEvent} evt Keyboard event
 */
export function isTabUp(evt: KeyboardEvent) {
  return evt.which === 9 && evt.shiftKey;
}

/**
 * Check if event is only `tab` key, to move to next input element
 * @param {KeyboardEvent} evt Keyboard event
 */
export function isTabDown(evt: KeyboardEvent) {
  return evt.which === 9 && !evt.shiftKey;
}

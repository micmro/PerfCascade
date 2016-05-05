/**
 *  Misc Helpers
 */

/**
 * Parses URL into it's components
 * @param  {string} url
 */
export function parseUrl(url: string) {
  let pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
  let matches = url.match(pattern);
  return {
    scheme: matches[2],
    authority: matches[4],
    path: matches[5],
    query: matches[7],
    fragment: matches[9]
  }
}

/**
 * @param  {Array<T>} arr - array to search
 * @param  {T} item - item to search for
 * @returns boolean - true if `item` is in `arr`
 */
export function contains<T>(arr: Array<T>, item: T): boolean {
  return arr.filter((x) => x === item).length > 0
}

/**
 * formats and shortes a url for ui
 * @param  {string} url
 * @returns string
 */
export function ressourceUrlFormater(url: string): string {
  const maxLength = 40
  if (url.length < maxLength) {
    return url.replace(/http[s]\:\/\//, "")
  }

  let matches = parseUrl(url)

  if ((matches.authority + matches.path).length < maxLength) {
    return matches.authority + matches.path
  }

  // maybe we could finetune these numbers
  let p = matches.path.split("/")
  if (matches.authority.length > 17) {
    return matches.authority.substr(0, 17) + "..." + p[p.length - 1].substr(-15)
  }
  return matches.authority + "..." + p[p.length - 1].substr(-15)
}

/**
 * Helper to add a precision to `Math.round`
 * @param  {number} num - number to round
 * @param  {number} decimals - decimal precision to round to
 */
export function roundNumber(num: number, decimals: number) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

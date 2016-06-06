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
 * @param  {number} maxLength - max length of shortened url
 * @returns string
 */
export function ressourceUrlFormater(url: string, maxLength: number): string {
  if (url.length < maxLength) {
    return url.replace(/http[s]\:\/\//, "")
  }

  let matches = parseUrl(url)

  if ((matches.authority + matches.path).length < maxLength) {
    return matches.authority + matches.path
  }

  const maxAuthLength = Math.floor(maxLength / 2) - 3;
  const maxPathLenth = Math.floor(maxLength / 2) - 5
  // maybe we could finetune these numbers
  let p = matches.path.split("/")
  if (matches.authority.length > maxAuthLength) {
    return matches.authority.substr(0, maxAuthLength) + "..." + p[p.length - 1].substr(-maxPathLenth)
  }
  return matches.authority + "..." + p[p.length - 1].substr(-maxPathLenth)
}

/**
 * Helper to add a precision to `Math.round`
 * @param  {number} num - number to round
 * @param  {number} decimals - decimal precision to round to
 */
export function roundNumber(num: number, decimals: number) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}


/**
 *
 * Helper to polyfill `Object.assign` since the target is not ES6
 * @param  {Object} target
 * @param  {Object[]} ...sources
 */
export function assign(target: Object, ...sources: Object[]) {
  if (target === undefined || target === null) {
    throw new TypeError("Cannot convert undefined or null to object")
  }
  let output = Object(target);
  for (let index = 1; index < arguments.length; index++) {
    let source = arguments[index];
    if (source !== undefined && source !== null) {
      for (let nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
  }
  return output;
}

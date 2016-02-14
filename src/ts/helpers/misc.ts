/**
 *  Misc Helpers
 */


let misc = {
  parseUrl: function parseUrl(url) {
    let pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
    let matches = url.match(pattern);
    return {
      scheme: matches[2],
      authority: matches[4],
      path: matches[5],
      query: matches[7],
      fragment: matches[9]
    }
  },
  contains: function contains<T>(arr: Array<T>, item: T): boolean {
    return arr.filter((x) => x === item).length > 0
  }
}

export default misc

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
  },
  ressourceUrlFormater: function ressourceUrlFormater(url: string): string {
    const maxLength = 40
    if (url.length < maxLength) {
      return url.replace(/http[s]\:\/\//, "")
    }

    let matches = misc.parseUrl(url)

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
}

export default misc

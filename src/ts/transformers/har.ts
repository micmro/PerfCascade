import {
  Har,
  Entry
} from "../typing/har"
import {
  WaterfallDocs,
  WaterfallData,
  Mark, RequestType, TimingType
} from "../typing/waterfall"

class WaterfallEntry {
  public total: number
  constructor(public name: string,
              public start: number,
              public end: number,
              public segments: WaterfallEntryTiming[] = [],
              public rawResource: Entry,
              public requestType: RequestType) {
    this.total = (typeof start !== "number" || typeof end !== "number") ? undefined : (end - start)
  }
} class WaterfallEntryTiming {
  public total: number
  constructor(public type: TimingType,
              public start: number,
              public end: number) {
    this.total = (typeof start !== "number" || typeof end !== "number") ? undefined : (end - start)
  }
}

/**
 * Convert a MIME type into it's WPT style request type (font, script etc)
 * @param {string} mimeType
 */
function mimeToRequestType(mimeType: string): RequestType {
  if (mimeType === undefined) {
    return "other"
  }
  let types = mimeType.split("/")
  let part2 = types[1]
  // take care of text/css; charset=UTF-8 etc
  if (part2 !== undefined) {
    part2 = part2.indexOf(";") > -1 ? part2.split(";")[0] : part2
  }
  switch (types[0]) {
    case "image": return "image"
    case "font": return "font"
    case "video": return "video"
    case "audio": return "audio"
    default: break
  }
  switch (part2) {
    case "svg+xml": return "svg"
    case "xml":
    case "html": return "html"
    case "plain": return "plain"
    case "css": return "css"
    case "vnd.ms-fontobject":
    case "font-woff":
    case "font-woff2":
    case "x-font-truetype":
    case "x-font-opentype":
    case "x-font-woff": return "font"
    case "javascript":
    case "x-javascript":
    case "script":
    case "json": return "javascript"
    case "x-shockwave-flash": return "flash"
    default: return "other"
  }
}

export namespace HarTransformer {

  /**
   * Transforms the full HAR doc, including all pages
   * @param  {Har} harData - raw hhar object
   * @returns WaterfallDocs
   */
  export function transformDoc(harData: Har): WaterfallDocs {
    // make sure it's the *.log base node
    let data = (harData["log"] !== undefined ? harData["log"] : harData) as Har
    console.log("HAR created by %s(%s) %s page(s)", data.creator.name, data.creator.version, data.pages.length)

    let waterfallDocs = {
      pages: data.pages.map((_page, i) => this.transformPage(data, i))
    } as WaterfallDocs
    return waterfallDocs
  }
  /**
   * Transforms a HAR object into the format needed to render the PerfCascade
   * @param  {Har} harData - HAR document
   * @param {number=0} pageIndex - page to parse (for multi-page HAR)
   * @returns WaterfallData
   */
  export function transformPage(harData: Har, pageIndex: number = 0): WaterfallData {
    // make sure it's the *.log base node
    let data = (harData["log"] !== undefined ? harData["log"] : harData) as Har

    const currentPageIndex = pageIndex
    const currPage = data.pages[currentPageIndex]
    const pageStartTime = new Date(currPage.startedDateTime).getTime()
    const pageTimings = currPage.pageTimings

    console.log("%s: %s of %s page(s)", currPage.title, pageIndex + 1, data.pages.length)

    let doneTime = 0;
    const blocks = data.entries
      .filter((entry) => entry.pageref === currPage.id)
      .map((entry) => {
        const startRelative = new Date(entry.startedDateTime).getTime() - pageStartTime

        doneTime = Math.max(doneTime, startRelative + entry.time)

        const requestType = mimeToRequestType(entry.response.content.mimeType);
        return new WaterfallEntry(entry.request.url,
          startRelative,
          parseInt(entry._all_end, 10) || (startRelative + entry.time),
          buildDetailTimingBlocks(startRelative, entry),
          entry,
          requestType
        )
      })

    const marks = Object.keys(pageTimings)
      .filter((k) => (typeof pageTimings[k] === "number" && pageTimings[k] >= 0))
      .sort((a: string, b: string) => pageTimings[a] > pageTimings[b] ? 1 : -1)
      .map((k) => {
        const startRelative = pageTimings[k]

        doneTime = Math.max(doneTime, startRelative)

        return {
          "name": `${k.replace(/^[_]/, "")} (${startRelative}ms)`,
          "startTime": startRelative
        } as Mark
      })

    // Add 100ms margin to make room for labels
    doneTime += 100

    return {
      durationMs: doneTime,
      blocks: blocks,
      marks: marks,
      lines: [],
      title: currPage.title,
    }
  }
  /**
   * Create `WaterfallEntry`s to represent the subtimings of a request ("blocked", "dns", "connect", "send", "wait", "receive")
   * @param  {number} startRelative - Number of milliseconds since page load started (`page.startedDateTime`)
   * @param  {Entry} entry
   * @returns Array
   */
  function buildDetailTimingBlocks(startRelative: number, entry: Entry): WaterfallEntryTiming[] {
    let t = entry.timings
    return ["blocked", "dns", "connect", "send", "wait", "receive"].reduce((collect: WaterfallEntryTiming[], key: TimingType) => {

      const time = getTimePair(key, entry, collect, startRelative)

      if (time.end && time.start >= time.end) {
        return collect
      }

      // special case for 'connect' && 'ssl' since they share time
      // http://www.softwareishard.com/blog/har-12-spec/#timings
      if (key === "connect" && t["ssl"] && t["ssl"] !== -1) {
        const sslStart = parseInt(entry[`_ssl_start`], 10) || time.start
        const sslEnd = parseInt(entry[`_ssl_end`], 10) || time.start + t.ssl
        const connectStart = (!!parseInt(entry[`_ssl_start`], 10)) ? time.start : sslEnd
        return collect
          .concat([new WaterfallEntryTiming("ssl", sslStart, sslEnd)])
          .concat([new WaterfallEntryTiming(key, connectStart, time.end)])
      }

      return collect.concat([new WaterfallEntryTiming(key, time.start, time.end)])
    }, [])
  }

  /**
   * Returns Object containing start and end time of `collect`
   *
   * @param  {string} key
   * @param  {Entry} entry
   * @param  {WaterfallEntry[]} collect
   * @param  {number} startRelative - Number of milliseconds since page load started (`page.startedDateTime`)
   * @returns {Object}
   */
  function getTimePair(key: string, entry: Entry, collect: WaterfallEntryTiming[], startRelative: number) {
    let wptKey;
    switch (key) {
      case "wait": wptKey = "ttfb"; break
      case "receive": wptKey = "download"; break
      default: wptKey = key
    }
    const preciseStart = parseInt(entry[`_${wptKey}_start`], 10)
    const preciseEnd = parseInt(entry[`_${wptKey}_end`], 10)
    const start = isNaN(preciseStart) ? ((collect.length > 0) ? collect[collect.length - 1].end : startRelative) : preciseStart
    const end = isNaN(preciseEnd) ? (start + entry.timings[key]) : preciseEnd

    return {
      "start": start,
      "end": end
    }
  }
}

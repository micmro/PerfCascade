import {
  Har,
  Entry
} from "../typing/har.d"
import {
  WaterfallDocs,
  WaterfallData,
  Mark
} from "../typing/waterfall-data.d"
import TimeBlock from "../typing/time-block"
import {
  mimeToCssClass,
  mimeToRequestType
} from "./styling-converters"


export default class HarTransformer {

  /**
   * Trasforms the full HAR doc, including all pages
   * @param  {Har} harData - raw hhar object
   * @returns WaterfallDocs
   */
  public static transformDoc(harData: Har): WaterfallDocs {
    //make sure it's the *.log base node
    let data = (harData["log"] !== undefined ? harData["log"] : harData) as Har

    console.time("transform HAR Doc")
    let waterfallDocs = {
      pages: data.pages.map((page, i) => this.transformPage(data, i))
    } as WaterfallDocs
    console.timeEnd("transform HAR Doc")
    return waterfallDocs
  }
  /**
   * Transforms a HAR object into the format needed to render the PerfCascade
   * @param  {Har} harData - HAR document
   * @param {number=0} pageIndex - page to parse (for multi-page HAR)
   * @returns WaterfallData
   */
  public static transformPage(harData: Har, pageIndex: number = 0): WaterfallData {
    //make sure it's the *.log base node
    let data = (harData["log"] !== undefined ? harData["log"] : harData) as Har
    console.log("HAR created by %s(%s) %s of %s page(s)", data.creator.name, data.creator.version, pageIndex + 1, data.pages.length)

    //only support one page (first) for now
    const currentPageIndex = pageIndex
    const currPage = data.pages[currentPageIndex]
    const pageStartTime = new Date(currPage.startedDateTime).getTime()
    const pageTimings = currPage.pageTimings

    let doneTime = 0;
    const blocks = data.entries
      .filter(entry => entry.pageref === currPage.id)
      .map((entry) => {
        const startRelative = new Date(entry.startedDateTime).getTime() - pageStartTime

        if (doneTime < (startRelative + entry.time)) {
          doneTime = startRelative + entry.time
        }

        return new TimeBlock(entry.request.url,
          startRelative,
          parseInt(entry._all_end, 10) || (startRelative + entry.time),
          mimeToCssClass(entry.response.content.mimeType),
          this.buildDetailTimingBlocks(startRelative, entry),
          entry,
          mimeToRequestType(entry.response.content.mimeType)
        )
      })


    const marks = Object.keys(pageTimings)
      .filter(k => (pageTimings[k] !== undefined && pageTimings[k] >= 0))
      .sort((a: string, b: string) => pageTimings[a] > pageTimings[b] ? 1 : -1)
      .map(k => {
        const startRelative = pageTimings[k]

        return {
          "name": `${k.replace(/^[_]/, "")} (${startRelative}ms)`,
          "startTime": startRelative
        } as Mark
      })

    return {
      durationMs: doneTime,
      blocks: blocks,
      marks: marks,
      lines: [],
    }
  }
  /**
   * Create `TimeBlock`s to represent the subtimings of a request ("blocked", "dns", "connect", "send", "wait", "receive")
   * @param  {number} startRelative - Number of milliseconds since page load started (`page.startedDateTime`)
   * @param  {Entry} entry
   * @returns Array
   */
  public static buildDetailTimingBlocks(startRelative: number, entry: Entry): Array<TimeBlock> {
    let t = entry.timings
    return ["blocked", "dns", "connect", "send", "wait", "receive"].reduce((collect: Array<TimeBlock>, key) => {

      const time = this.getTimePair(key, entry, collect, startRelative)

      if (time.end && time.start >= time.end) {
        return collect
      }

      //special case for 'connect' && 'ssl' since they share time
      //http://www.softwareishard.com/blog/har-12-spec/#timings
      if (key === "connect" && t["ssl"] && t["ssl"] !== -1) {
        const sslStart = parseInt(entry[`_ssl_start`], 10) || time.start
        const sslEnd = parseInt(entry[`_ssl_end`], 10) || time.start + t.ssl
        const connectStart = (!!parseInt(entry[`_ssl_start`], 10)) ? time.start : sslEnd
        return collect
          .concat([new TimeBlock("ssl", sslStart, sslEnd, "block-ssl")])
          .concat([new TimeBlock(key, connectStart, time.end, "block-" + key)])
      }

      return collect.concat([new TimeBlock(key, time.start, time.end, "block-" + key)])

    }, [])
  }

  /**
   * Returns Object containing start and end time of `collect`
   *
   * @param  {string} key
   * @param  {Entry} entry
   * @param  {Array<TimeBlock>} collect
   * @param  {number} startRelative - Number of milliseconds since page load started (`page.startedDateTime`)
   * @returns {Object}
   */
  private static getTimePair(key: string, entry: Entry, collect: Array<TimeBlock>, startRelative: number) {
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

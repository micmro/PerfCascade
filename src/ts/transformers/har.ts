import { roundNumber } from "../helpers/misc";
import { Entry, Har, PageTimings } from "../typing/har";
import {
  Mark,
  RequestType,
  TimingType,
  WaterfallData,
  WaterfallDocs,
  WaterfallEntry,
  WaterfallEntryTiming,
} from "../typing/waterfall";

function createWaterfallEntry(name: string,
                              start: number,
                              end: number,
                              segments: WaterfallEntryTiming[] = [],
                              rawResource: Entry,
                              requestType: RequestType): WaterfallEntry {
  const total = (typeof start !== "number" || typeof end !== "number") ? undefined : (end - start);
  return {
    total,
    name,
    start,
    end,
    segments,
    rawResource,
    requestType,
  };
}

function createWaterfallEntryTiming(type: TimingType,
                                    start: number,
                                    end: number): WaterfallEntryTiming {
  const total = (typeof start !== "number" || typeof end !== "number") ? undefined : (end - start);
  return {
    total,
    type,
    start,
    end,
  };
}

/**
 * Convert a MIME type into it's WPT style request type (font, script etc)
 * @param {string} mimeType
 */
function mimeToRequestType(mimeType: string): RequestType {
  if (mimeType === undefined) {
    return "other";
  }
  let types = mimeType.split("/");
  let part2 = types[1];
  // take care of text/css; charset=UTF-8 etc
  if (part2 !== undefined) {
    part2 = part2.indexOf(";") > -1 ? part2.split(";")[0] : part2;
  }
  switch (types[0]) {
    case "image": {
      if (part2 === "svg+xml") {
        return "svg";
      }
      return "image";
    }
    case "font": return "font";
    case "video": return "video";
    case "audio": return "audio";
    default: break;
  }
  switch (part2) {
    case "xml":
    case "html": return "html";
    case "plain": return "plain";
    case "css": return "css";
    case "vnd.ms-fontobject":
    case "font-woff":
    case "font-woff2":
    case "x-font-truetype":
    case "x-font-opentype":
    case "x-font-woff": return "font";
    case "javascript":
    case "x-javascript":
    case "script":
    case "json": return "javascript";
    case "x-shockwave-flash": return "flash";
    default: return "other";
  }
}

/**
 * Transforms the full HAR doc, including all pages
 * @param  {Har} harData - raw hhar object
 * @returns WaterfallDocs
 */
export function transformDoc(harData: Har): WaterfallDocs {
  // make sure it's the *.log base node
  let data = (harData["log"] !== undefined ? harData["log"] : harData) as Har;
  console.log("HAR created by %s(%s) %s page(s)", data.creator.name, data.creator.version, data.pages.length);

  return {
    pages: data.pages.map((_page, i) => this.transformPage(data, i)),
  };
}
/**
 * Transforms a HAR object into the format needed to render the PerfCascade
 * @param  {Har} harData - HAR document
 * @param {number=0} pageIndex - page to parse (for multi-page HAR)
 * @returns WaterfallData
 */
export function transformPage(harData: Har, pageIndex: number = 0): WaterfallData {
  function toInt(input: string | number): number {
    if (typeof input === "string") {
      return parseInt(input, 10);
    } else {
      return input;
    }
  }

  // make sure it's the *.log base node
  let data = (harData["log"] !== undefined ? harData["log"] : harData) as Har;

  const currPage = data.pages[pageIndex];
  const pageStartTime = new Date(currPage.startedDateTime).getTime();
  const pageTimings = currPage.pageTimings;

  console.log("%s: %s of %s page(s)", currPage.title, pageIndex + 1, data.pages.length);

  let doneTime = 0;
  const entries = data.entries
    .filter((entry) => entry.pageref === currPage.id)
    .map((entry) => {
      const startRelative = new Date(entry.startedDateTime).getTime() - pageStartTime;

      doneTime = Math.max(doneTime, startRelative + entry.time);

      const requestType = mimeToRequestType(entry.response.content.mimeType);
      return createWaterfallEntry(entry.request.url,
        startRelative,
        toInt(entry._all_end) || (startRelative + entry.time),
        buildDetailTimingBlocks(startRelative, entry),
        entry,
        requestType,
      );
    });

  const marks = Object.keys(pageTimings)
    .filter((k: keyof PageTimings) => (typeof pageTimings[k] === "number" && pageTimings[k] >= 0))
    .sort((a: string, b: string) => pageTimings[a] > pageTimings[b] ? 1 : -1)
    .map((k) => {
      const startRelative: number = pageTimings[k];

      doneTime = Math.max(doneTime, startRelative);

      return {
        "name": `${k.replace(/^[_]/, "")} (${roundNumber(startRelative, 0)} ms)`,
        "startTime": startRelative,
      } as Mark;
    });

  // Add 100ms margin to make room for labels
  doneTime += 100;

  return {
    durationMs: doneTime,
    entries,
    marks,
    lines: [],
    title: currPage.title,
  };
}
/**
 * Create `WaterfallEntry`s to represent the subtimings of a request
 * ("blocked", "dns", "connect", "send", "wait", "receive")
 * @param  {number} startRelative - Number of milliseconds since page load started (`page.startedDateTime`)
 * @param  {Entry} harEntry
 * @returns Array
 */
function buildDetailTimingBlocks(startRelative: number, harEntry: Entry): WaterfallEntryTiming[] {
  let t = harEntry.timings;
  return ["blocked", "dns", "connect", "send", "wait", "receive"].reduce((collect: WaterfallEntryTiming[],
                                                                          key: TimingType) => {

    const time = getTimePair(key, harEntry, collect, startRelative);

    if (time.end && time.start >= time.end) {
      return collect;
    }

    // special case for 'connect' && 'ssl' since they share time
    // http://www.softwareishard.com/blog/har-12-spec/#timings
    if (key === "connect" && t["ssl"] && t["ssl"] !== -1) {
      const sslStart = parseInt(harEntry[`_ssl_start`], 10) || time.start;
      const sslEnd = parseInt(harEntry[`_ssl_end`], 10) || time.start + t.ssl;
      const connectStart = (!!parseInt(harEntry[`_ssl_start`], 10)) ? time.start : sslEnd;
      return collect
        .concat([createWaterfallEntryTiming("ssl", sslStart, sslEnd)])
        .concat([createWaterfallEntryTiming(key, connectStart, time.end)]);
    }

    return collect.concat([createWaterfallEntryTiming(key, time.start, time.end)]);
  }, []);
}

/**
 * Returns Object containing start and end time of `collect`
 *
 * @param  {string} key
 * @param  {Entry} harEntry
 * @param  {WaterfallEntry[]} collect
 * @param  {number} startRelative - Number of milliseconds since page load started (`page.startedDateTime`)
 * @returns {Object}
 */
function getTimePair(key: string, harEntry: Entry, collect: WaterfallEntryTiming[], startRelative: number) {
  let wptKey;
  switch (key) {
    case "wait": wptKey = "ttfb"; break;
    case "receive": wptKey = "download"; break;
    default: wptKey = key;
  }
  const preciseStart = parseInt(harEntry[`_${wptKey}_start`], 10);
  const preciseEnd = parseInt(harEntry[`_${wptKey}_end`], 10);
  const start = isNaN(preciseStart) ?
    ((collect.length > 0) ? collect[collect.length - 1].end : startRelative) : preciseStart;
  const end = isNaN(preciseEnd) ? (start + harEntry.timings[key]) : preciseEnd;

  return {
    "end": end,
    "start": start,
  };
}

import { roundNumber } from "../helpers/misc";
import { toInt } from "../helpers/parse";
import { Entry, Har, PageTimings } from "../typing/har";
import {
  Mark,
  RequestType,
  TimingType,
  WaterfallData,
  WaterfallDocs,
  WaterfallEntry,
  WaterfallEntryIndicator,
  WaterfallEntryTab,
  WaterfallEntryTiming,
} from "../typing/waterfall";
import { collectIndicators, documentIsSecure } from "./har-heuristics";
import { makeTabs } from "./har-tabs";
import { mimeToRequestType } from "./helpers";

function createWaterfallEntry(url: string,
                              start: number,
                              end: number,
                              segments: WaterfallEntryTiming[] = [],
                              rawResource: Entry,
                              requestType: RequestType,
                              indicators: WaterfallEntryIndicator[],
                              tabs: WaterfallEntryTab[]): WaterfallEntry {
  const total = (typeof start !== "number" || typeof end !== "number") ? undefined : (end - start);
  return {
    total,
    url,
    start,
    end,
    segments,
    rawResource,
    requestType,
    indicators,
    tabs,
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
 * Converts an HAR `Entry` into PerfCascads `WaterfallEntry`
 *
 * @param  {Entry} entry
 * @param  {number} index - resource entry index
 * @param  {number} startRelative - entry start time relative to the document in ms
 * @param  {boolean} isTLS
 */
function toWaterFallEntry(entry: Entry, index: number, startRelative: number, isTLS: boolean) {
  const endRelative = toInt(entry._all_end) || (startRelative + entry.time);
  const requestType = mimeToRequestType(entry.response.content.mimeType);
  const indicators = collectIndicators(entry, isTLS, requestType);
  return createWaterfallEntry(entry.request.url,
    startRelative,
    endRelative,
    buildDetailTimingBlocks(startRelative, entry),
    entry,
    requestType,
    indicators,
    makeTabs(entry, (index + 1), requestType, startRelative, endRelative, indicators),
  );
}

/**
 * Transforms a HAR object into the format needed to render the PerfCascade
 * @param  {Har} harData - HAR document
 * @param {number=0} pageIndex - page to parse (for multi-page HAR)
 * @returns WaterfallData
 */
export function transformPage(harData: Har, pageIndex: number = 0): WaterfallData {
  // make sure it's the *.log base node
  let data = (harData["log"] !== undefined ? harData["log"] : harData) as Har;

  const currPage = data.pages[pageIndex];
  const pageStartTime = new Date(currPage.startedDateTime).getTime();
  const pageTimings = currPage.pageTimings;

  console.log("%s: %s of %s page(s)", currPage.title, pageIndex + 1, data.pages.length);

  let doneTime = 0;
  const isTLS = documentIsSecure(data.entries);
  const entries = data.entries
    .filter((entry) => entry.pageref === currPage.id)
    .map((entry, index) => {
      const startRelative = new Date(entry.startedDateTime).getTime() - pageStartTime;
      doneTime = Math.max(doneTime, startRelative + entry.time);
      return toWaterFallEntry(entry, index, startRelative, isTLS);
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
    docIsTLS: isTLS,
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

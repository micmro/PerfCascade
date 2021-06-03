import {
  Entry,
  Har,
  Log,
  Page,
  PageTiming,
} from "har-format";
import { roundNumber } from "../helpers/misc";
import { escapeHtml, toInt } from "../helpers/parse";
import { ChartOptions, HarTransformerOptions } from "../typing/options";
import {
  Mark,
  TimingType,
  UserTiming,
  WaterfallData,
  WaterfallDocs,
  WaterfallEntry,
  WaterfallEntryIndicator,
  WaterfallEntryTiming,
  WaterfallResponseDetails,
} from "../typing/waterfall";
import { collectIndicators, documentIsSecure } from "./har-heuristics";
import { makeTabs } from "./har-tabs";
import {
  createWaterfallEntry,
  createWaterfallEntryTiming,
  makeMimeTypeIcon,
  makeRowCssClasses,
  mimeToRequestType,
} from "./helpers";

/**
 * Transforms the full HAR doc, including all pages
 * @param  {Har} harData - raw HAR object
 * @param {HarTransformerOptions} options - HAR-parser-specific options
 * @returns WaterfallDocs
 */
export function transformDoc(harData: Har | Log, options: HarTransformerOptions): WaterfallDocs {
  // make sure it's the *.log base node
  const data = (harData["log"] !== undefined ? harData["log"] : harData) as Log;
  const pages = getPages(data);

  return {
    pages: pages.map((_page, i) => transformPage(data, i, options)),
  };
}

/**
 * Converts an HAR `Entry` into PerfCascade's `WaterfallEntry`
 *
 * @param  {Entry} entry
 * @param  {number} index - resource entry index
 * @param  {number} startRelative - entry start time relative to the document in ms
 * @param  {boolean} isTLS
 */
function toWaterFallEntry(entry: Entry, index: number, startRelative: number, isTLS: boolean): WaterfallEntry {
  startRelative = Math.round(startRelative);
  const endRelative = Math.round(toInt(entry._all_end) || (startRelative + entry.time));
  const requestType = mimeToRequestType(entry.response.content.mimeType);
  const indicators = collectIndicators(entry, index, isTLS, requestType);
  const responseDetails = createResponseDetails(entry, indicators);
  return createWaterfallEntry(entry.request.url,
    startRelative,
    endRelative,
    buildDetailTimingBlocks(startRelative, entry),
    responseDetails,
    makeTabs(entry, (index + 1), requestType, startRelative, endRelative, indicators),
  );
}

/** Returns the page or a mock page object */
const getPages = (data: Log) => {
  if (data.pages && data.pages.length > 0) {
    return data.pages;
  }
  const statedTime = data.entries.reduce((earliest, curr) => {
    const currDate = Date.parse(curr.startedDateTime);
    const earliestDate = Date.parse(earliest);
    return earliestDate < currDate ? earliest : curr.startedDateTime;
  }, data.entries[0].startedDateTime);
  return [{
    id: "",
    pageTimings: {},
    startedDateTime: statedTime,
    title: "n/a",
  } as Page];
};

/**
 * Transforms a HAR object into the format needed to render the PerfCascade
 * @param  {Har} harData - HAR document
 * @param {number=0} pageIndex - page to parse (for multi-page HAR)
 * @param {ChartOptions} options - HAR-parser-specific options
 * @returns WaterfallData
 */
export function transformPage(harData: Har | Log,
                              pageIndex: number = 0,
                              options: ChartOptions): WaterfallData {
  // make sure it's the *.log base node
  const data = (harData["log"] !== undefined ? harData["log"] : harData) as Log;

  const pages = getPages(data);
  const currPage = pages[pageIndex];
  if (!currPage.startedDateTime) {
    throw new TypeError(`Invalid HAR document: "log.pages[${pageIndex}].startedDateTime" is not set`);
  }
  const pageStartTime = new Date(currPage.startedDateTime).getTime();
  const pageTimings = currPage.pageTimings;

  let doneTime = 0;
  const isTLS = documentIsSecure(data.entries);
  const entries = data.entries
    .filter((entry) => {
      // filter inline data
      if (entry.request.url.indexOf("data:") === 0 || entry.request.url.indexOf("javascript:") === 0) {
        return false;
      }
      if (pages.length === 1 && currPage.id === "") {
        return true;
      }
      return entry.pageref === currPage.id;
    })
    .map((entry, index) => {
      const startRelative = new Date(entry.startedDateTime).getTime() - pageStartTime;
      if (!isNaN(startRelative)) {
        doneTime = Math.max(doneTime, startRelative + entry.time);
      } else {
        // tslint:disable-next-line:no-console
        console.warn(`Entry has no valid 'startedDateTime' time`, entry.request.url, entry);
      }
      return toWaterFallEntry(entry, index, startRelative, isTLS);
    });

  const marks = getMarks(pageTimings, currPage, options);
  // if marks happens later than doneTime, increase the doneTime
  marks.forEach((mark) => {
    if (mark.startTime > doneTime) {
      doneTime = mark.startTime;
    }
  });

  // if we configured fixed length from the outside, use that!
  if (options.fixedLengthMs) {
    doneTime = options.fixedLengthMs;
  }

  // Add 100ms margin to make room for labels
  doneTime += 100;

  return {
    docIsTLS: isTLS,
    durationMs: doneTime,
    entries,
    marks,
    title: currPage.title,
  };
}

/**
 * Extract all `Mark`s based on `PageTiming` and `UserTiming`
 * @param {PageTiming} pageTimings - HARs `PageTiming` object
 * @param {Page} currPage - active page
 * @param {ChartOptions} options - HAR options
 */
const getMarks = (pageTimings: PageTiming, currPage: Page, options: ChartOptions): UserTiming[] => {
  if (pageTimings === undefined) {
    return [];
  }
  const sortFn = (a: Mark, b: Mark) => a.startTime - b.startTime;
  const marks = Object.keys(pageTimings)
    .filter((k) => (typeof pageTimings[k] === "number" && pageTimings[k] >= 0))
    .map((k) => ({
      name: `${escapeHtml(k.replace(/^[_]/, ""))} (${roundNumber(pageTimings[k], 0)} ms)`,
      startTime: pageTimings[k],
    } as Mark));

  if (!options.showUserTiming) {
    return marks.sort(sortFn);
  }

  return getUserTimings(currPage, options)
    .concat(marks)
    .sort(sortFn);
};

/**
 * Extract all `Mark`s based on `UserTiming`
 * @param {Page} currPage - active page
 * @param {ChartOptions} options - HAR options
 */
const getUserTimings = (currPage: Page, options: ChartOptions) => {
  const baseFilter = options.showUserTimingEndMarker ?
    (k: string) => k.indexOf("_userTime.") === 0 :
    (k: string) => k.indexOf("_userTime.") === 0 && k.indexOf("_userTime.endTimer-") !== 0;
  let filterFn = baseFilter;

  if (Array.isArray(options.showUserTiming)) {
    const findTimings = options.showUserTiming;
    filterFn = (k: string) => (
      baseFilter(k) &&
      findTimings.indexOf(k.replace(/^_userTime\./, "")) >= 0
    );
  }

  const findName = /^_userTime\.((?:startTimer-)?(.+))$/;

  const extractUserTiming = (k: string) => {
    let name: string | undefined;
    let fullName: string | undefined;
    let duration: number;
    [, fullName, name] = findName.exec(k) || [, undefined, undefined];

    fullName = escapeHtml(fullName);
    name = escapeHtml(name);

    if (fullName !== name && currPage[`_userTime.endTimer-${name}`]) {
      duration = currPage[`_userTime.endTimer-${name}`] - currPage[k];
      return {
        duration,
        name: `${options.showUserTimingEndMarker ? fullName : name} (${currPage[k]} - ${currPage[k] + duration} ms)`,
        startTime: currPage[k],
        // x: currPage[k],
      } as UserTiming;
    }
    return {
      name: fullName,
      startTime: currPage[k],
    } as UserTiming;
  };

  return Object.keys(currPage)
    .filter(filterFn)
    .map(extractUserTiming);
};

/**
 * Create `WaterfallEntry`s to represent the sub-timings of a request
 * ("blocked", "dns", "connect", "send", "wait", "receive")
 * @param  {number} startRelative - Number of milliseconds since page load started (`page.startedDateTime`)
 * @param  {Entry} harEntry
 * @returns Array
 */
const buildDetailTimingBlocks = (startRelative: number, harEntry: Entry): WaterfallEntryTiming[] => {
  const t = harEntry.timings;
  const types: TimingType[] = ["blocked", "dns", "connect", "send", "wait", "receive"];
  return types.reduce((collect: WaterfallEntryTiming[], key: TimingType) => {
    const time = getTimePair(key, harEntry, collect, startRelative);

    if (time.end && time.start >= time.end) {
      return collect;
    }

    // special case for 'connect' && 'ssl' since they share time
    // http://www.softwareishard.com/blog/har-12-spec/#timings
    if (key === "connect" && t.ssl && t.ssl !== -1) {
      const sslStart = parseInt(`${harEntry[`_ssl_start`]}`, 10) || time.start;
      const sslEnd = parseInt(`${harEntry[`_ssl_end`]}`, 10) || time.start + t.ssl;
      const connectStart = (!!parseInt(`${harEntry[`_ssl_start`]}`, 10)) ? time.start : sslEnd;
      return collect
        .concat([createWaterfallEntryTiming("ssl", Math.round(sslStart), Math.round(sslEnd))])
        .concat([createWaterfallEntryTiming(key, Math.round(connectStart), Math.round(time.end))]);
    }

    return collect.concat([createWaterfallEntryTiming(key, Math.round(time.start), Math.round(time.end))]);
  }, []);
};

/**
 * Returns Object containing start and end time of `collect`
 *
 * @param  {string} key
 * @param  {Entry} harEntry
 * @param  {WaterfallEntry[]} collect
 * @param  {number} startRelative - Number of milliseconds since page load started (`page.startedDateTime`)
 * @returns {Object}
 */
const getTimePair = (key: string, harEntry: Entry, collect: WaterfallEntryTiming[], startRelative: number) => {
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
    end: Math.round(end),
    start: Math.round(start),
  };
};

/**
 * Helper to create a requests `WaterfallResponseDetails`
 *
 * @param  {Entry} entry
 * @param  {WaterfallEntryIndicator[]} indicators
 * @returns WaterfallResponseDetails
 */
const createResponseDetails = (entry: Entry, indicators: WaterfallEntryIndicator[]): WaterfallResponseDetails => {
  const requestType = mimeToRequestType(entry.response.content.mimeType);
  const statusClean = toInt(entry.response.status) || 0;
  const renderBlockingStatus = entry._renderBlocking || "";
  const largestContentfulPaintStatus = entry._isLCP || false;
  return {
    icon: makeMimeTypeIcon(statusClean, entry.response.statusText, requestType, entry.response.redirectURL),
    indicators,
    requestType,
    rowClass: makeRowCssClasses(statusClean, renderBlockingStatus, largestContentfulPaintStatus),
    statusCode: statusClean,
  };
};

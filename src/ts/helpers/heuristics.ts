import {Entry} from "../typing/har";
import {WaterfallEntry} from "../typing/waterfall";
import {getHeader, hasHeader} from "./har";
import * as misc from "./misc";

/**
 *
 * Checks if `entry.response.status` code is `>= lowerBound` and `<= upperBound`
 * @param  {Entry} entry
 * @param  {number} lowerBound - inclusive lower bound
 * @param  {number} upperBound - inclusive upper bound
 */
export function isInStatusCodeRange(entry: Entry, lowerBound: number, upperBound: number) {
  return entry.response.status >= lowerBound && entry.response.status <= upperBound;
}

function isCompressible(entry: WaterfallEntry): boolean {
  const harEntry = entry.rawResource;
  const minCompressionSize = 1000;
  // small responses
  if (harEntry.response.bodySize < minCompressionSize) {
    return false;
  }

  if (misc.contains(["html", "css", "javascript", "svg", "plain"], entry.requestType)) {
    return true;
  }
  const mime = harEntry.response.content.mimeType;
  const compressableMimes = ["application/vnd.ms-fontobject",
    "application/x-font-opentype",
    "application/x-font-truetype",
    "application/x-font-ttf",
    "application/xml",
    "font/eot",
    "font/opentype",
    "font/otf",
    "image/vnd.microsoft.icon"];
  if (misc.contains(["text"], mime.split("/")[0]) || misc.contains(compressableMimes, mime.split(";")[0])) {
    return true;
  }
  return false;
}

function isCachable(entry: WaterfallEntry): boolean {
  const harEntry = entry.rawResource;
  const headers = harEntry.response.headers;

  // do not cache non-gets,204 and non 2xx status codes
  if (harEntry.request.method.toLocaleLowerCase() !== "get" ||
    harEntry.response.status === 204 ||
    !isInStatusCodeRange(harEntry, 200, 299)) {
    return false;
  }

  if (!(hasHeader(headers, "Cache-Control") || hasHeader(headers, "Expires"))) {
    return true;
  }
  return getHeader(headers, "Cache-Control").indexOf("no-cache") > -1
    || getHeader(headers, "Pragma") === "no-cache";
}

export function hasCacheIssue(entry: WaterfallEntry) {
  const harEntry = entry.rawResource;
  const headers = harEntry.response.headers;
  return (!hasHeader(headers, "Content-Encoding") && isCachable(entry));
}

export function hasCompressionIssue(entry: WaterfallEntry) {
  const harEntry = entry.rawResource;
  const headers = harEntry.response.headers;
  return (!hasHeader(headers, "Content-Encoding") && isCompressible(entry));
}

export function isSecure(entry: WaterfallEntry) {
  return entry.name.indexOf("https://") === 0;
}

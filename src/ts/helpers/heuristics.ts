import {Entry} from "../typing/har";
import {WaterfallData, WaterfallEntry} from "../typing/waterfall";
import {hasHeader} from "./har";
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

/**
 * Checks if response could be cacheable, but isn't due to lack of cache header.
 * @param {WaterfallEntry} entry -  the waterfall entry.
 * @returns {boolean}
 */
export function hasCacheIssue(entry: WaterfallEntry) {
  const harEntry = entry.rawResource;
  if (harEntry.request.method.toLowerCase() !== "get") {
    return false;
  }
  if (harEntry.response.status === 204 || !isInStatusCodeRange(harEntry, 200, 299)) {
    return false;
  }

  const headers = harEntry.response.headers;
  return !(hasHeader(headers, "Cache-Control") || hasHeader(headers, "Expires"));
}

export function hasCompressionIssue(entry: WaterfallEntry) {
  const harEntry = entry.rawResource;
  const headers = harEntry.response.headers;
  return (!hasHeader(headers, "Content-Encoding") && isCompressible(entry));
}

export function isSecure(entry: WaterfallEntry) {
  return entry.name.indexOf("https://") === 0;
}

/**
 * Check if the document (disregarding any initial http->https redirects) is loaded over a secure connection.
 * @param {WaterfallData} data -  the waterfall data.
 * @returns {boolean}
 */
export function documentIsSecure(data: WaterfallData) {
  const rootDocument = data.entries.filter((e) => !e.rawResource.response.redirectURL)[0];
  return isSecure(rootDocument);
}

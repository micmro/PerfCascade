/**
 * Heuristics used at parse-time for HAR data
 */

import { Entry } from "har-format";
import { hasHeader } from "../helpers/har";
import * as misc from "../helpers/misc";
import { toInt } from "../helpers/parse";
import { WaterfallEntryIndicator } from "../typing/waterfall";
import { RequestType } from "../typing/waterfall";

function isCompressible(entry: Entry, requestType: RequestType): boolean {
  const minCompressionSize = 1000;
  // small responses
  if (entry.response.bodySize < minCompressionSize) {
    return false;
  }

  if (misc.contains(["html", "css", "javascript", "svg", "plain"], requestType)) {
    return true;
  }
  const mime = entry.response.content.mimeType;
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
 * @param {Entry} entry -  the waterfall entry.
 * @returns {boolean}
 */
function hasCacheIssue(entry: Entry) {
  if (!entry.request.method || entry.request.method.toLowerCase() !== "get") {
    return false;
  }
  if (entry.response.status === 204 || !misc.isInStatusCodeRange(entry.response.status, 200, 299)) {
    return false;
  }

  const headers = entry.response.headers;
  return !(hasHeader(headers, "Cache-Control") || hasHeader(headers, "Expires"));
}

function hasCompressionIssue(entry: Entry, requestType: RequestType) {
  const headers = entry.response.headers;
  return (!hasHeader(headers, "Content-Encoding") && isCompressible(entry, requestType));
}

/** Checks if the ressource uses https */
function isSecure(entry: Entry) {
  return entry.request.url.indexOf("https://") === 0;
}

function isInitialRedirect(entry: Entry, index: number) {
  return index === 0 && !!entry.response.redirectURL;
}

function isPush(entry: Entry): boolean {
  if (entry._was_pushed === undefined || entry._was_pushed === null) {
    return false;
  }
  return toInt(entry._was_pushed) === 1;
}

/**
 * Check if the document (disregarding any initial http->https redirects) is loaded over a secure connection.
 * @param {Entry[]} data - the waterfall entries data.
 * @returns {boolean}
 */
export function documentIsSecure(data: Entry[]) {
  const rootDocument = data.filter((e) => !e.response.redirectURL)[0];
  // check if request is a redirect chain
  if (rootDocument === undefined) {
    return (data.length > 0) ? isSecure(data[0]) : false;
  }
  return isSecure(rootDocument);
}

/** Scans `entry` for noteworthy issues or infos and highlights them */
export function collectIndicators(entry: Entry, index: number, docIsTLS: boolean, requestType: RequestType) {
  // const harEntry = entry;
  const output: WaterfallEntryIndicator[] = [];

  if (isPush(entry)) {
    output.push({
      description: "Response was pushed by the server using HTTP2 push.",
      displayType: "inline",
      icon: "push",
      id: "push",
      title: "Response was pushed by the server",
      type: "info",
    });
  }

  if (docIsTLS && !(isSecure(entry) || isInitialRedirect(entry, index))) {
    output.push({
      description: "Insecure request, it should use HTTPS.",
      displayType: "icon",
      id: "noTls",
      title: "Insecure Connection",
      type: "error",
    });
  }

  if (hasCacheIssue(entry)) {
    output.push({
      description: "The response is not allow to be cached on the client. Consider setting 'Cache-Control' headers.",
      displayType: "icon",
      id: "noCache",
      title: "Response not cached",
      type: "error",
    });
  }

  if (hasCompressionIssue(entry, requestType)) {
    output.push({
      description: "The response is not compressed. Consider enabling HTTP compression on your server.",
      displayType: "icon",
      id: "noGzip",
      title: "no gzip",
      type: "error",
    });
  }

  if (!entry.response.content.mimeType &&
    misc.isInStatusCodeRange(entry.response.status, 200, 299) &&
    entry.response.status !== 204) {
    output.push({
      description: "Response doesn't contain a 'Content-Type' header.",
      displayType: "icon",
      id: "warning",
      title: "No MIME Type defined",
      type: "warning",
    });
  }

  return output;
}

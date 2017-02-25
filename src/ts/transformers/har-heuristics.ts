/**
 * Heuristics used at parse-time for HAR data
 */

import { hasHeader } from "../helpers/har";
import * as misc from "../helpers/misc";
import { Entry } from "../typing/har";
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
  if (entry.request.method.toLowerCase() !== "get") {
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

function isPush(entry: Entry): boolean {
  function toInt(input: string | number): number {
    if (typeof input === "string") {
      return parseInt(input, 10);
    } else {
      return input;
    }
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
  return isSecure(rootDocument);
}

/** Scans `entry` for noteworthy issues or infos and highlights them */
export function collectIndicators(entry: Entry, docIsTLS: boolean, requestType: RequestType) {
  // const harEntry = entry;
  let output: WaterfallEntryIndicator[] = [];

  if (isPush(entry)) {
    output.push({
      description: "Response was pushed by the server using HTTP2 push.",
      icon: "push",
      id: "push",
      title: "Response was pushed by the server",
      type: "info",
    });
  }

  if (docIsTLS && !isSecure(entry)) {
    output.push({
      description: "Insecure request, it should use HTTPS.",
      id: "noTls",
      title: "Insecure Connection",
      type: "error",
    });
  }

  if (hasCacheIssue(entry)) {
    output.push({
      description: "The response is not allow to be cached on the client. Consider setting 'Cache-Control' headers.",
      id: "noCache",
      title: "Response not cached",
      type: "error",
    });
  }

  if (hasCompressionIssue(entry, requestType)) {
    output.push({
      description: "The response is not compressed. Consider enabling HTTP compression on your server.",
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
      id: "warning",
      title: "No MIME Type defined",
      type: "warning",
    });
  }

  return output;
}

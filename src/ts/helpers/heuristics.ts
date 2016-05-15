import {Entry, Header} from "../typing/har.d"
import TimeBlock from "../typing/time-block"
import * as misc from "./misc"

export function getResponseHeader(entry: Entry, headerName: string): Header {
  return entry.response.headers.filter(h => h.name.toLowerCase() === headerName.toLowerCase())[0]
}

export function getResponseHeaderValue(entry: Entry, headerName: string) {
  let header = getResponseHeader(entry, headerName)
  if (header !== undefined) {
    return header.value
  } else {
    return ""
  }
}

/**
 *
 * Checks if `entry.response.status` code is `>= lowerBound` and `<= upperBound`
 * @param  {Entry} entry
 * @param  {number} lowerBound - inclusive lower bound
 * @param  {number} upperBound - inclusive upper bound
 */
export function isInStatusCodeRange(entry: Entry, lowerBound: number, upperBound: number) {
  return entry.response.status >= lowerBound && entry.response.status <= upperBound
}

function isCompressable(block: TimeBlock): boolean {
  const entry = block.rawResource
  const minCompressionSize = 1000
  //small responses
  if (entry.response.bodySize < minCompressionSize) {
    return false
  }

  if (misc.contains(["html", "css", "javascript", "svg", "plain"], block.requestType)) {
    return true
  }
  const mime = entry.response.content.mimeType
  const compressableMimes = ["application/vnd.ms-fontobject",
    "application/x-font-opentype",
    "application/x-font-truetype",
    "application/x-font-ttf",
    "application/xml",
    "font/eot",
    "font/opentype",
    "font/otf",
    "image/vnd.microsoft.icon"]
  if (misc.contains(["text"], mime.split("/")[0]) || misc.contains(compressableMimes, mime.split(";")[0])) {
    return true
  }
  return false
}

function isCachable(block: TimeBlock): boolean {
  const entry = block.rawResource
  //do not cache non-gets,204 and non 2xx status codes
  if (entry.request.method.toLocaleLowerCase() !== "get" ||
    entry.response.status === 204 ||
    !isInStatusCodeRange(entry, 200, 299)) {
    return false
  }

  if (getResponseHeader(entry, "Cache-Control") === undefined
    && getResponseHeader(entry, "Expires") === undefined) {
    return true
  }
  if (getResponseHeaderValue(entry, "Cache-Control").indexOf("no-cache") > -1
    || getResponseHeaderValue(entry, "Pragma") === "no-cache") {
    return true
  }
  return false
}

export function hasCacheIssue(block: TimeBlock) {
  return (getResponseHeader(block.rawResource, "Content-Encoding") === undefined && isCachable(block))
}

export function hasCompressionIssue(block: TimeBlock) {
  return (getResponseHeader(block.rawResource, "Content-Encoding") === undefined && isCompressable(block))
}

export function isSecure(block: TimeBlock) {
  return block.name.indexOf("https://") === 0
}

/**
 * Creation of sub-components used in a ressource request row
 */
import TimeBlock from "../../typing/time-block"
import {Entry, Header} from "../../typing/har"
import * as misc from "../../helpers/misc"

/**
 * Interface for `Icon` metadata
 */
export interface Indicator {
  type: string,
  x: number,
  title: string
}

function getResponseHeader(entry: Entry, headerName: string): Header {
  return entry.response.headers.filter(h => h.name.toLowerCase() === headerName.toLowerCase())[0]
}

function getResponseHeaderValue(entry: Entry, headerName: string) {
  let header = getResponseHeader(entry, headerName)
  if (header !== undefined) {
    return header.value
  } else {
    return ""
  }
}

function isInStatusCodeRange(entry: Entry, lowerBound: number, upperBound: number) {
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

/**
 * Scan the request for errors or portential issues and highlight them
 * @param  {TimeBlock} block
 * @param  {boolean} docIsSsl
 * @returns IconMetadata
 */
export function getIndicators(block: TimeBlock, docIsSsl: boolean): Indicator[] {
  const isSecure = block.name.indexOf("https://") === 0
  const iconWidth = 20
  const entry = block.rawResource
  let output = []
  let xPos = 3

  // helper to avoid typing out all key of the helper object
  const makeIcon = function(type: string, title: string) {
    output.push({ "type": type, "x": xPos, "title": title })
    xPos += iconWidth
  }

  makeIcon(block.requestType, block.requestType)

  //highlight redirects
  if (!!entry.response.redirectURL) {
     const url = encodeURI(entry.response.redirectURL.split("?")[0] || "")
     makeIcon("err3xx", `${entry.response.status} response status: Redirect to ${url}...`)
  }

  if (!docIsSsl && isSecure) {
    makeIcon("lock", "Secure Connection")
  } else if (docIsSsl && !isSecure) {
    makeIcon("noTls", "Insecure Connection")
  }

  if (getResponseHeader(entry, "Content-Encoding") === undefined && isCachable(block)) {
    makeIcon("noCache", "Response not cached")
  }

  if (getResponseHeader(entry, "Content-Encoding") === undefined && isCompressable(block)) {
    makeIcon("noGzip", "no gzip")
  }


  if (isInStatusCodeRange(entry, 400, 499)) {
    makeIcon("err4xx", `${entry.response.status} response status: ${entry.response.statusText}`)
  }
  if (isInStatusCodeRange(entry, 500, 599)) {
    makeIcon("err5xx", `${entry.response.status} response status: ${entry.response.statusText}`)
  }

  if (!entry.response.content.mimeType && isInStatusCodeRange(entry, 200, 299)) {
     makeIcon("warning", "No MIME Type defined")
  }

  return output
}

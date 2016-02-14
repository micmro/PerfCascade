/**
 * Creation of sub-components used in a ressource request row
 */
import TimeBlock from "../typing/time-block"
import {Entry, Header} from "../typing/Har"
import misc from "../helpers/misc"

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

function isCompressable(block: TimeBlock): boolean {
  const entry = block.rawResource
  const minCompressionSize = 1000
  //ignore non GET and small responses
  if (entry.request.method.toLocaleLowerCase() !== "get" || entry.response.bodySize < minCompressionSize) {
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
  if (misc.contains(["text"], mime.split("/")[0]) || misc.contains(compressableMimes, mime)) {
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
  const respHeader = function(headerName: string) {
    return getResponseHeader(entry, headerName)
  }

  const respHeaderValue = function(headerName: string) {
    let header = getResponseHeader(entry, headerName)
    if (header !== undefined) {
      return header.value
    } else {
      return ""
    }
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

  if (entry.request.method.toLocaleLowerCase() === "get") {
    if ((respHeader("Cache-Control") === undefined
      && respHeader("Expires") === undefined)
      || respHeaderValue("Cache-Control").indexOf("no-cache") > -1
      || respHeaderValue("Pragma") === "no-cache") {
      makeIcon("noCache", "Response not cached")
    }
  }

  if (respHeader("Content-Encoding") === undefined && isCompressable(block)) {
    makeIcon("noGzip", "no gzip")
  }


  if (entry.response.status > 399 && entry.response.status < 500) {
    makeIcon("err4xx", `${entry.response.status} response status: ${entry.response.statusText}`)
  }
  if (entry.response.status > 499 && entry.response.status < 600) {
    makeIcon("err5xx", `${entry.response.status} response status: ${entry.response.statusText}`)
  }

  if (!entry.response.content.mimeType) {
     makeIcon("warning", "No MIME Type defined")
  }

  return output
}

/**
 * Creation of sub-components used in a ressource request row
 */

import TimeBlock from "../../typing/time-block"
import * as heuristics from "../../helpers/heuristics"

/**
 * Interface for `Icon` metadata
 */
export interface Indicator {
  type: string,
  x: number,
  title: string
}

/**
 * Scan the request for errors or portential issues and highlight them
 * @param  {TimeBlock} block
 * @param  {boolean} docIsSsl
 * @returns IconMetadata
 */
export function getIndicators(block: TimeBlock, docIsSsl: boolean): Indicator[] {
  const iconWidth = 20
  const entry = block.rawResource
  let output = []
  let xPos = 3

  // helper to avoid typing out all key of the helper object
  const makeIcon = function (type: string, title: string) {
    output.push({ "type": type, "x": xPos, "title": title })
    xPos += iconWidth
  }

  makeIcon(block.requestType, block.requestType)

  //highlight redirects
  if (!!entry.response.redirectURL) {
    const url = encodeURI(entry.response.redirectURL.split("?")[0] || "")
    makeIcon("err3xx", `${entry.response.status} response status: Redirect to ${url}...`)
  }

  if (!docIsSsl && heuristics.isSecure(block)) {
    makeIcon("lock", "Secure Connection")
  } else if (docIsSsl && !heuristics.isSecure(block)) {
    makeIcon("noTls", "Insecure Connection")
  }

  if (heuristics.hasCacheIssue(block)) {
    makeIcon("noCache", "Response not cached")
  }

  if (heuristics.hasCompressionIssue(block)) {
    makeIcon("noGzip", "no gzip")
  }

  if (heuristics.isInStatusCodeRange(entry, 400, 499)) {
    makeIcon("err4xx", `${entry.response.status} response status: ${entry.response.statusText}`)
  }

  if (heuristics.isInStatusCodeRange(entry, 500, 599)) {
    makeIcon("err5xx", `${entry.response.status} response status: ${entry.response.statusText}`)
  }

  if (!entry.response.content.mimeType && heuristics.isInStatusCodeRange(entry, 200, 299)) {
    makeIcon("warning", "No MIME Type defined")
  }

  return output
}

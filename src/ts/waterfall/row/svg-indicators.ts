/**
 * Creation of sub-components used in a resource request row
 */

import * as heuristics from "../../helpers/heuristics"
import {WaterfallEntry} from "../../typing/waterfall";

/**
 * Interface for `Icon` metadata
 */
export interface Icon {
  type: string,
  title: string,
  width: number
}

// helper to avoid typing out all key of the helper object
function makeIcon(type: string, title: string): Icon {
  return { "type": type, "title": title, "width": 20 }
}

/**
 * Scan the request for errors or potential issues and highlight them
 * @param  {WaterfallEntry} block
 * @returns {Icon}
 */
export function getMimeTypeIcon(block: WaterfallEntry): Icon {
  const entry = block.rawResource
  // highlight redirects
  if (!!entry.response.redirectURL) {
    const url = encodeURI(entry.response.redirectURL.split("?")[0] || "")
    return makeIcon("err3xx", `${entry.response.status} response status: Redirect to ${url}...`)
  } else if (heuristics.isInStatusCodeRange(entry, 400, 499)) {
    return makeIcon("err4xx", `${entry.response.status} response status: ${entry.response.statusText}`)
  } else if (heuristics.isInStatusCodeRange(entry, 500, 599)) {
    return makeIcon("err5xx", `${entry.response.status} response status: ${entry.response.statusText}`)
  } else {
    return makeIcon(block.requestType, block.requestType)
  }
}
  /**
   * Scan the request for errors or portential issues and highlight them
   * @param  {WaterfallEntry} block
   * @param  {boolean} docIsSsl
   * @returns {Icon[]}
   */
  export function getIndicatorIcons(block: WaterfallEntry, docIsSsl: boolean): Icon[] {
  const entry = block.rawResource
  let output = []

  if (!docIsSsl && heuristics.isSecure(block)) {
    output.push(makeIcon("lock", "Secure Connection"))
  } else if (docIsSsl && !heuristics.isSecure(block)) {
    output.push(makeIcon("noTls", "Insecure Connection"))
  }

  if (heuristics.hasCacheIssue(block)) {
    output.push(makeIcon("noCache", "Response not cached"))
  }

  if (heuristics.hasCompressionIssue(block)) {
    output.push(makeIcon("noGzip", "no gzip"))
  }

  if (!entry.response.content.mimeType && heuristics.isInStatusCodeRange(entry, 200, 299)) {
    output.push(makeIcon("warning", "No MIME Type defined"))
  }

  return output
}

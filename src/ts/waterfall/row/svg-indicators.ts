/**
 * Creation of sub-components used in a ressource request row
 */

import TimeBlock from "../../typing/time-block"
import * as heuristics from "../../helpers/heuristics"

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
 * Scan the request for errors or portential issues and highlight them
 * @param  {TimeBlock} block
 * @returns {Icon}
 */
export function getMimeTypeIcon(block: TimeBlock): Icon {
  return makeIcon(block.requestType, block.requestType)
}
  /**
   * Scan the request for errors or portential issues and highlight them
   * @param  {TimeBlock} block
   * @param  {boolean} docIsSsl
   * @returns {Icon[]}
   */
  export function getIndicatorIcons(block: TimeBlock, docIsSsl: boolean): Icon[] {
  const entry = block.rawResource
  let output = []

  //highlight redirects
  if (!!entry.response.redirectURL) {
    const url = encodeURI(entry.response.redirectURL.split("?")[0] || "")
    output.push(makeIcon("err3xx", `${entry.response.status} response status: Redirect to ${url}...`))
  }

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

  if (heuristics.isInStatusCodeRange(entry, 400, 499)) {
    output.push(makeIcon("err4xx", `${entry.response.status} response status: ${entry.response.statusText}`))
  }

  if (heuristics.isInStatusCodeRange(entry, 500, 599)) {
    output.push(makeIcon("err5xx", `${entry.response.status} response status: ${entry.response.statusText}`))
  }

  if (!entry.response.content.mimeType && heuristics.isInStatusCodeRange(entry, 200, 299)) {
    output.push(makeIcon("warning", "No MIME Type defined"))
  }

  return output
}

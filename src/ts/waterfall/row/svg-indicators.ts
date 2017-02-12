/**
 * Creation of sub-components used in a resource request row
 */

import * as heuristics from "../../helpers/heuristics";
import { WaterfallEntry } from "../../typing/waterfall";

/**
 * Interface for `Icon` metadata
 */
export interface Icon {
  type: string;
  title: string;
  width: number;
}

// helper to avoid typing out all key of the helper object
function makeIcon(type: string, title: string): Icon {
  return { "type": type, "title": title, "width": 20 };
}

/**
 * Scan the request for errors or potential issues and highlight them
 * @param  {WaterfallEntry} entry
 * @returns {Icon}
 */
export function getMimeTypeIcon(entry: WaterfallEntry): Icon {
  const harEntry = entry.rawResource;
  // highlight redirects
  if (!!harEntry.response.redirectURL) {
    const url = encodeURI(harEntry.response.redirectURL.split("?")[0] || "");
    return makeIcon("err3xx", `${harEntry.response.status} response status: Redirect to ${url}...`);
  } else if (heuristics.isInStatusCodeRange(harEntry, 400, 499)) {
    return makeIcon("err4xx", `${harEntry.response.status} response status: ${harEntry.response.statusText}`);
  } else if (heuristics.isInStatusCodeRange(harEntry, 500, 599)) {
    return makeIcon("err5xx", `${harEntry.response.status} response status: ${harEntry.response.statusText}`);
  } else if (harEntry.response.status === 204) {
    return makeIcon("plain", "No content");
  } else {
    return makeIcon(entry.requestType, entry.requestType);
  }
}
/**
 * Gets the Indicators in Icon format
 * @param  {WaterfallEntry} entry
 * @returns {Icon[]}
 */
export function getIndicatorIcons(entry: WaterfallEntry): Icon[] {
  return entry.indicators.map((i) => makeIcon(i.icon || i.type, i.title));
}

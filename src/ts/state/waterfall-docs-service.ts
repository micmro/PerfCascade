import {WaterfallDocs} from "../typing/waterfall-data"

/*
* Central service to store HAR data
* and make it accessible everywhere by importing this module
*/

let docs: WaterfallDocs

/**
 * Store Waterfall-Docs data centrally for Multi-page HARs
 * @param  {WaterfallDocs} waterfallDocs
 */
export function storeDocs(waterfallDocs: WaterfallDocs) {
  docs = waterfallDocs
}

/**
 * Get stored Waterfall-Docs
 * @returns WaterfallDocs
 */
export function getDocs(): WaterfallDocs {
  return docs
}

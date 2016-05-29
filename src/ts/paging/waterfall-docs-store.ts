import {Har} from "../typing/har.d"

/*
* Central servide to store HAR data
* and make it accessible everywhere by importing this module
*/

let rawHar: Har

/**
 * Store HAR data centrally for Multi-page HARs
 * @param  {Har} harData
 */
export function storeHar(harData: Har) {
  rawHar = harData
}

/**
 * Get stored HAR doc
 * @returns Har
 */
export function getHar(): Har {
  return rawHar
}

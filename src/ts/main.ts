import {createWaterfallSvg} from "./waterfall/svg-chart"
import {Har} from "./typing/har.d"
import * as dom  from "./helpers/dom"
import HarTransformer from "./transformers/har"
import {ChartOptions} from "./typing/options.d"


/**
 * Create new PerfCascade from HAR data
 * @param  {Har} logData - HAR object
 * @param  {ChartOptions} options - PerfCascade options object
 * @returns {SVGSVGElement} - Chart SVG Element
 */
function PerfCascade(logData: Har, options?: ChartOptions): SVGSVGElement {
  const data = HarTransformer.transfrom(logData)
  return createWaterfallSvg(data, options)
}


let exportMembers = {
  newPerfCascadeHar : PerfCascade,
  newPerfCascadeCustom: createWaterfallSvg,
  transformHar: HarTransformer.transfrom
}

// TEMP: create public and renderHar
if (window["define"] === undefined) {
  window["perfCascade"] = exportMembers
}
export default exportMembers

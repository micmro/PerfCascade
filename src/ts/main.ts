import {createWaterfallSvg} from "./waterfall/svg-chart"
import {Har} from "./typing/har.d"
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

//global members that get exported via UMD
export = {
  newPerfCascadeHar : PerfCascade,
  newPerfCascadeCustom: createWaterfallSvg,
  transformHar: HarTransformer.transfrom
}

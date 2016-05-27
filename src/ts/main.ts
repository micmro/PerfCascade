import {createWaterfallSvg} from "./waterfall/svg-chart"
import {Har} from "./typing/har.d"
import HarTransformer from "./transformers/har"
import {ChartOptions} from "./typing/options.d"
import * as harStore from "./paging/har-store"


/**
 * Create new PerfCascade from HAR data
 * @param  {Har} harData - HAR object
 * @param  {ChartOptions} options - PerfCascade options object
 * @returns {SVGSVGElement} - Chart SVG Element
 */
function PerfCascade(harData: Har, options?: ChartOptions): SVGSVGElement {
  harStore.storeHar(harData)
  const data = HarTransformer.transfrom(harData)
  return createWaterfallSvg(data, options)
}

//global members that get exported via UMD
export = {
  fromHar : PerfCascade,
  fromPerfCascadeFormat: createWaterfallSvg,
  transformHarToPerfCascade: HarTransformer.transfrom
}

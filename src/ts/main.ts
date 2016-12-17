import { Har } from "./typing/har.d"
import { WaterfallDocs } from "./typing/waterfall-data.d"
import { ChartOptions } from "./typing/options.d"
import { createWaterfallSvg } from "./waterfall/svg-chart"
import * as paging from "./paging/paging"
import HarTransformer from "./transformers/har"
import { makeLegend } from "./legend/legend"
import * as waterfallDocsService from "./state/waterfall-docs-service"
import * as globalStateService from "./state/global-state"
import * as misc from "./helpers/misc"


/** default options to use if not set in `options` parameter */
const defaultOptions: ChartOptions = {
  rowHeight: 23,
  showAlignmentHelpers: true,
  showMimeType: true,
  showIndicatorIcons: true,
  leftColumnWith: 25
}


function PerfCascade(waterfallDocsData: WaterfallDocs, chartOptions?: ChartOptions): SVGSVGElement {
  const options: ChartOptions = misc.assign(defaultOptions, chartOptions || {})

  //setup state setvices
  globalStateService.init(options)
  waterfallDocsService.storeDocs(waterfallDocsData)

  let doc = createWaterfallSvg(paging.getSelectedPage())

  //page update behaviour
  paging.onPageUpdate((pageIndex, pageDoc) => {
    let el = doc.parentElement
    let newDoc = createWaterfallSvg(pageDoc)
    el.replaceChild(newDoc, doc)
    doc = newDoc
  })

  if (options.pageSelector) {
    paging.initPagingSelectBox(options.pageSelector)
  }

  if (options.legendHolder) {
    options.legendHolder.appendChild(makeLegend())
  }
  return doc
}

/**
 * Create new PerfCascade from HAR data
 * @param  {Har} harData - HAR object
 * @param  {ChartOptions} options - PerfCascade options object
 * @returns {SVGSVGElement} - Chart SVG Element
 */
function fromHar(harData: Har, options?: ChartOptions): SVGSVGElement {
  return PerfCascade(HarTransformer.transformDoc(harData), options)
}

/**
 * Create new PerfCascade from PerfCascade's internal WaterfallData format
 * @param {WaterfallDocs} waterfallDocsData Object containing data to render
 * @param  {ChartOptions} options - PerfCascade options object
 * @returns {SVGSVGElement} - Chart SVG Element
 */
function fromPerfCascadeFormat(waterfallDocsData: WaterfallDocs, options?: ChartOptions): SVGSVGElement {
  return PerfCascade(waterfallDocsData, options)
}

let transformHarToPerfCascade = HarTransformer.transformDoc

//global members that get exported via UMD
export { fromHar }
export { fromPerfCascadeFormat }
export { transformHarToPerfCascade }
export { setSelectedPageIndex as changePage } from "./paging/paging"
export { makeLegend }
//export typings
export * from "./typing/index.d"

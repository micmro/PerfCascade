import {Har} from "./typing/har.d"
import {WaterfallDocs} from "./typing/waterfall-data.d"
import {ChartOptions} from "./typing/options.d"
import {createWaterfallSvg} from "./waterfall/svg-chart"
import * as paging from "./paging/paging"
import HarTransformer from "./transformers/har"
import * as waterfallDocsStore from "./state/waterfall-docs-store"



function PerfCascade(options?: ChartOptions): SVGSVGElement {
  let doc = createWaterfallSvg(paging.getSelectedPage(), options)

  //page update behaviour
  paging.onPageUpdate((pageIndex, pageDoc) => {
    console.log("Change Page to", pageIndex)
    let el = doc.parentElement
    let newDoc = createWaterfallSvg(pageDoc, options)
    el.replaceChild(newDoc, doc)
    doc = newDoc
  })
  return doc
}

/**
 * Create new PerfCascade from HAR data
 * @param  {Har} harData - HAR object
 * @param  {ChartOptions} options - PerfCascade options object
 * @returns {SVGSVGElement} - Chart SVG Element
 */
function fromHar(harData: Har, options?: ChartOptions): SVGSVGElement {
  waterfallDocsStore.storeDocs(HarTransformer.transformDoc(harData))
  return PerfCascade(options)
}

/**
 * Create new PerfCascade from PerfCascade's internal WaterfallData format
 * @param {WaterfallDocs} waterfallDocsData Object containing data to render
 * @param  {ChartOptions} options - PerfCascade options object
 * @returns {SVGSVGElement} - Chart SVG Element
 */
function fromPerfCascadeFormat(waterfallDocsData: WaterfallDocs, options?: ChartOptions): SVGSVGElement {
  waterfallDocsStore.storeDocs(waterfallDocsData)
  return PerfCascade(options)
}

//global members that get exported via UMD
export = {
  fromHar : fromHar,
  fromPerfCascadeFormat: fromPerfCascadeFormat,
  transformHarToPerfCascade: HarTransformer.transformDoc,
  changePage: paging.setSelectedPageIndex
}

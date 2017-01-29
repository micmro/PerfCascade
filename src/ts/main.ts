import { makeLegend } from "./legend/legend";
import Paging from "./paging/paging";
import * as HarTransformer from "./transformers/har";
import { Har } from "./typing/har";
import { ChartOptions } from "./typing/options";
import { WaterfallDocs } from "./typing/waterfall";
import { createWaterfallSvg } from "./waterfall/svg-chart";

/** default options to use if not set in `options` parameter */
const defaultOptions: Readonly<ChartOptions> = {
  leftColumnWith: 25,
  legendHolder: undefined,
  pageSelector: undefined,
  rowHeight: 23,
  showAlignmentHelpers: true,
  showIndicatorIcons: true,
  showMimeTypeIcon: true,
};

function PerfCascade(waterfallDocsData: WaterfallDocs, chartOptions: Partial<ChartOptions> = {}): SVGSVGElement {
  const options: ChartOptions = {...defaultOptions, ...chartOptions};

  // setup paging helper
  let paging = new Paging(waterfallDocsData);

  let doc = createWaterfallSvg(paging.getSelectedPage(), options);

  // page update behaviour
  paging.onPageUpdate((_pageIndex, pageDoc) => {
    let el = doc.parentElement;
    let newDoc = createWaterfallSvg(pageDoc, options);
    el.replaceChild(newDoc, doc);
    doc = newDoc;
  });

  if (options.pageSelector) {
    paging.initPagingSelectBox(options.pageSelector);
  }

  if (options.legendHolder) {
    options.legendHolder.innerHTML = "";
    options.legendHolder.appendChild(makeLegend());
  }
  return doc;
}

/**
 * Create new PerfCascade from HAR data
 * @param  {Har} harData - HAR object
 * @param  {ChartOptions} options - PerfCascade options object
 * @returns {SVGSVGElement} - Chart SVG Element
 */
function fromHar(harData: Har, options: Partial<ChartOptions> = {}): SVGSVGElement {
  return PerfCascade(HarTransformer.transformDoc(harData), options);
}

/**
 * Create new PerfCascade from PerfCascade's internal WaterfallData format
 * @param {WaterfallDocs} waterfallDocsData Object containing data to render
 * @param  {ChartOptions} options - PerfCascade options object
 * @returns {SVGSVGElement} - Chart SVG Element
 */
function fromPerfCascadeFormat(waterfallDocsData: WaterfallDocs, options: Partial<ChartOptions> = {}): SVGSVGElement {
  return PerfCascade(waterfallDocsData, options);
}

let transformHarToPerfCascade = HarTransformer.transformDoc;

// global members that get exported via UMD
export { fromHar }
export { fromPerfCascadeFormat }
export { transformHarToPerfCascade }
export { makeLegend }
// export typings
export * from "./typing/index"

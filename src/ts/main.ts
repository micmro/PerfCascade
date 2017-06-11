import { Har } from "har-format";
import { validateOptions } from "./helpers/parse";
import { makeLegend as makeLegendInternal } from "./legend/legend";
import Paging from "./paging/paging";
import * as HarTransformer from "./transformers/har";
import { ChartOptions, ChartRenderOption, HarTransformerOptions } from "./typing/options";
import { WaterfallDocs } from "./typing/waterfall";
import { createWaterfallSvg } from "./waterfall/svg-chart";

/** default options to use if not set in `options` parameter */
const defaultChartOptions: Readonly<ChartOptions> = {
  leftColumnWidth: 25,
  legendHolder: undefined,
  onParsed: undefined,
  pageSelector: undefined,
  rowHeight: 23,
  selectedPage: 0,
  showAlignmentHelpers: true,
  showIndicatorIcons: true,
  showMimeTypeIcon: true,
  timeSliceOnEnter: undefined,
  timeSliceOnLeave: undefined,
  timeSlices: [],
};

/** default options to use if not set in `options` parameter */
const defaultHarTransformerOptions: Readonly<HarTransformerOptions> = {
  showUserTiming: false,
  showUserTimingEndMarker: false,
};

/**
 * Creates the html for diagrams legend
 * @returns {HTMLUListElement} - Legend `<ul>` element
 */
export function makeLegend(): HTMLUListElement {
  return makeLegendInternal();
}

function PerfCascade(waterfallDocsData: WaterfallDocs, chartOptions: Partial<ChartRenderOption> = {}): SVGSVGElement {
  if (chartOptions["leftColumnWith"] !== undefined) {
    // tslint:disable-next-line: no-console
    console.warn("Depreciation Warning: The option 'leftColumnWith' has been fixed to 'leftColumnWidth', " +
      "please update your code as this will get deprecated in the future");
    chartOptions.leftColumnWidth = chartOptions["leftColumnWith"];
  }
  const options: ChartRenderOption = validateOptions({ ...defaultChartOptions, ...chartOptions } as ChartRenderOption);

  // setup paging helper
  const paging = new Paging(waterfallDocsData, options.selectedPage);

  let doc = createWaterfallSvg(paging.getSelectedPage(), options);

  // page update behaviour
  paging.onPageUpdate((_pageIndex, pageDoc) => {
    const el = doc.parentElement as HTMLElement;
    const newDoc = createWaterfallSvg(pageDoc, options);
    el.replaceChild(newDoc, doc);
    doc = newDoc;
  });

  if (options.pageSelector) {
    paging.initPagingSelectBox(options.pageSelector);
  }

  if (options.legendHolder) {
    options.legendHolder.innerHTML = "";
    options.legendHolder.appendChild(makeLegendInternal());
  }
  return doc;
}

/**
 * Create new PerfCascade from HAR data
 * @param  {Har} harData - HAR object
 * @param  {ChartOptions} options - PerfCascade options object
 * @returns {SVGSVGElement} - Chart SVG Element
 */
export function fromHar(harData: Har, options: ChartOptions = {}): SVGSVGElement {
  const harTransformerOptions = {
    ...defaultHarTransformerOptions,
    ...options,
  };
  const data = HarTransformer.transformDoc(harData, harTransformerOptions);
  if (typeof options.onParsed === "function") {
    options.onParsed(data);
  }
  return PerfCascade(data, options);
}

// aditional imported members that get exported via UMD
export {
  ChartOptions,
};

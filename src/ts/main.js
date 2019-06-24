import { validateOptions } from "./helpers/parse";
import { makeLegend as makeLegendInternal } from "./legend/legend";
import Paging from "./paging/paging";
import * as HarTransformer from "./transformers/har";
import * as JsonTransformer from "./transformers/myJson";
import { createWaterfallSvg } from "./waterfall/svg-chart";
/** default options to use if not set in `options` parameter */
const defaultChartOptions = {
    leftColumnWidth: 25,
    legendHolder: undefined,
    onParsed: undefined,
    pageSelector: undefined,
    rowHeight: 23,
    selectedPage: 0,
    showAlignmentHelpers: true,
    showIndicatorIcons: true,
    showMimeTypeIcon: true,
};
/** default options to use if not set in `options` parameter */
const defaultHarTransformerOptions = {
    showUserTiming: false,
    showUserTimingEndMarker: false,
};
/**
 * Creates the html for diagrams legend
 * @returns {HTMLUListElement} - Legend `<ul>` element
 */
export function makeLegend() {
    return makeLegendInternal();
}
function PerfCascade(waterfallDocsData, chartOptions = {}) {
    if (chartOptions["leftColumnWith"] !== undefined) {
        // tslint:disable-next-line: no-console
        console.warn("Depreciation Warning: The option 'leftColumnWith' has been fixed to 'leftColumnWidth', " +
            "please update your code as this will get deprecated in the future");
        chartOptions.leftColumnWidth = chartOptions["leftColumnWith"];
    }
    const options = validateOptions(Object.assign({}, defaultChartOptions, chartOptions));
    // setup paging helper
    const paging = new Paging(waterfallDocsData, options.selectedPage);
    let doc = createWaterfallSvg(paging.getSelectedPage(), options);
    // page update behaviour
    paging.onPageUpdate((_pageIndex, pageDoc) => {
        const el = doc.parentElement;
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
 *  
 */ 
// @returns {SVGSVGElement} - Chart SVG Element  // edited one
export function fromHar(harData, options = {}) {
    const harTransformerOptions = Object.assign({}, defaultHarTransformerOptions, options);
    const data = HarTransformer.transformDoc(harData, harTransformerOptions);
    if (typeof options.onParsed === "function") {
        options.onParsed(data);
    }
    return PerfCascade(data, options);
}
export function fromJson(JsonData, options = {}) {
    const harTransformerOptions = Object.assign({}, defaultHarTransformerOptions, options);
    const data = JsonTransformer.transformDoc(JsonData, harTransformerOptions);
    if (typeof options.onParsed === "function") {
        options.onParsed(data);
    }
    return PerfCascade(data, options);
}
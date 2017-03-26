import { Entry } from "har-format";
import { escapeHtml } from "../helpers/parse";
import {
  KvTuple,
  RequestType,
  TabRenderer,
  WaterfallEntryIndicator,
  WaterfallEntryTab,
} from "../typing/waterfall";
import { getKeys } from "./extract-details-keys";
import { makeDefinitionList } from "./helpers";

/**
 * Generates the tabs for the details-overlay of a `Entry`
 * @param  {Entry} entry - the entry to parse
 * @param  {number} requestID
 * @param  {RequestType} requestType
 * @param  {number} startRelative - start time in ms, relative to the page's start time
 * @param  {number} endRelative - end time in ms, relative to the page's start time
 * @param  {number} detailsHeight - height of the details-overlay
 * @param  {WaterfallEntryIndicator[]} indicators
 * @returns WaterfallEntryTab
 */
export function makeTabs(entry: Entry, requestID: number, requestType: RequestType,
                         startRelative: number, endRelative: number,
                         indicators: WaterfallEntryIndicator[]): WaterfallEntryTab[] {
  let tabs = [] as WaterfallEntryTab[];

  const tabsData = getKeys(entry, requestID, startRelative, endRelative);
  tabs.push(makeGeneralTab(tabsData.general, indicators));
  tabs.push(makeRequestTab(tabsData.request, tabsData.requestHeaders));
  tabs.push(makeResponseTab(tabsData.response, tabsData.responseHeaders));
  tabs.push(makeWaterfallEntryTab("Timings", makeDefinitionList(tabsData.timings, true)));
  tabs.push(makeRawData(entry));
  if (requestType === "image") {
    tabs.push(makeImgTab(entry));
  }
  return tabs.filter((t) => t !== undefined);
}

/** Helper to create `WaterfallEntryTab` object literal  */
function makeWaterfallEntryTab(title: string, content: string, tabClass: string = ""): WaterfallEntryTab {
  return {
    title,
    content,
    tabClass,
  };
}

/** Helper to create `WaterfallEntryTab` object literal that is evaluated lazyly at runtime (e.g. for performance) */
function makeLazyWaterfallEntryTab(title: string, renderContent: TabRenderer,
                                   tabClass: string = ""): WaterfallEntryTab {
  return {
    title,
    renderContent,
    tabClass,
  };
}

/** General tab with warnings etc. */
function makeGeneralTab(generalData: KvTuple[], indicators: WaterfallEntryIndicator[]): WaterfallEntryTab {
  let content = makeDefinitionList(generalData);
  if (indicators.length === 0) {
    return makeWaterfallEntryTab("General", content);
  }
  let general = `<h2>General</h2>
    <dl>${content}<dl>`;
  content = "";

  // Make indicator sections
  let errors = indicators
    .filter((i) => i.type === "error")
    .map((i) => [i.title, i.description] as KvTuple);
  let warnings = indicators
    .filter((i) => i.type === "warning")
    .map((i) => [i.title, i.description] as KvTuple);
  // all others
  let info = indicators
    .filter((i) => i.type !== "error" && i.type !== "warning")
    .map((i) => [i.title, i.description] as KvTuple);

  if (errors.length > 0) {
    content += `<h2 class="no-boder">Error${errors.length > 1 ? "s" : ""}</h2>
    <dl>${makeDefinitionList(errors)}</dl>`;
  }
  if (warnings.length > 0) {
    content += `<h2 class="no-boder">Warning${warnings.length > 1 ? "s" : ""}</h2>
    <dl>${makeDefinitionList(warnings)}</dl>`;
  }
  if (info.length > 0) {
    content += `<h2 class="no-boder">Info</h2>
    <dl>${makeDefinitionList(info)}</dl>`;
  }

  makeWaterfallEntryTab("General", content + general);
}

function makeRequestTab(request: KvTuple[], requestHeaders: KvTuple[]): WaterfallEntryTab {
  const content = `<dl>
      ${makeDefinitionList(request)}
    </dl>
    <h2>All Request Headers</h2>
    <dl>
      ${makeDefinitionList(requestHeaders)}
    </dl>`;
  return makeWaterfallEntryTab("Request", content);
}

function makeResponseTab(respose: KvTuple[], responseHeaders: KvTuple[]): WaterfallEntryTab {
  const content = `<dl>
      ${makeDefinitionList(respose)}
    </dl>
    <h2>All Response Headers</h2>
    <dl>
      ${makeDefinitionList(responseHeaders)}
    </dl>`;
  return makeWaterfallEntryTab("Response", content);
}

function makeRawData(entry: Entry) {
  // const content = `<pre><code>${escapeHtml(JSON.stringify(entry, null, 2))}</code></pre>`;
  return makeLazyWaterfallEntryTab(
    "Raw Data",
    () => `<pre><code>${escapeHtml(JSON.stringify(entry, null, 2))}</code></pre>`,
    "raw-data",
  );
}

/** Image preview tab */
function makeImgTab(entry: Entry): WaterfallEntryTab {
  return makeLazyWaterfallEntryTab(
    "Preview",
    (detailsHeight: number) => `<img class="preview" style="max-height:${(detailsHeight - 100)}px"
 data-src="${entry.request.url.replace("\"", "&quot;")}" />`);
}

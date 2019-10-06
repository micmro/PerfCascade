import { Entry } from "har-format";
import { pluralize } from "../helpers/misc";
import { escapeHtml, sanitizeUrlForLink } from "../helpers/parse";
import {
  RequestType,
  SafeKvTuple,
  TabRenderer,
  WaterfallEntryIndicator,
  WaterfallEntryTab,
} from "../typing/waterfall";
import { getKeys } from "./extract-details-keys";
import { makeDefinitionList } from "./helpers";

const escapedNewLineRegex = /\\n/g;
const newLineRegex = /\n/g;
const escapedTabRegex = /\\t/g;

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
  const tabs = [] as WaterfallEntryTab[];

  const tabsData = getKeys(entry, requestID, startRelative, endRelative);
  tabs.push(makeGeneralTab(tabsData.general, indicators));
  tabs.push(makeRequestTab(tabsData.request, tabsData.requestHeaders));
  tabs.push(makeResponseTab(tabsData.response, tabsData.responseHeaders));
  tabs.push(makeWaterfallEntryTab("Timings", makeDefinitionList(tabsData.timings, true)));
  tabs.push(makeRawData(entry));
  if (requestType === "image") {
    tabs.push(makeImgTab(entry));
  }
  if (entry.response.content && entry.response.content.mimeType.indexOf("text/") === 0 && entry.response.content.text) {
    tabs.push(makeContentTab(entry));
  }
  return tabs.filter((t) => t !== undefined);
}

/** Helper to create `WaterfallEntryTab` object literal  */
function makeWaterfallEntryTab(title: string, content: string, tabClass: string = ""): WaterfallEntryTab {
  return {
    content,
    tabClass,
    title,
  };
}

/** Helper to create `WaterfallEntryTab` object literal that is evaluated lazily at runtime (e.g. for performance) */
function makeLazyWaterfallEntryTab(title: string, renderContent: TabRenderer,
                                   tabClass: string = ""): WaterfallEntryTab {
  return {
    renderContent,
    tabClass,
    title,
  };
}

/** General tab with warnings etc. */
function makeGeneralTab(generalData: SafeKvTuple[], indicators: WaterfallEntryIndicator[]): WaterfallEntryTab {
  const mainContent = makeDefinitionList(generalData);
  if (indicators.length === 0) {
    return makeWaterfallEntryTab("General", mainContent);
  }
  const general = `<h2>General</h2>\n<dl>${mainContent}<dl>`;
  let content = "";

  // Make indicator sections
  const errors = indicators
    .filter((i) => i.type === "error")
    .map((i) => [i.title, i.description] as SafeKvTuple);
  const warnings = indicators
    .filter((i) => i.type === "warning")
    .map((i) => [i.title, i.description] as SafeKvTuple);
  // all others
  const info = indicators
    .filter((i) => i.type !== "error" && i.type !== "warning")
    .map((i) => [i.title, i.description] as SafeKvTuple);

  if (errors.length > 0) {
    content += `<h2 class="no-border">${pluralize("Error", errors.length)}</h2>
    <dl>${makeDefinitionList(errors)}</dl>`;
  }
  if (warnings.length > 0) {
    content += `<h2 class="no-border">${pluralize("Warning", warnings.length)}</h2>
    <dl>${makeDefinitionList(warnings)}</dl>`;
  }
  if (info.length > 0) {
    content += `<h2 class="no-border">Info</h2>
    <dl>${makeDefinitionList(info)}</dl>`;
  }

  return makeWaterfallEntryTab("General", content + general);
}

function makeRequestTab(request: SafeKvTuple[], requestHeaders: SafeKvTuple[]): WaterfallEntryTab {
  const content = `<dl>
      ${makeDefinitionList(request)}
    </dl>
    <h2>All Request Headers</h2>
    <dl>
      ${makeDefinitionList(requestHeaders)}
    </dl>`;
  return makeWaterfallEntryTab("Request", content);
}

function makeResponseTab(response: SafeKvTuple[], responseHeaders: SafeKvTuple[]): WaterfallEntryTab {
  const content = `<dl>
      ${makeDefinitionList(response)}
    </dl>
    <h2>All Response Headers</h2>
    <dl>
      ${makeDefinitionList(responseHeaders)}
    </dl>`;
  return makeWaterfallEntryTab("Response", content);
}

/** Tab to show the returned (text-based) payload (HTML, CSS, JS etc.) */
function makeContentTab(entry: Entry) {
  const escapedText = entry.response.content.text || "";
  const unescapedText = escapedText.replace(escapedNewLineRegex, "\n").replace(escapedTabRegex, "\t");
  const newLines = escapedText.match(newLineRegex);
  const lineCount = newLines ? newLines.length : 1;
  return makeLazyWaterfallEntryTab(
    `Content (${lineCount} Line${lineCount > 1 ? "s" : ""})`,
    () => `<pre><code>${escapeHtml(unescapedText)}</code></pre> `,
    "content rendered-data",
  );
}

function makeRawData(entry: Entry) {
  return makeLazyWaterfallEntryTab(
    "Raw Data",
    () => `<pre><code>${escapeHtml(JSON.stringify(entry, null, 2))}</code></pre>`,
    "raw-data rendered-data",
  );
}

/** Image preview tab */
function makeImgTab(entry: Entry): WaterfallEntryTab {
  return makeLazyWaterfallEntryTab(
    "Preview",
    (detailsHeight: number) => `<img class="preview" style="max-height:${(detailsHeight - 100)}px"
    data-src="${sanitizeUrlForLink(entry.request.url)}" />`);
  }

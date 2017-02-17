import {WaterfallEntry} from "../../typing/waterfall";
import {getKeys, KvTuple} from "./extract-details-keys";

function makeDefinitionList(dlKeyValues: KvTuple[], addClass: boolean = false) {
  let makeClass = (key: string) => {
    if (!addClass) {
      return "";
    }
    let className = key.toLowerCase().replace(/[^a-z-]/g, "");
    return `class="${className || "no-colour"}"`;
  };
  return dlKeyValues
    .filter((tuple: KvTuple) => tuple[1] !== undefined)
    .map((tuple) => `
      <dt ${makeClass(tuple[0])}>${tuple[0]}</dt>
      <dd>${tuple[1]}</dd>
    `).join("");
}

function makeTab(innerHtml: string, renderDl: boolean = true) {
  if (innerHtml.trim() === "") {
    return "";
  }
  let inner = renderDl ? `<dl>${innerHtml}</dl>` : innerHtml;
  return `<div class="tab">
    ${inner}
  </div>`;
}

function makeImgTab(accordionHeight: number, entry: WaterfallEntry) {
  if (entry.requestType !== "image") {
    return "";
  }
  const imgTag = `<img class="preview" style="max-height:${(accordionHeight - 100)}px"
                        data-src="${entry.rawResource.request.url}" />`;
  return makeTab(imgTag, false);
}

function makeGeneralTab(generalData: KvTuple[], entry: WaterfallEntry) {
  let content = makeDefinitionList(generalData);
  if (entry.indicators.length === 0) {
    return makeTab(content, true);
  }
  let general = `<h2>General</h2>
    <dl>${content}<dl>`;
  content = "";

  // Make indicator sections
  let errors = entry.indicators
    .filter((i) => i.type === "error")
    .map((i) => [i.title, i.description] as KvTuple);
  let warnings = entry.indicators
    .filter((i) => i.type === "warning")
    .map((i) => [i.title, i.description] as KvTuple);
  // all others
  let info = entry.indicators
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
  return makeTab(content + general, false);
}

function makeTabBtn(name: string, tab: string) {
  return !!tab ? `<li><button class="tab-button">${name}</button></li>` : "";
}

export function createDetailsBody(requestID: number, entry: WaterfallEntry, accordeonHeight: number) {

  let html = document.createElement("html") as HTMLHtmlElement;
  let body = document.createElement("body");
  body.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  html.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/xmlns/");

  const tabsData = getKeys(requestID, entry);
  const generalTab = makeGeneralTab(tabsData.general, entry);
  const timingsTab = makeTab(makeDefinitionList(tabsData.timings, true));
  const requestDl = makeDefinitionList(tabsData.request);

  const requestHeadersDl = makeDefinitionList(tabsData.requestHeaders);
  const responseDl = makeDefinitionList(tabsData.response);
  const responseHeadersDl = makeDefinitionList(tabsData.responseHeaders);
  const imgTab = makeImgTab(accordeonHeight, entry);

  body.innerHTML = `
    <div class="wrapper">
      <header class="type-${entry.requestType}">
        <h3><strong>#${requestID}</strong> ${entry.name}</h3>
        <nav class="tab-nav">
        <ul>
          ${makeTabBtn("General", generalTab)}
          <li><button class="tab-button">Request</button></li>
          <li><button class="tab-button">Response</button></li>
          ${makeTabBtn("Timings", timingsTab)}
          <li><button class="tab-button">Raw Data</button></li>
          ${makeTabBtn("Preview", imgTab)}
        </ul>
        </nav>
      </header>
      ${generalTab}
      <div class="tab">
        <dl>
          ${requestDl}
        </dl>
        <h2>All Request Headers</h2>
        <dl>
          ${requestHeadersDl}
        </dl>
      </div>
      <div class="tab">
        <dl>
          ${responseDl}
        </dl>
        <h2>All Response Headers</h2>
        <dl>
          ${responseHeadersDl}
        </dl>
      </div>
      ${timingsTab}
      <div class="tab raw-data">
        <pre><code>${JSON.stringify(entry.rawResource, null, 2)}</code></pre>
      </div>
      ${imgTab}
    </div>
    `;

  html.appendChild(body);
  return html;
}

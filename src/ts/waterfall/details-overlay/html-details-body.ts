import { KvTuple } from "../../typing/misc";
import {WaterfallEntry} from "../../typing/waterfall";
import { getKeys } from "./extract-details-keys";

function makeDefinitionList(dlKeyValues: KvTuple[], addClass: boolean = false) {
  let makeClass = (key: string) => {
    if (!addClass) {
      return "";
    }
    let className = key.toLowerCase().replace(/[^a-z-]/g, "");
    return `class="${className || "no-colour"}"`;
  };
  return dlKeyValues
    .filter((tuple) => (tuple[1] !== undefined && tuple[1] !== -1 && tuple[1] !== 0 && tuple[1] !== ""))
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

function makeImgTab(accordionHeight: number, block: WaterfallEntry) {
  if (block.requestType !== "image") {
    return "";
  }
  const imgTag = `<img class="preview" style="max-height:${(accordionHeight - 100)}px"
                        data-src="${block.rawResource.request.url}" />`;
  return makeTab(imgTag, false);
}

function makeTabBtn(name: string, tab: string) {
  return !!tab ? `<li><button class="tab-button">${name}</button></li>` : "";
}

export function createDetailsBody(requestID: number, block: WaterfallEntry, accordeonHeight: number) {

  let html = document.createElement("html") as HTMLHtmlElement;
  let body = document.createElement("body");
  body.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  html.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/xmlns/");

  const tabsData = getKeys(requestID, block);
  const generalTab = makeTab(makeDefinitionList(tabsData.general));
  const timingsTab = makeTab(makeDefinitionList(tabsData.timings, true));
  const requestDl = makeDefinitionList(tabsData.request);

  const requestHeadersDl = makeDefinitionList(block.rawResource.request.headers.map((h) =>
    [h.name, h.value] as KvTuple));
  const responseDl = makeDefinitionList(tabsData.response);
  const responseHeadersDl = makeDefinitionList(block.rawResource.response.headers.map((h) =>
    [h.name, h.value] as KvTuple));
  const imgTab = makeImgTab(accordeonHeight, block);

  body.innerHTML = `
    <div class="wrapper">
      <header class="type-${block.requestType}">
        <h3><strong>#${requestID}</strong> ${block.name}</h3>
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
      <div class="tab">
        <pre><code>${JSON.stringify(block.rawResource, null, 2)}</code></pre>
      </div>
      ${imgTab}
    </div>
    `;

  html.appendChild(body);
  return html;
}

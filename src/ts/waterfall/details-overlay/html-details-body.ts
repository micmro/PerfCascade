
import svg from "../../helpers/svg"
import dom from "../../helpers/dom"
import TimeBlock from "../../typing/time-block"
import {getKeys} from "./extract-details-keys"

function makeDefinitionList(dlKeyValues) {
  return Object.keys(dlKeyValues)
    .filter(key => (dlKeyValues[key] !== undefined && dlKeyValues[key] !== -1 && dlKeyValues[key] !== 0 && dlKeyValues[key] !== ""))
    .map(key => `
      <dt>${key}</dt>
      <dd>${dlKeyValues[key]}</dd>
    `).join("")
}

function makeTab(innerHtml: string, renderDl: boolean = true) {
  if (innerHtml.trim() === "") {
    return ""
  }
  let inner = renderDl ? `<dl>${innerHtml}</dl>` : innerHtml
  return `<div class="tab">
    ${inner}
  </div>`
}

function makeImgTab(accordeonHeight: number, block: TimeBlock) {
  if (block.requestType !== "image") {
    return ""
  }
  const imgTag = `<img class="preview" style="max-height:${(accordeonHeight - 100)}px" data-src="${block.rawResource.request.url}" />`
  return makeTab(imgTag, false)
}

function makeTabBtn(name: string, tab: string) {
  return !!tab ? `<li><button class="tab-button">${name}</button></li>` : ""
}

export function createDetailsBody(requestID: number, block: TimeBlock, accordeonHeight: number) {

  let html = document.createElement("html") as HTMLHtmlElement
  let body = document.createElement("body");
  body.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  html.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/xmlns/")
  // html.style.overflow = "crop"
  // body.style.height = `${accordeonHeight}px`
  // body.style.overflow = "crop"
  // body.style.overflow = "scroll"

  const tabsData = getKeys(requestID, block)
  const generalTab = makeTab(makeDefinitionList(tabsData.general))
  const timingsTab = makeTab(makeDefinitionList(tabsData.timings))
  const requestDl = makeDefinitionList(tabsData.request)
  const requestHeadersDl = makeDefinitionList(block.rawResource.request.headers.reduce((pre, curr) => {
    pre[curr.name] = curr.value
    return pre
  }, {}))
  const responseDl = makeDefinitionList(tabsData.response)
  const responseHeadersDl = makeDefinitionList(block.rawResource.response.headers.reduce((pre, curr) => {
    pre[curr.name] = curr.value
    return pre
  }, {}))
  const imgTab = makeImgTab(accordeonHeight, block)

  body.innerHTML = `
    <div class="wrapper">
      <h3>#${requestID} ${block.name}</h3>
      <nav class="tab-nav">
      <ul>
        ${makeTabBtn("Preview", imgTab)}
        ${makeTabBtn("General", generalTab)}
        <li><button class="tab-button">Request</button></li>
        <li><button class="tab-button">Response</button></li>
        ${makeTabBtn("Timings", timingsTab)}
        <li><button class="tab-button">Raw Data</button></li>
      </ul>
      </nav>
      ${imgTab}
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
        <code>
          <pre>${JSON.stringify(block.rawResource, null, 2)}</pre>
        </code>
      </div>
    </div>
    `

  html.appendChild(body)
  return html
}

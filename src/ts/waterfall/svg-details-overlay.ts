
import svg from "../helpers/svg"
import dom from "../helpers/dom"
import TimeBlock from "../typing/time-block"

//TODO: Delete - temp only - needt to greate source agnostic data structure
import {Entry} from "../typing/har"


function createCloseButtonSvg(y: number): SVGGElement {
  let closeBtn = svg.newEl("a", {
    "class": "info-overlay-close-btn"
  }) as SVGGElement

  closeBtn.appendChild(svg.newEl("rect", {
    "width": 25,
    "height": 25,
    "x": "100%",
    "y": y,
    "rx": 5,
    "ry": 5
  }))

  closeBtn.appendChild(svg.newEl("text", {
    "width": 25,
    "height": 25,
    "x": "100%",
    "y": y,
    "dx": 9,
    "dy": 17,
    "fill": "#111",
    "text": "X",
    "textAnchor": "middle"
  }))

  closeBtn.appendChild(svg.newEl("title", {
    "text": "Close Overlay"
  }))

  return closeBtn
}


function createHolder(y: number, leftFixedWidth: number): SVGGElement {
  let holder = svg.newEl("g", {
    "class": "info-overlay-holder",
    "transform": `translate(-${leftFixedWidth})`
  }) as SVGGElement

  let bg = svg.newEl("rect", {
    "width": "100%",
    "height": 350,
    "x": "0",
    "y": y,
    "rx": 2,
    "ry": 2,
    "class": "info-overlay"
  })

  holder.appendChild(bg)
  return holder
}


function getKeys(requestID: number, block: TimeBlock) {
  //TODO: dodgy casting - will not work for other adapters
  let entry = block.rawResource as Entry

  let ifValueDefined = (value: number, fn: (number) => any) => {
    if (typeof value !== "number" || value <= 0) {
      return undefined
    }
    return fn(value)
  }

  let formatBytes = (size?: number) => ifValueDefined(size, size =>
    `${size} byte (~${Math.round(size / 1024 * 10) / 10}kb)`)
  let formatTime = (size?: number) => ifValueDefined(size, size =>
    `${size}ms`)

  let getRequestHeader = (name: string): string => {
    let header = entry.request.headers.filter(h => h.name.toLowerCase() === name.toLowerCase())[0]
    return header ? header.value : ""
  }

  let getResponseHeader = (name: string): string => {
    let header = entry.response.headers.filter(h => h.name.toLowerCase() === name.toLowerCase())[0]
    return header ? header.value : ""
  }

  /** get experimental feature */
  let getExp = (name: string): string => {
   return entry[name]||""
  }

  const emptyHeader = {"value": ""}
  return {
    "general": {
      "Request Number": `#${requestID}`,
      "Started": new Date(entry.startedDateTime).toLocaleString() + " (" + formatTime(block.start) + " after page reqest started)",
      "Duration": formatTime(entry.time),
      "Status": entry.response.status + " " + entry.response.statusText,
      "Server IPAddress": entry.serverIPAddress,
      "Connection": entry.connection,
      "Browser Priority": getExp("_priority"),
      "Initiator": getExp("_initiator"),
      "Initiator Line": getExp("_initiator_line"),
      "Expires": getExp("_expires"),
      "Cache Time": getExp("_cache_time"),
      "CDN Provider": getExp("_cdn_provider"),
      "Gzip Total": getExp("_gzip_total"),
      "Minify Total": getExp("_minify_total"),
      "Minify Save": getExp("_minify_save"),
      "Image Total": getExp("_image_total"),
      "Image Save": getExp("_image_save")
    },
    "request": {
      "Method": entry.request.method,
      "HTTP Version": entry.request.httpVersion,
      "Headers Size": formatBytes(entry.request.headersSize),
      "Body Size": formatBytes(entry.request.bodySize),
      "Comment": entry.request.comment,
      "User-Agent": getRequestHeader("User-Agent"),
      "Host": getRequestHeader("Host"),
      "Connection": getRequestHeader("Connection"),
      "Accept": getRequestHeader("Accept"),
      "Accept-Encoding": getRequestHeader("Accept-Encoding"),
      "Accept-Language": getRequestHeader("Accept-Language"),
      "Querystring parameters count": entry.request.queryString.length,
      "Cookies count": entry.request.cookies.length
    },
    "response": {
      "Status": entry.response.status + " " + entry.response.statusText,
      "HTTP Version": entry.response.httpVersion,
      "Header Size": formatBytes(entry.response.headersSize),
      "Body Size": formatBytes(entry.response.bodySize),
      "Content-Type": getResponseHeader("Content-Type"),
      "Cache-Control": getResponseHeader("Cache-Control"),
      "Expires": getResponseHeader("Expires"),
      "Last-Modified": getResponseHeader("Last-Modified"),
      "Server": getResponseHeader("Server"),
      "Timing-Allow-Origin": getResponseHeader("Timing-Allow-Origin"),
      "Content-Length": getResponseHeader("Content-Length"),
      "Content Size": entry.response.content.size,
      "Content Compression": entry.response.content.compression,
      "Connection": getResponseHeader("Connection"),
      "X-Served-By": getResponseHeader("X-Served-By"),
      "Vary": getResponseHeader("Vary"),
      "Redirect URL": entry.response.redirectURL,
      "Comment": entry.response.comment
    }
  }
}


function makeDefinitionList(dlKeyValues) {
  return Object.keys(dlKeyValues)
    .filter(key => (dlKeyValues[key] !== undefined && dlKeyValues[key] !== -1 && dlKeyValues[key] !== 0 && dlKeyValues[key] !== ""))
    .map(key => `
      <dt>${key}</dt>
      <dd>${dlKeyValues[key]}</dd>
    `).join("")
}

function createBody(requestID: number, block: TimeBlock){
    let body = document.createElement("body");
    body.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

    const tabsData = getKeys(requestID, block)
    const generalDl = makeDefinitionList(tabsData.general)
    const requestDl = makeDefinitionList(tabsData.request)
    const responseDl = makeDefinitionList(tabsData.response)

    body.innerHTML = `
    <div class="wrapper">
      <h3>#${requestID} ${block.name}</h3>
      <nav class="tab-nav">
      <ul>
        <li><button class="tab-button">General</button></li>
        <li><button class="tab-button">Request</button></li>
        <li><button class="tab-button">Response</button></li>
        <li><button class="tab-button">Raw Data</button></li>
      </ul>
      </nav>
      <div class="tab">
        <dl>
          ${generalDl}
        </dl>
      </div>
      <div class="tab">
        <dl>
          ${requestDl}
        </dl>
      </div>
      <div class="tab">
        <dl>
          ${responseDl}
        </dl>
      </div>
      <div class="tab">
        <code>
          <pre>${JSON.stringify(block.rawResource, null, 2)}</pre>
        </code>
      </div>
    </div>
    `
    return body
}

export function createRowInfoOverlay(requestID: number, barX: number, y: number, block: TimeBlock, leftFixedWidth: number, unit: number): SVGGElement {
  let holder = createHolder(y, leftFixedWidth)

  let html = svg.newEl("foreignObject", {
    "width": "100%",
    "height": 250,
    "x": "0",
    "y": y,
    "dy": "5",
    "dx": "5"
  }) as SVGForeignObjectElement


  let closeBtn = createCloseButtonSvg(y)
  closeBtn.addEventListener('click', evt => holder.parentElement.removeChild(holder))

  let body = createBody(requestID, block)
  let buttons = body.getElementsByClassName("tab-button") as NodeListOf<HTMLButtonElement>
  let tabs = body.getElementsByClassName("tab") as NodeListOf<HTMLDivElement>

  let setTabStatus = (index) => {
    dom.forEach(tabs, (tab: HTMLDivElement, j) => {
      tab.style.display = (index === j) ? "block" : "none"
      buttons.item(j).classList.toggle("active", (index === j))
    })
  }

  dom.forEach(buttons, (btn, i) => {
    btn.addEventListener("click", () => { setTabStatus(i) })
  })

  setTabStatus(0)

  html.appendChild(body)
  holder.appendChild(html)
  holder.appendChild(closeBtn)


  return holder
}


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

  let formatBytes = (size?: number) => ifValueDefined(size, s =>
    `${s} byte (~${Math.round(s / 1024 * 10) / 10}kb)`)
  let formatTime = (size?: number) => ifValueDefined(size, s =>
    `${s}ms`)

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
    return entry[name] || entry["_" + name] || ""
  }

  let getExpNotNull = (name: string): string => {
    let resp = getExp(name)
    return  resp !== "0" ? resp : ""
  }

  let getExpAsByte = (name: string): string => {
    let resp = parseInt(getExp(name), 10)
    return  (isNaN(resp) || resp <= 0) ? "" : formatBytes(resp)
  }

  let getExpTimeRange = (name: string): string => {
    let ms = getExp(name + "_ms").toString()
    let start = getExp(name + "_start")
    let end = getExp(name + "_end")
    let resp = []
    if (start && end && start < end) {
      resp.push(`${start}ms - ${end}ms`)
    }
    if (ms && ms !== "-1") {
      resp.push(`(${ms}ms)`)
    }
    return resp.join(" ")
  }

  return {
    "general": {
      "Request Number": `#${requestID} ${entry._index}`,
      "Started": new Date(entry.startedDateTime).toLocaleString() + " (" + formatTime(block.start) + " after page reqest started)",
      "Duration": formatTime(entry.time),
      "Status": entry.response.status + " " + entry.response.statusText,
      "Server IPAddress": entry.serverIPAddress,
      "Connection": entry.connection,
      "Browser Priority": getExp("priority"),
      "Initiator": getExp("initiator"),
      "Initiator Line": getExp("initiator_line"),
      "Expires": getExp("expires"),
      "Cache Time": getExp("cache_time"),
      "CDN Provider": getExp("cdn_provider"),
      "Bytes In":  getExpAsByte("bytesIn"),
      "Bytes Out":  getExpAsByte("bytesOut"),
      "IP Address": getExp("ip_addr"),
      "JPEG Scan Count": getExpNotNull("jpeg_scan_count"),
      "Gzip Total": getExpAsByte("gzip_total"),
      "Gzip Save": getExpAsByte("gzip_safe"),
      "Minify Total": getExpAsByte("minify_total"),
      "Minify Save": getExpAsByte("minify_save"),
      "Image Total": getExpAsByte("image_total"),
      "Image Save": getExpAsByte("image_save"),
    },
    "timings": {
      "Server RTT": getExpTimeRange("server_rtt"),
      "all (combined)": getExpTimeRange("all"),
      "DNS": getExpTimeRange("dns"),
      "Connect": getExpTimeRange("connect"),
      "TLS/SSL": getExpTimeRange("ssl"),
      "Load": getExpTimeRange("load"),
      "TTFB": getExpTimeRange("ttfb"),
      "Download": getExpTimeRange("download"),
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
      "Expect": getRequestHeader("Expect"),
      "Forwarded": getRequestHeader("Forwarded"),
      "If-Modified-Since": getRequestHeader("If-Modified-Since"),
      "If-Range": getRequestHeader("If-Range"),
      "If-Unmodified-Since": getRequestHeader("If-Unmodified-Since"),
      "Querystring parameters count": entry.request.queryString.length,
      "Cookies count": entry.request.cookies.length
    },
    "response": {
      "Status": entry.response.status + " " + entry.response.statusText,
      "HTTP Version": entry.response.httpVersion,
      "Header Size": formatBytes(entry.response.headersSize),
      "Body Size": formatBytes(entry.response.bodySize),
      "Content-Type": getResponseHeader("Content-Type") + " | " + entry._contentType,
      "Cache-Control": getResponseHeader("Cache-Control"),
      "Content-Encoding": getResponseHeader("Content-Encoding"),
      "Expires": getResponseHeader("Expires"),
      "Last-Modified": getResponseHeader("Last-Modified"),
      "Pragma": getResponseHeader("Pragma"),
      "Content-Length": getResponseHeader("Content-Length"),
      "Content Size": entry.response.content.size,
      "Content Compression": entry.response.content.compression,
      "Connection": getResponseHeader("Connection"),
      "ETag": getResponseHeader("ETag"),
      "Accept-Patch": getResponseHeader("Accept-Patch"),
      "Age": getResponseHeader("Age"),
      "Allow": getResponseHeader("Allow"),
      "Content-Disposition": getResponseHeader("Content-Disposition"),
      "Location": getResponseHeader("Location"),
      "Strict-Transport-Security": getResponseHeader("Strict-Transport-Security"),
      "Trailer (for chunked transfer coding)": getResponseHeader("Trailer"),
      "Transfer-Encoding": getResponseHeader("Transfer-Encoding"),
      "Upgrade": getResponseHeader("Upgrade"),
      "Vary": getResponseHeader("Vary"),
      "Timing-Allow-Origin": getResponseHeader("Timing-Allow-Origin"),
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

function createBody(requestID: number, block: TimeBlock) {
  let body = document.createElement("body");
  body.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

  const tabsData = getKeys(requestID, block)
  const generalDl = makeDefinitionList(tabsData.general)
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
  const timingsDl = makeDefinitionList(tabsData.timings)
  const isImg = block.requestType === "image"
  const imgTab = isImg ? `
    <div class="tab">
       <img class="preview" data-src="${block.rawResource.request.url}" /> 
     </div>  
  ` : ""
  const imgBtn = isImg ? `<li><button class="tab-button">Preview</button></li>` : ""

  body.innerHTML = `
    <div class="wrapper">
      <h3>#${requestID} ${block.name}</h3>
      <nav class="tab-nav">
      <ul>
        ${imgBtn}
        <li><button class="tab-button">General</button></li>
        <li><button class="tab-button">Request</button></li>
        <li><button class="tab-button">Response</button></li>
        <li><button class="tab-button">Timings</button></li>
        <li><button class="tab-button">Raw Data</button></li>
      </ul>
      </nav>
      ${imgTab}
      <div class="tab">
        <dl>
          ${generalDl}
        </dl>
      </div>
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
      <div class="tab">
        <dl>
          ${timingsDl}
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

export function createRowInfoOverlay(requestID: number, barX: number, y: number, block: TimeBlock,
  leftFixedWidth: number, unit: number): SVGGElement {
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
  closeBtn.addEventListener("click", evt => holder.parentElement.removeChild(holder))

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

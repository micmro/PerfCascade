
import svg from "../helpers/svg"
import TimeBlock from "../typing/time-block"

//TODO: Delete - temp only - needt to greate source agnostic data structure
import {Entry} from "../typing/har"


function createCloseButtonSvg(y: number): SVGGElement {
  let closeBtn = svg.newEl("g", {
    "class": "info-overlay-close-btn",
    "transform": "translate(-15, -10)"
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


function createHolder(y: number): SVGGElement {
  let holder = svg.newEl("g", {
    "class": "info-overlay-holder",
     "transform": "translate(-200)"
  }) as SVGGElement

  let bg = svg.newEl("rect", {
    "width": "100%",
    "height": 250,
    "x": "0",
    "y": y,
    "class": "info-overlay"
  })

  holder.appendChild(bg)
  return holder
}


function getKeys(block: TimeBlock): Object {
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

  return {
    "Started": new Date(entry.startedDateTime).toLocaleString() + " (" + formatTime(block.start) + ")",
    "Duration": formatTime(entry.time),
    "Server IPAddress": entry.serverIPAddress,
    "Connection": entry.connection,
    "Request HTTP Version": entry.request.httpVersion,
    "Request Headers Size": formatBytes(entry.request.headersSize),
    "Request Body Size": formatBytes(entry.request.bodySize),
    "Request Comment": entry.request.comment,
    "Request Method": entry.request.method,
    "Response Status": entry.response.status + " " + entry.response.statusText,
    "Response HTTP Version": entry.response.httpVersion,
    "Response Body Size": formatBytes(entry.response.bodySize),
    "Response Header Size": formatBytes(entry.response.headersSize),
    "Response Redirect URL": entry.response.redirectURL,
    "Response Comment": entry.response.comment
  } 
}

export function createRowInfoOverlay(requestID: number, barX: number, y: number, block: TimeBlock, unit: number): SVGGElement {
  let holder = createHolder(y)

  let html = svg.newEl("foreignObject", {
    "width": "98%",
    "height": 250,
    "x": "0",
    "y": y
  }) as SVGForeignObjectElement
  

  let closeBtn = createCloseButtonSvg(y)
  closeBtn.addEventListener('click', evt => holder.parentElement.removeChild(holder))


  let body = document.createElement("body");
  body.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

  const dlKeyValues = getKeys(block)

  const dlData = Object.keys(dlKeyValues)
    .filter(key => (dlKeyValues[key] !== undefined && dlKeyValues[key] !== -1 && dlKeyValues[key] !== ""))
    .map(key => `
      <dt>${key}</dt>
      <dd>${dlKeyValues[key]}</dd>
    `).join("")

  // entry.request.httpVersion

  body.innerHTML = `
    <div class="wrapper">
      <h3>#${requestID} ${block.name}</h3>
      <dl>
        ${dlData}
      </dl>
    </div>
    `

  html.appendChild(body)

  holder.appendChild(html)
  holder.appendChild(closeBtn)
  

  return holder
}

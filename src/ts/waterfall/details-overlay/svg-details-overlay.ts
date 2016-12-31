import * as svg from "../../helpers/svg"
import * as dom from "../../helpers/dom"
import {createDetailsBody} from "./html-details-body"
import {WaterfallEntry} from "../../typing/waterfall";

function createCloseButtonSvg(y: number): SVGGElement {
  let closeBtn = svg.newA("info-overlay-close-btn")

  closeBtn.appendChild(svg.newRect({
    "width": 23,
    "height": 23,
    "x": "100%",
    "y": y
  }))

  closeBtn.appendChild(svg.newTextEl("X", "100%", y, {
    "width": 23,
    "height": 23,
    "dx": 7,
    "dy": 16,
    "fill": "#111",
    "textAnchor": "middle"
  }))

  closeBtn.appendChild(svg.newTitle("Close Overlay"))

  return closeBtn
}

function createHolder(y: number, accordionHeight: number) {

  let innerHolder = svg.newG("info-overlay-holder", {
    "width": "100%"
  })

  let bg = svg.newRect({
    "width": "100%",
    "height": accordionHeight,
    "x": "0",
    "y": y,
    "rx": 2,
    "ry": 2,
    "class": "info-overlay"
  })

  innerHolder.appendChild(bg)
  return innerHolder
}

export function createRowInfoOverlay(indexBackup: number, _barX: number, y: number,
                                     accordionHeight: number, block: WaterfallEntry,
                                     onClose: Function, _unit: number): SVGGElement {
  const requestID =  parseInt(block.rawResource._index + 1, 10) || indexBackup + 1
  let wrapper = svg.newG("outer-info-overlay-holder", {
    "width": "100%"
  })
  let holder = createHolder(y, accordionHeight)

  let foreignObject = svg.newForeignObject({
    "width": "100%",
    "height": accordionHeight,
    "x": "0",
    "y": y,
    "dy": "5",
    "dx": "5"
  })

  let closeBtn = createCloseButtonSvg(y)
  closeBtn.addEventListener("click", () => onClose(indexBackup, holder))

  let body = createDetailsBody(requestID, block, accordionHeight)
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

  foreignObject.appendChild(body)
  holder.appendChild(foreignObject)
  holder.appendChild(closeBtn)

  wrapper.appendChild(holder)

  return wrapper
}

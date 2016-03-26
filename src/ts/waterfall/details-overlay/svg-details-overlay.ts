
import svg from "../../helpers/svg"
import dom from "../../helpers/dom"
import TimeBlock from "../../typing/time-block"
import {createDetailsBody} from "./html-details-body"


function createCloseButtonSvg(y: number): SVGGElement {
  let closeBtn = svg.newEl("a", {
    "class": "info-overlay-close-btn"
  }) as SVGGElement

  closeBtn.appendChild(svg.newEl("rect", {
    "width": 23,
    "height": 23,
    "x": "100%",
    "y": y
  }))

  closeBtn.appendChild(svg.newEl("text", {
    "width": 23,
    "height": 23,
    "x": "100%",
    "y": y,
    "dx": 7,
    "dy": 16,
    "fill": "#111",
    "text": "X",
    "textAnchor": "middle"
  }))

  closeBtn.appendChild(svg.newEl("title", {
    "text": "Close Overlay"
  }))

  return closeBtn
}


function createHolder(y: number, accordeonHeight: number) {

 let innerHolder = svg.newG("outer-info-overlay-holder", {
    "width": "100%"
  })

//  let innerHolder = svg.newSvg("info-overlay-holder", {
//     "width": "100%",
//     "x": "0",
//     "y": y
//   })

  let bg = svg.newEl("rect", {
    "width": "100%",
    "height": accordeonHeight,
    "x": "0",
    "y": y,
    "rx": 2,
    "ry": 2,
    "class": "info-overlay"
  })

  innerHolder.appendChild(bg)
  return innerHolder
}

export function createRowInfoOverlay(indexBackup: number, barX: number,  y: number, accordeonHeight: number, block: TimeBlock,
  onClose: Function, unit: number): SVGGElement {
  const requestID =  parseInt(block.rawResource._index, 10) || indexBackup
  let wrapper = svg.newG("outer-info-overlay-holder", {
    "width": "100%"
  })
  let holder = createHolder(y, accordeonHeight)

  let html = svg.newEl("foreignObject", {
    "width": "100%",
    "height": accordeonHeight - 100,
    "x": "0",
    "y": y,
    "dy": "5",
    "dx": "5"
  }) as SVGForeignObjectElement


  let closeBtn = createCloseButtonSvg(y)
  closeBtn.addEventListener("click", evt => onClose(wrapper))

  let body = createDetailsBody(requestID, block, accordeonHeight)
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

  wrapper.appendChild(holder)

  return wrapper
}

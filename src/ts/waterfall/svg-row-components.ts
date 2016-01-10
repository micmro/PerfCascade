/**
 * Creation of sub-components used in a ressource request row
 */

import svg from "../helpers/svg"
import TimeBlock from "../typing/time-block"
import {Mark} from "../typing/waterfall-data"

/**
 * Interface for `createRect` parameter
 */
export interface RectData {
  width: number
  height: number
  x: number
  y: number
  cssClass: string
  label?: string
  unit: number
  /** @type {Function} Partially appliable function (to capture row data) that return an event listener */
  showOverlay: Function
  /** @type {Function} Partially appliable function (to capture row data) that return an event listener */
  hideOverlay: Function
}

/**
 * Render the block and timings for a request
 * @param  {RectData}         rectData Basic dependencys and globals
 * @param  {Array<TimeBlock>} segments Request and Timing Data
 * @return {SVGElement}                Renerated SVG (rect or g element)
 */
export function createRect(rectData: RectData, segments?: Array<TimeBlock>): SVGElement {
  const blockHeight = rectData.height - 1
  let rectHolder
  let rect = svg.newEl("rect", {
    "width": (rectData.width / rectData.unit) + "%",
    "height": blockHeight,
    "x": Math.round((rectData.x / rectData.unit) * 100) / 100 + "%",
    "y": rectData.y,
    "class": ((segments && segments.length > 0 ? "time-block" : "segment")) + " "
    + (rectData.cssClass || "block-other")
  })
  if (rectData.label) {
    rect.appendChild(svg.newEl("title", {
      "text": rectData.label
    })) // Add tile to wedge path
  }

  rect.addEventListener("mouseenter", rectData.showOverlay(rectData))
  rect.addEventListener("mouseleave", rectData.hideOverlay(rectData))

  if (segments && segments.length > 0) {
    rectHolder = svg.newEl("g", {
      "class": "rect-holder"
    })
    rectHolder.appendChild(rect)
    segments.forEach((segment) => {
      if (segment.total > 0 && typeof segment.start === "number") {
        let childRectData = {
          "width": segment.total,
          "height": (blockHeight - 5),
          "x": segment.start || 0.001,
          "y": rectData.y,
          "cssClass": segment.cssClass,
          "label": segment.name + " (" + Math.round(segment.start) + "ms - "
          + Math.round(segment.end) + "ms | total: " + Math.round(segment.total) + "ms)",
          "unit": rectData.unit,
          "showOverlay": rectData.showOverlay,
          "hideOverlay": rectData.hideOverlay
        } as RectData

        rectHolder.appendChild(createRect(childRectData))
      }
    })
    return rectHolder
  } else {
    return rect
  }
}


/**
 * Create a new SVG Text element to label a request block
 * @param  {number}         x                horizontal position (in px)
 * @param  {number}         y                vertical position of related request block (in px)
 * @param  {TimeBlock}      block            Ressource Request
 * @param  {number}         leftFixedWidth   Width of fixed name and highlight column
 * @param  {number}         height           height of row
 * @return {SVGTextElement}                  lable SVG element
 */
export function createRequestLabel(x: number, y: number, block: TimeBlock, leftFixedWidth: number, height: number): SVGTextElement {
  //crop name if longer than 30 characters
  let clipName = (block.name.length > 30 && block.name.indexOf("?") > 0)
  let blockName = (clipName) ? block.name.split("?")[0] + "?…" : block.name

  let blockLabel = svg.newTextEl(blockName + " (" + Math.round(block.total) + "ms)", (y + Math.round(height / 2) + 5))

  blockLabel.appendChild(svg.newEl("title", {
    "text": block.name
  }))

  blockLabel.setAttribute("x", x.toString())
  blockLabel.style.opacity = block.name.match(/js.map$/) ? "0.5" : "1"

  return blockLabel
}



/**
 * Stripe for BG
 * @param  {number}      y              [description]
 * @param  {number}      height         [description]
 * @param  {number}      leftFixedWidth [description]
 * @param  {boolean}     isEven         [description]
 * @return {SVGGElement}                [description]
 */
export function createBgStripe(y: number, height: number, leftFixedWidth: number, isEven: boolean): SVGGElement {
  let stripeHolder = svg.newEl("g", {
    "class": isEven ? "even" : "odd"
  }) as SVGGElement

  stripeHolder.appendChild(svg.newEl("rect", {
    "width": "100%", //make up for the spacing
    "height": height,
    "x": 0,
    "y": y,
    "class": "flex"
  }))
  stripeHolder.appendChild(svg.newEl("rect", {
    "width": leftFixedWidth, //make up for the spacing
    "height": height,
    "x": "-" + leftFixedWidth,
    "y": y,
    "class": "fixed"
  }))

  return stripeHolder
}



export function createFixedRow(y: number, requestBarHeight: number, onClick: EventListener, leftFixedWidth: number): SVGGElement {
  let rowFixed = svg.newEl("g", {
    "class": "row row-fixed"
  }) as SVGGElement

  rowFixed.appendChild(svg.newEl("rect", {
    "width": leftFixedWidth,
    "height": requestBarHeight,
    "x": "0",
    "y": y,
    "opacity": "0"
  }))

  rowFixed.addEventListener('click', onClick)

  return rowFixed
}

export function createFlexRow(y: number, requestBarHeight: number, onClick: EventListener): SVGGElement {
  let rowFixed = svg.newEl("g", {
    "class": "row row-flex"
  }) as SVGGElement

  rowFixed.appendChild(svg.newEl("rect", {
    "width": "100%",
    "height": requestBarHeight,
    "x": "0",
    "y": y,
    "opacity": "0"
  }))

  rowFixed.addEventListener('click', onClick)

  return rowFixed
}

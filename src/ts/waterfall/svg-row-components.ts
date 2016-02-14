/**
 * Creation of sub-components used in a ressource request row
 */

import svg from "../helpers/svg"
import TimeBlock from "../typing/time-block"

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
 * Create a new clipper SVG Text element to label a request block to fit the left panel width
 * @param  {number}         x                horizontal position (in px)
 * @param  {number}         y                vertical position of related request block (in px)
 * @param  {string}         name             URL
 * @param  {number}         height           height of row
 * @return {SVGTextElement}                  lable SVG element
 */
export function createRequestLabelClipped(x: number, y: number, name: string, height: number, clipPathId?: string) {

  let blockLabel = createRequestLabel(x, y, name, height)
  blockLabel.style.clipPath = `url(#titleClipPath)`
  return blockLabel
}


/**
 * Create a new full width SVG Text element to label a request block
 * @param  {number}         x                horizontal position (in px)
 * @param  {number}         y                vertical position of related request block (in px)
 * @param  {string}         name             URL
 * @param  {number}         height           height of row
 */
export function createRequestLabelFull(x: number, y: number, name: string, height: number) {
  let blockLabel = createRequestLabel(x, y, name, height)
  let lableHolder = svg.newG("full-lable")
  lableHolder.appendChild(svg.newEl("rect", {
    "class": "label-full-bg",
    "x": x - 3,
    "y": y + 3,
    "width": svg.getNodeTextWidth(blockLabel),
    "height": height - 4,
    "rx": 5,
    "ry": 5
  }))
  lableHolder.appendChild(blockLabel)
  return lableHolder
}



// private helper
function createRequestLabel(x: number, y: number, name: string, height: number): SVGTextElement {
  const blockName = name.replace(/http[s]\:\/\//, "")
  let blockLabel = svg.newTextEl(blockName, (y + Math.round(height / 2) + 5))

  blockLabel.appendChild(svg.newEl("title", {
    "text": name
  }))

  blockLabel.setAttribute("x", x.toString())
  blockLabel.style.opacity = name.match(/js.map$/) ? "0.5" : "1"

  return blockLabel
}



/**
 * Appends the labels to `rowFixed` - TODO: see if this can be done more elegant  
 * @param {SVGGElement}    rowFixed   [description]
 * @param {SVGTextElement} shortLabel [description]
 * @param {SVGGElement}    fullLabel  [description]
 */
export function appendRequestLabels(rowFixed: SVGGElement, shortLabel: SVGTextElement, fullLabel: SVGGElement) {
  let lableFullBg = fullLabel.getElementsByTagName("rect")[0] as SVGRectElement
  let fullLableText = fullLabel.getElementsByTagName("text")[0] as SVGTextElement

  //use display: none to not render it and visibility to remove it from search results (crt+f in chrome at least)
  fullLabel.style.display = "none"
  fullLabel.style.visibility = "hidden"
  rowFixed.appendChild(shortLabel)
  rowFixed.appendChild(fullLabel)

  rowFixed.addEventListener("mouseenter", () => {
    fullLabel.style.display = "block"
    shortLabel.style.display = "none"
    fullLabel.style.visibility = "visible"
    lableFullBg.style.width = (fullLableText.clientWidth + 10).toString()
  })
  rowFixed.addEventListener("mouseleave", () => {
    shortLabel.style.display = "block"
    fullLabel.style.display = "none"
    fullLabel.style.visibility = "hidden"
  })
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

  rowFixed.addEventListener("click", onClick)

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

  rowFixed.addEventListener("click", onClick)

  return rowFixed
}

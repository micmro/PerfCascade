import TimeBlock from "../typing/time-block"
import {WaterfallData} from "../typing/waterfall-data"
import svg from "../helpers/svg"
import icons from "../helpers/icons"
import misc from "../helpers/misc"
import {
  createBgRect,
  createTimeScale,
  createMarks,
  makeHoverEvtListeners,
  createAlignmentLines,
} from "./svg-general-components"

import {
  RectData,
  createRect,
  createRequestLabelFull,
  createRequestLabelClipped,
  createBgStripe,
  createFixedRow,
  createFlexRow
} from "./svg-row-components"
import {createRowInfoOverlay} from "./svg-details-overlay"
import dom from '../helpers/dom'



/**
 * Function to format the shortened URL
 * @param  {string} url       URL of ressource
 * @param  {number} maxLength maximal 
 * @return {string}           [description]
 */
function ressourceUrlFormater(url: string): string {
  const maxLength = 40
  if (url.length < maxLength) {
    return url.replace(/http[s]\:\/\//, "")
  }

  let matches = misc.parseUrl(url)

  if ((matches.authority + matches.path).length < maxLength){
    return matches.authority + matches.path
  }

  let p = matches.path.split("/")
  return matches.authority + "…/" + p[p.length - 1]
}


/**
 * Calculate the height of the SVG chart in px 
 * @param {any[]}       marks      [description]
 * @param {TimeBlock[]} barsToShow [description]
 */
function getSvgHeight(marks: any[], barsToShow: TimeBlock[], diagramHeight: number) {
  const maxMarkTextLength = marks.reduce((currMax: number, currValue: TimeBlock) => {
    return Math.max(currMax, svg.getNodeTextWidth(svg.newTextEl(currValue.name, 0)))
    }, 0)

  return diagramHeight + maxMarkTextLength + 35
}

/**
 * Entry point to start rendering the full waterfall SVG
 * @param {WaterfallData} data  Object containing the setup parameter
 * @return {SVGSVGElement}      SVG Element ready to render
 */
export function createWaterfallSvg(data: WaterfallData): SVGSVGElement {

  //constants
  
  /** horizontal unit (duration in ms of 1%) */
  const unit: number = data.durationMs / 100
  /** height of every request bar block plus spacer pixel */
  const requestBarHeight: number = 23
  /** width of the url and highlight rule column in pixel */
  const leftFixedWidth: number = 250

  const barsToShow = data.blocks
    .filter((block) => (typeof block.start == "number" && typeof block.total == "number"))
    .sort((a, b) => (a.start || 0) - (b.start || 0))

  /** height of the requests part of the diagram in px */
  const diagramHeight = (barsToShow.length + 1) * requestBarHeight

  /** full height of the SVG chart in px */
  const chartHolderHeight = getSvgHeight(data.marks, barsToShow, diagramHeight)

  //Main holder
  let timeLineHolder = svg.newSvg("water-fall-chart", {
    "height": Math.floor(chartHolderHeight)
    }, {
    "paddingLeft": leftFixedWidth + "px"
  })

  //Other holder elements
  let leftFixedHolder = svg.newSvg("left-fixed-holder",{
    "x": "-" + leftFixedWidth,
    "width": leftFixedWidth
  })
  let flexScaleHolder = svg.newSvg("flex-scale-waterfall")

  let hoverOverlayHolder = svg.newG("hover-overlays")
  let overlayHolder = svg.newG("overlays")
  let bgStripesHolder = svg.newG("bg-stripes")

  let clipPathEl = svg.newEl("clipPath", {
    "id": "titleClipPath"
  }) as SVGClipPathElement
  clipPathEl.appendChild(svg.newEl("rect", {
    "width": leftFixedWidth,
    "height": "100%"
  }))

  leftFixedHolder.appendChild(clipPathEl)

  let hoverEl = createAlignmentLines(diagramHeight)
  hoverOverlayHolder.appendChild(hoverEl.startline)
  hoverOverlayHolder.appendChild(hoverEl.endline)
  let mouseListeners = makeHoverEvtListeners(hoverEl)


  //Start appending SVG elements to the holder element (timeLineHolder)

  flexScaleHolder.appendChild(createTimeScale(data.durationMs, diagramHeight))
  flexScaleHolder.appendChild(createMarks(data.marks, unit, diagramHeight))

  data.lines.forEach((block, i) => {
    timeLineHolder.appendChild(createBgRect(block, unit, diagramHeight))
  })

  //Main loop to render rows with blocks

  barsToShow.forEach((block, i) => {
    const blockWidth = block.total || 1
    const y = requestBarHeight * i
    const x = (block.start || 0.001)

    const rectData = {
      "width": blockWidth,
      "height": requestBarHeight,
      "x": x,
      "y": y,
      "cssClass": block.cssClass,
      "label": block.name + " (" + block.start + "ms - " + block.end + "ms | total: " + block.total + "ms)",
      "unit": unit,
      "showOverlay": mouseListeners.onMouseEnterPartial,
      "hideOverlay": mouseListeners.onMouseLeavePartial
    } as RectData

    let rect = createRect(rectData, block.segments)
    let shortLabel = createRequestLabelClipped(25, y, ressourceUrlFormater(block.name), requestBarHeight, "clipPath")
    let fullLabel = createRequestLabelFull(25, y, block.name, requestBarHeight)

    let infoOverlay = createRowInfoOverlay(i+1, x, y + requestBarHeight, block, unit)

    let showOverlay = (evt) => {
      dom.removeAllChildren(overlayHolder)
      overlayHolder.appendChild(infoOverlay)
    }
    let rowFixed = createFixedRow(y, requestBarHeight, showOverlay, leftFixedWidth)
    let rowFlex = createFlexRow(y, requestBarHeight, showOverlay)

    //create and attach request block
    rowFlex.appendChild(rect)

    //TODO: Add indicators / Warnings
    const isSecure = block.name.indexOf("https://") === 0
    if (isSecure) {
      rowFixed.appendChild(icons.lock(5, y + 3, "Secure Connection", 1.2))
    }

    fullLabel.style.visibility = "hidden"
    rowFixed.appendChild(shortLabel)
    rowFixed.appendChild(fullLabel)
    rowFixed.addEventListener("mouseenter", () => {
      fullLabel.style.visibility = "visible"
      shortLabel.style.visibility = "hidden"
    })
    rowFixed.addEventListener("mouseleave", () => {
      shortLabel.style.visibility = "visible"
      fullLabel.style.visibility = "hidden"
      let bg = fullLabel.getElementsByClassName("label-full-bg")[0] as SVGRectElement
      bg.style.width = ((fullLabel.getElementsByTagName("text")[0] as SVGTextElement).clientWidth + 10).toString()
    })

    flexScaleHolder.appendChild(rowFlex)
    leftFixedHolder.appendChild(rowFixed)
    bgStripesHolder.appendChild(createBgStripe(y, requestBarHeight, leftFixedWidth, (i % 2 === 0)))
  })
  
  flexScaleHolder.appendChild(hoverOverlayHolder)

  timeLineHolder.appendChild(bgStripesHolder)
  timeLineHolder.appendChild(flexScaleHolder)
  timeLineHolder.appendChild(leftFixedHolder)
  timeLineHolder.appendChild(overlayHolder)

  return timeLineHolder
}

import TimeBlock from "../typing/time-block"
import {WaterfallData} from "../typing/waterfall-data"
import svg from "../helpers/svg"
import icons from "../helpers/icons"
import {
  RectData,
  createRect,
  createRequestLabel,
  createBgRect,
  createTimeScale,
  createMarks,
  makeHoverEvtListeners,
  createAlignmentLines,
  createBgStripe
} from "./svg-components"
import {createRowInfoOverlay} from "./svg-details-overlay"
import dom from '../helpers/dom'



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
  const requestBarHeight: number = 21

  const barsToShow = data.blocks
    .filter((block) => (typeof block.start == "number" && typeof block.total == "number"))
    .sort((a, b) => (a.start || 0) - (b.start || 0))

  /** height of the requests part of the diagram in px */
  const diagramHeight = (barsToShow.length + 1) * requestBarHeight

  /** full height of the SVG chart in px */
  const chartHolderHeight = getSvgHeight(data.marks, barsToShow, diagramHeight)

  //Main holder
  let timeLineHolder = svg.newEl("svg:svg", {
    "height": Math.floor(chartHolderHeight),
    "class": "water-fall-chart"
  }) as SVGSVGElement

  let leftFixedHolder = svg.newEl("svg", {
    "class": "left-fixed-holder",
    "x" : "-70",
    "width" : "70"
  }) as SVGSVGElement

  let flexScaleHolder = svg.newEl("svg", {
    "class": "flex-scale-waterfall"
  }) as SVGSVGElement

  let hoverOverlayHolder = svg.newEl("g", {
    "class": "hover-overlays"
  }) as SVGGElement

  let overlayHolder = svg.newEl("g", {
    "class": "overlays"
  }) as SVGGElement

  let bgStripesHolder = svg.newEl("g", {
    "class": "bg-stripes"
  }) as SVGGElement


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
    let blockWidth = block.total || 1
    let y = requestBarHeight * i
    let x = (block.start || 0.001)

    let row = svg.newEl("g", {
      "class": "row"
    }) as SVGGElement

    let rectData = {
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
    let label = createRequestLabel(block, blockWidth, y, unit)

    let infoOverlay = createRowInfoOverlay(i+1, x, y + requestBarHeight, block, unit)
    rect.addEventListener('click', (evt) => {
      dom.removeAllChildren(overlayHolder)
      overlayHolder.appendChild(infoOverlay)
    })

    //create and attach request block
    row.appendChild(rect)
    row.appendChild(label)


    //TODO: Add indicators / Warnings
    const isSecure = block.name.indexOf("https://") === 0
    if (isSecure) {
       leftFixedHolder.appendChild(icons.lock(5, y+3, "Secure Connection", 1.2))
    }

    flexScaleHolder.appendChild(row)
    bgStripesHolder.appendChild(createBgStripe(y, requestBarHeight, (i%2 === 0)))
  })

  flexScaleHolder.appendChild(hoverOverlayHolder)
  timeLineHolder.appendChild(bgStripesHolder)
  timeLineHolder.appendChild(leftFixedHolder)
  timeLineHolder.appendChild(flexScaleHolder)
  timeLineHolder.appendChild(overlayHolder)


  return timeLineHolder
}

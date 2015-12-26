import TimeBlock from "../typing/time-block"
import {WaterfallData} from "../typing/waterfall-data"
import svg from "../helpers/svg"
import dom from "../helpers/dom"
import {
  RectData,
  createRect,
  createRequestLabel,
  createBgRect,
  createTimeWrapper,
  renderMarks,
  makeHoverEvtListener
} from "./svg-components"



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

  const barsToShow = data.blocks
    .filter((block) => (typeof block.start == "number" && typeof block.total == "number"))
    .sort((a, b) => (a.start || 0) - (b.start || 0))

  /** height of the requests part of the diagram in px */
  const diagramHeight = (barsToShow.length + 1) * 25

  /** full height of the SVG chart in px */
  const chartHolderHeight = getSvgHeight(data.marks, barsToShow, diagramHeight)

  //Main holder
  let timeLineHolder = svg.newEl("svg:svg", {
    height: Math.floor(chartHolderHeight),
    class: "water-fall-chart"
  }) as SVGSVGElement


  let timeLineLabelHolder = svg.newEl("g", {
    class: "labels"
  }) as SVGGElement

  let mouseListeners = makeHoverEvtListener(diagramHeight)


  //Start appending SVG elements to the holder element (timeLineHolder)

  timeLineHolder.appendChild(createTimeWrapper(data.durationMs, diagramHeight))
  timeLineHolder.appendChild(renderMarks(data.marks, unit, diagramHeight))

  data.lines.forEach((block, i) => {
    timeLineHolder.appendChild(createBgRect(block, unit, diagramHeight))
  })

  //Main loop to render blocks

  barsToShow.forEach((block, i) => {
    let blockWidth = block.total || 1
    let y = 25 * i

    let rectData = {
      width: blockWidth,
      height: 25,
      x: block.start || 0.001,
      y: y,
      cssClass: block.cssClass,
      label: block.name + " (" + block.start + "ms - " + block.end + "ms | total: " + block.total + "ms)",
      unit: unit,
      onRectMouseEnter: mouseListeners.onRectMouseEnter,
      onRectMouseLeave: mouseListeners.onRectMouseLeave
    } as RectData

    //create and attach request block
    timeLineHolder.appendChild(createRect(rectData, block.segments))

    //create and attach request label
    timeLineLabelHolder.appendChild(createRequestLabel(block, blockWidth, y, unit))
  })

  timeLineHolder.appendChild(timeLineLabelHolder)

  return timeLineHolder
}

import {WaterfallData} from "../typing/waterfall-data.d"
import {RectData} from "../typing/rect-data.d"
import {ChartOptions} from "../typing/options.d"
import TimeBlock from "../typing/time-block"
import * as svg from "../helpers/svg"
import {
  createBgRect,
  createTimeScale,
  createMarks,
  makeHoverEvtListeners,
  createAlignmentLines
} from "./svg-general-components"
import {createRow} from "./row/svg-row"
import {getIndicators} from "./row/svg-indicators"
import * as overlayManager from "./details-overlay/svg-details-overlay-manager"
import * as overlayChangesPubSub from "./details-overlay/overlay-changes-pub-sub"


/**
 * Calculate the height of the SVG chart in px
 * @param {any[]}       marks      [description]
 * @param {TimeBlock[]} barsToShow [description]
 * @param  {number} diagramHeight
 * @returns Number
 */
function getSvgHeight(marks: any[], barsToShow: TimeBlock[], diagramHeight: number): number {
  const maxMarkTextLength = marks.reduce((currMax: number, currValue: TimeBlock) => {
    return Math.max(currMax, svg.getNodeTextWidth(svg.newTextEl(currValue.name, 0)))
  }, 0)

  return Math.floor(diagramHeight + maxMarkTextLength + 35)
}

/**
 * Entry point to start rendering the full waterfall SVG
 * @param {WaterfallData} data  Object containing the setup parameter
 * @param {options} ChartOptions   Config options
 * @return {SVGSVGElement}            SVG Element ready to render
 */
export function createWaterfallSvg(data: WaterfallData, options: ChartOptions): SVGSVGElement {
  let requestBarHeight = options.rowHeight
  //constants

  /** Width of bar on left in percentage */
  const leftFixedWidthPerc: number = 25
  /** horizontal unit (duration in ms of 1%) */
  const unit: number = data.durationMs / 100
  const barsToShow = data.blocks
    .filter((block) => (typeof block.start === "number" && typeof block.total === "number"))
    .sort((a, b) => (a.start || 0) - (b.start || 0))
  const docIsSsl = (data.blocks[0].name.indexOf("https://") === 0)
  /** height of the requests part of the diagram in px */
  const diagramHeight = (barsToShow.length + 1) * requestBarHeight
  /** full height of the SVG chart in px */
  const chartHolderHeight = getSvgHeight(data.marks, barsToShow, diagramHeight)

  /** Main SVG Element that holds all data */
  let timeLineHolder = svg.newSvg("water-fall-chart", {
    "height": chartHolderHeight
  })
  /** Holder for on-hover vertical comparison bars */
  let hoverOverlayHolder = svg.newG("hover-overlays")
  /** Holder of request-details overlay */
  let overlayHolder = svg.newG("overlays")
  /** Holder for scale, event and marks */
  let scaleAndMarksHolder = svg.newSvg("scale-and-marks-holder", {
    "x": `${leftFixedWidthPerc}%`,
    "width": `${100 - leftFixedWidthPerc}%`
  })
  /** Holds all rows */
  let rowHolder = svg.newG("rows-holder")


  let hoverEl = createAlignmentLines(diagramHeight)
  hoverOverlayHolder.appendChild(hoverEl.startline)
  hoverOverlayHolder.appendChild(hoverEl.endline)
  let mouseListeners = makeHoverEvtListeners(hoverEl)


  //Start appending SVG elements to the holder element (timeLineHolder)

  scaleAndMarksHolder.appendChild(createTimeScale(data.durationMs, diagramHeight))
  scaleAndMarksHolder.appendChild(createMarks(data.marks, unit, diagramHeight))

  data.lines.forEach((block, i) => {
    timeLineHolder.appendChild(createBgRect(block, unit, diagramHeight))
  })

  //calculate x position for label based on number of icons
  const labelXPos = barsToShow.reduce((prev: number, curr: TimeBlock) => {
    const i = getIndicators(curr, docIsSsl)
    const lastIndicator = i[i.length - 1]
    const x = (!!lastIndicator ? (lastIndicator.x + lastIndicator.x / Math.max(i.length - 1, 1)) : 0)
    return Math.max(prev, x)
  }, 5)

  let barEls: SVGGElement[] = []

  function getChartHeight(): string {
    return (chartHolderHeight + overlayManager.getCombinedOverlayHeight()).toString() + "px"
  }
  overlayChangesPubSub.subscribeToOvelayChanges((evt) => {
    timeLineHolder.style.height = getChartHeight()
  })

  /** Renders single row and hooks up behaviour */
  function renderRow(block: TimeBlock, i: number) {
    const blockWidth = block.total || 1
    const y = requestBarHeight * i
    const x = (block.start || 0.001)
    const accordeonHeight = 450

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

    let showDetailsOverlay = (evt) => {
      overlayManager.openOverlay(i, x, y + requestBarHeight, accordeonHeight, block, overlayHolder, barEls, unit)
    }

    let rowItem = createRow(i, rectData, block, labelXPos,
      leftFixedWidthPerc, docIsSsl,
      showDetailsOverlay)

    barEls.push(rowItem)
    rowHolder.appendChild(rowItem)
  }

  //Main loop to render rows with blocks
  barsToShow.forEach(renderRow)

  scaleAndMarksHolder.appendChild(hoverOverlayHolder)
  timeLineHolder.appendChild(scaleAndMarksHolder)
  timeLineHolder.appendChild(rowHolder)
  timeLineHolder.appendChild(overlayHolder)

  return timeLineHolder
}

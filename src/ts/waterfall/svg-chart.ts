import {WaterfallData} from "../typing/waterfall-data.d"
import {RectData} from "../typing/rect-data.d"
import TimeBlock from "../typing/time-block"

import * as svg from "../helpers/svg"
import * as generalComponents from "./sub-components/svg-general-components"
import * as alignmentHelper from  "./sub-components/svg-alignment-helper"
import * as marks from  "./sub-components/svg-marks"
import * as row from "./row/svg-row"
import * as indicators from "./row/svg-indicators"
import * as overlayManager from "./details-overlay/svg-details-overlay-manager"
import * as overlayChangesPubSub from "./details-overlay/overlay-changes-pub-sub"
import * as globalStateService from "../state/global-state"

/**
 * Calculate the height of the SVG chart in px
 * @param {any[]}       marks      [description]
 * @param {TimeBlock[]} barsToShow [description]
 * @param  {number} diagramHeight
 * @returns Number
 */
function getSvgHeight(marks: any[], barsToShow: TimeBlock[], diagramHeight: number): number {
  const maxMarkTextLength = marks.reduce((currMax: number, currValue: TimeBlock) => {
    return Math.max(currMax, svg.getNodeTextWidth(svg.newTextEl(currValue.name, 0), true))
  }, 0)

  return Math.floor(diagramHeight + maxMarkTextLength + 35)
}



/**
 * Entry point to start rendering the full waterfall SVG
 * @param {WaterfallData} data  Object containing the setup parameter
 * @return {SVGSVGElement}            SVG Element ready to render
 */
export function createWaterfallSvg(data: WaterfallData): SVGSVGElement {
  const options = globalStateService.getOptions()

  //constants

  /** horizontal unit (duration in ms of 1%) */
  const unit: number = data.durationMs / 100
  const barsToShow = data.blocks
    .filter((block) => (typeof block.start === "number" && typeof block.total === "number"))
    .sort((a, b) => (a.start || 0) - (b.start || 0))
  const docIsSsl = (data.blocks[0].name.indexOf("https://") === 0)
  /** height of the requests part of the diagram in px */
  const diagramHeight = (barsToShow.length + 1) * options.rowHeight
  /** full height of the SVG chart in px */
  const chartHolderHeight = getSvgHeight(data.marks, barsToShow, diagramHeight)

  /** Main SVG Element that holds all data */
  let timeLineHolder = svg.newSvg("water-fall-chart", {
    "height": chartHolderHeight
  })

  /** Holder of request-details overlay */
  let overlayHolder = svg.newG("overlays")
  /** Holder for scale, event and marks */
  let scaleAndMarksHolder = svg.newSvg("scale-and-marks-holder", {
    "x": `${options.leftColumnWith}%`,
    "width": `${100 - options.leftColumnWith}%`
  })
  /** Holds all rows */
  let rowHolder = svg.newG("rows-holder")

  /** Holder for on-hover vertical comparison bars */
  let hoverOverlayHolder
  let mouseListeners
  if (options.showAlignmentHelpers) {
    hoverOverlayHolder = svg.newG("hover-overlays")
    let hoverEl = alignmentHelper.createAlignmentLines(diagramHeight)
    hoverOverlayHolder.appendChild(hoverEl.startline)
    hoverOverlayHolder.appendChild(hoverEl.endline)
    mouseListeners = alignmentHelper.makeHoverEvtListeners(hoverEl)
  }

  //Start appending SVG elements to the holder element (timeLineHolder)

  scaleAndMarksHolder.appendChild(generalComponents.createTimeScale(data.durationMs, diagramHeight))
  scaleAndMarksHolder.appendChild(marks.createMarks(data.marks, unit, diagramHeight))

  data.lines.forEach((block, i) => {
    timeLineHolder.appendChild(generalComponents.createBgRect(block, unit, diagramHeight))
  })

  let labelXPos = 5;

  // This assumes all icons (mime and indicators) have the same width
  const iconWidth = indicators.getMimeTypeIcon(barsToShow[0]).width

  if (options.showMimeTypeIcon) {
    labelXPos += iconWidth
  }

  if (options.showIndicatorIcons) {
    const iconsPerBlock = barsToShow.map((block: TimeBlock) => indicators.getIndicatorIcons(block, docIsSsl).length)
    labelXPos += iconWidth * Math.max.apply(null, iconsPerBlock)
  }

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
    const y = options.rowHeight * i
    const x = (block.start || 0.001)
    const accordeonHeight = 450
    const rectData = {
      "width": blockWidth,
      "height": options.rowHeight,
      "x": x,
      "y": y,
      "cssClass": block.cssClass,
      "label": block.name + " (" + block.start + "ms - " + block.end + "ms | total: " + block.total + "ms)",
      "unit": unit,
      "showOverlay": options.showAlignmentHelpers ? mouseListeners.onMouseEnterPartial : undefined,
      "hideOverlay": options.showAlignmentHelpers ? mouseListeners.onMouseLeavePartial : undefined
    } as RectData

    let showDetailsOverlay = (evt) => {
      overlayManager.openOverlay(i, x, y + options.rowHeight, accordeonHeight, block, overlayHolder, barEls, unit)
    }

    let rowItem = row.createRow(i, rectData, block, labelXPos,
      options, docIsSsl, showDetailsOverlay)

    barEls.push(rowItem)
    rowHolder.appendChild(rowItem)
  }

  //Main loop to render rows with blocks
  barsToShow.forEach(renderRow)

  if (options.showAlignmentHelpers) {
    scaleAndMarksHolder.appendChild(hoverOverlayHolder)
  }
  timeLineHolder.appendChild(scaleAndMarksHolder)
  timeLineHolder.appendChild(rowHolder)
  timeLineHolder.appendChild(overlayHolder)

  return timeLineHolder
}

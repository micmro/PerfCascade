/**
 * Creation of sub-components of the waterfall chart
 */

import { OverlayChangeEvent } from "../../typing/open-overlay.d"
import TimeBlock from "../../typing/time-block"
import * as svg from "../../helpers/svg"
import * as overlayChangesPubSub from "../details-overlay/overlay-changes-pub-sub"

/**
 * Renders a per-second marker line and appends it to `timeHolder`
 *
 * @param  {SVGGElement} timeHolder element that the second marker is appended to
 * @param  {number} diagramHeight  Full height of SVG in px
 * @param  {number} secsTotal  total number of seconds in the timeline
 * @param  {number} sec second of the time marker to render
 * @param  {boolean} addLabel  if true a time label is added to the marker-line
 */
let appendSecond = function (timeHolder: SVGGElement, diagramHeight: number, secsTotal: number, sec: number, addLabel: boolean = false) {
  const secPerc = 100 / secsTotal
  /** just used if `addLabel` is `true` - for full seconds */
  let lineLabel
  let lineClass = "sub-second-line"

  if (addLabel) {
    lineClass = "second-line"
    lineLabel = svg.newTextEl(sec + "s", diagramHeight)
    if (sec > secsTotal - 0.2) {
      lineLabel.setAttribute("x", secPerc * sec - 0.5 + "%")
      lineLabel.setAttribute("text-anchor", "end")
    } else {
      lineLabel.setAttribute("x", secPerc * sec + 0.5 + "%")
    }
  }

  const lineEl = svg.newLine({
    "class": lineClass,
    "x1": secPerc * sec + "%",
    "y1": "0",
    "x2": secPerc * sec + "%",
    "y2": diagramHeight
  })

  overlayChangesPubSub.subscribeToOverlayChanges((change: OverlayChangeEvent) => {
    let offset = change.combinedOverlayHeight
    //figure out why there is an offset
    let scale = (diagramHeight + offset) / (diagramHeight)

    lineEl.setAttribute("transform", `scale(1, ${scale})`)
    if (addLabel) {
      lineLabel.setAttribute("transform", `translate(0, ${offset})`)
    }
  })

  timeHolder.appendChild(lineEl)
  if (addLabel) {
    timeHolder.appendChild(lineLabel)
  }
}


/**
 * Renders the time-scale SVG elements (1sec, 2sec...)
 * @param {number} durationMs    Full duration of the waterfall
 * @param {number} diagramHeight Full height of SVG in px
 * @param {number} subSecondStepMs  Distant (time in ms) between sub-second time-scales
 */
export function createTimeScale(durationMs: number, diagramHeight: number, subSecondStepMs = 200): SVGGElement {
  let timeHolder = svg.newG("time-scale full-width")
  /** steps between each second marker */
  const subSecondSteps = 1000 / subSecondStepMs
  const secs = durationMs / 1000
  const steps = durationMs / subSecondStepMs

  for (let i = 0; i <= steps; i++) {
    const isFullSec = i % subSecondSteps === 0
    const secValue = i / subSecondSteps

    appendSecond(timeHolder, diagramHeight, secs, secValue, isFullSec)
  }
  return timeHolder
}



//TODO: Implement - data for this not parsed yet
export function createBgRect(block: TimeBlock, unit: number, diagramHeight: number): SVGRectElement {
  let rect = svg.newRect({
    "width": ((block.total || 1) / unit) + "%",
    "height": diagramHeight,
    "x": ((block.start || 0.001) / unit) + "%",
    "y": 0,
    "class": block.cssClass || "block-other"
  })

  rect.appendChild(svg.newEl("title", {
    "text": block.name
  })) // Add tile to wedge path

  return rect
}

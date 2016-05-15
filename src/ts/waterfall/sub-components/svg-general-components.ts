/**
 * Creation of sub-components of the waterfall chart
 */

import {OverlayChangeEvent} from "../../typing/open-overlay.d"
import TimeBlock from "../../typing/time-block"
import * as svg from "../../helpers/svg"
import * as overlayChangesPubSub from "../details-overlay/overlay-changes-pub-sub"


/**
 * Renders the time-scale SVG elements (1sec, 2sec...)
 * @param {number} durationMs    Full duration of the waterfall
 * @param {number} diagramHeight Full height of SVG in px
 */
export function createTimeScale(durationMs: number, diagramHeight: number): SVGGElement {
  let timeHolder = svg.newEl("g", { class: "time-scale full-width" }) as SVGGElement
  for (let i = 0, secs = durationMs / 1000, secPerc = 100 / secs; i <= secs; i++) {
    ((i, secs, secPerc) => {
      const lineLabel = svg.newTextEl(i + "sec", diagramHeight)
      if (i > secs - 0.2) {
        lineLabel.setAttribute("x", secPerc * i - 0.5 + "%")
        lineLabel.setAttribute("text-anchor", "end")
      } else {
        lineLabel.setAttribute("x", secPerc * i + 0.5 + "%")
      }

      const lineEl = svg.newEl("line", {
        "x1": secPerc * i + "%",
        "y1": "0",
        "x2": secPerc * i + "%",
        "y2": diagramHeight
      })

      overlayChangesPubSub.subscribeToOvelayChanges((change: OverlayChangeEvent) => {
        let offset = change.combinedOverlayHeight
        //figure out why there is an offset
        let scale = (diagramHeight + offset) / (diagramHeight)

        lineEl.setAttribute("transform", `scale(1, ${scale})`)
        lineLabel.setAttribute("transform", `translate(0, ${offset})`)
      })

      timeHolder.appendChild(lineEl)
      timeHolder.appendChild(lineLabel)
    })(i, secs, secPerc)
  }
  return timeHolder
}



//TODO: Implement - data for this not parsed yet
export function createBgRect(block: TimeBlock, unit: number, diagramHeight: number): SVGRectElement {
  let rect = svg.newEl("rect", {
    "width": ((block.total || 1) / unit) + "%",
    "height": diagramHeight,
    "x": ((block.start || 0.001) / unit) + "%",
    "y": 0,
    "class": block.cssClass || "block-other"
  }) as SVGRectElement

  rect.appendChild(svg.newEl("title", {
    "text": block.name
  })) // Add tile to wedge path

  return rect
}




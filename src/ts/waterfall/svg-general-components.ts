/**
 * Creation of sub-components of the waterfall chart
 */

import * as svg from "../helpers/svg"
import TimeBlock from "../typing/time-block"
import {Mark} from "../typing/waterfall-data"
import * as overlayChangesPubSub from "./details-overlay/overlay-changes-pub-sub"
import {OverlayChangeEvent} from "../typing/open-overlay"


export interface HoverElements {
  endline: SVGLineElement,
  startline: SVGLineElement
}

/**
 * Creates verticale alignment bars
 * @param {number} diagramHeight  height of the requests part of the diagram in px
 */
export function createAlignmentLines(diagramHeight: number): HoverElements {
  return {
    endline: svg.newEl("line", {
      "x1": "0",
      "y1": "0",
      "x2": "0",
      "y2": diagramHeight,
      "class": "line-end"
    }) as SVGLineElement,

    startline: svg.newEl("line", {
      "x1": "0",
      "y1": "0",
      "x2": "0",
      "y2": diagramHeight,
      "class": "line-start"
    }) as SVGLineElement
  }
}



/**
 * Partially appliable Eventlisteners for verticale alignment bars to be shown on hover
 * @param {HoverElements} hoverEl  verticale alignment bars SVG Elements
 */
export function makeHoverEvtListeners(hoverEl: HoverElements) {
  return {
    onMouseEnterPartial: function () {
      return function (evt: MouseEvent) {
        const targetRect = evt.target as SVGRectElement
        svg.addClass(targetRect, "active")

        const xPosEnd = targetRect.x.baseVal.valueInSpecifiedUnits +
          targetRect.width.baseVal.valueInSpecifiedUnits + "%"
        const xPosStart = targetRect.x.baseVal.valueInSpecifiedUnits + "%"

        hoverEl.endline.x1.baseVal.valueAsString = xPosEnd
        hoverEl.endline.x2.baseVal.valueAsString = xPosEnd
        hoverEl.startline.x1.baseVal.valueAsString = xPosStart
        hoverEl.startline.x2.baseVal.valueAsString = xPosStart
        svg.addClass(hoverEl.endline, "active")
        svg.addClass(hoverEl.startline, "active")
      }
    },
    onMouseLeavePartial: function () {
      return function (evt: MouseEvent) {
        const targetRect = evt.target as SVGRectElement
        svg.removeClass(targetRect, "active")
        svg.removeClass(hoverEl.endline, "active")
        svg.removeClass(hoverEl.startline, "active")
      }
    }
  }
}



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



/**
 * Renders global markes for events like the onLoad event etc
 * @param {Array<Mark>} marks         [description]
 * @param {number}      unit          horizontal unit (duration in ms of 1%)
 * @param {number}      diagramHeight Full height of SVG in px
 */
export function createMarks(marks: Array<Mark>, unit: number, diagramHeight: number) {
  let marksHolder = svg.newEl("g", {
    "transform": "scale(1, 1)",
    "class": "marker-holder"
  })

  marks.forEach((mark, i) => {
    let x = mark.startTime / unit
    let markHolder = svg.newEl("g", {
      "class": "mark-holder type-" + mark.name.toLowerCase()
    })
    let lineHolder = svg.newEl("g", {
      "class": "line-holder"
    })
    let lineLabelHolder = svg.newEl("g", {
      "class": "line-label-holder",
      "x": x + "%"
    })
    mark.x = x
    let lineLabel = svg.newTextEl(mark.name, diagramHeight + 25)
    //lineLabel.setAttribute("writing-mode", "tb")
    lineLabel.setAttribute("x", x + "%")
    lineLabel.setAttribute("stroke", "")

    let line = svg.newEl("line", {
      "x1": x + "%",
      "y1": 0,
      "x2": x + "%",
      "y2": diagramHeight
    }) as SVGLineElement

    const lastMark = marks[i - 1]
    if (lastMark && mark.x - lastMark.x < 1) {
      lineLabel.setAttribute("x", lastMark.x + 1 + "%")
      mark.x = lastMark.x + 1
    }
    //would use polyline but can't use percentage for points
    let lineConnection = svg.newEl("line", {
      "x1": x + "%",
      "y1": diagramHeight,
      "x2": mark.x + "%",
      "y2": diagramHeight + 23
    })
    lineHolder.appendChild(line)
    lineHolder.appendChild(lineConnection)

    overlayChangesPubSub.subscribeToOvelayChanges((change: OverlayChangeEvent) => {
      let offset = change.combinedOverlayHeight
      let scale = (diagramHeight + offset) / (diagramHeight)

      line.setAttribute("transform", `scale(1, ${scale})`)
      lineLabelHolder.setAttribute("transform", `translate(0, ${offset})`)
      lineConnection.setAttribute("transform", `translate(0, ${offset})`)
    })


    let isActive = false
    let onLableMouseEnter = function (evt) {
      if (!isActive) {
        isActive = true
        svg.addClass(lineHolder, "active")
        //firefox has issues with this
        markHolder.parentNode.appendChild(markHolder)
      }
    }

    let onLableMouseLeave = function (evt) {
      isActive = false
      svg.removeClass(lineHolder, "active")
    }


    lineLabel.addEventListener("mouseenter", onLableMouseEnter)
    lineLabel.addEventListener("mouseleave", onLableMouseLeave)
    lineLabelHolder.appendChild(lineLabel)

    markHolder.appendChild(svg.newEl("title", {
      "text": mark.name + " (" + Math.round(mark.startTime) + "ms)"
    }))
    markHolder.appendChild(lineHolder)
    markHolder.appendChild(lineLabelHolder)
    marksHolder.appendChild(markHolder)
  })

  return marksHolder
}

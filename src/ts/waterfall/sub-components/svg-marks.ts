import {Mark} from "../../typing/waterfall-data.d"
import {OverlayChangeEvent} from "../../typing/open-overlay.d"

import * as svg from "../../helpers/svg"
import * as overlayChangesPubSub from "../details-overlay/overlay-changes-pub-sub"


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

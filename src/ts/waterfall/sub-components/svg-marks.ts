import {roundNumber} from "../../helpers/misc";
import * as svg from "../../helpers/svg"
import {OverlayChangeEvent} from "../../typing/open-overlay"
import {Mark} from "../../typing/waterfall"
import * as overlayChangesPubSub from "../details-overlay/overlay-changes-pub-sub"

/**
 * Renders global marks for events like the onLoad event etc
 * @param {Mark[]} marks         [description]
 * @param {number}      unit          horizontal unit (duration in ms of 1%)
 * @param {number}      diagramHeight Full height of SVG in px
 */
export function createMarks(marks: Mark[], unit: number, diagramHeight: number) {
  let marksHolder = svg.newG("marker-holder", {
    "transform": "scale(1, 1)"
  })

  marks.forEach((mark, i) => {
    let x = roundNumber(mark.startTime / unit)
    let markHolder = svg.newG("mark-holder type-" + mark.name.toLowerCase())
    let lineHolder = svg.newG("line-holder")
    let lineLabelHolder = svg.newG("line-label-holder", {
      "x": x + "%"
    })
    mark.x = x
    let lineLabel = svg.newTextEl(mark.name, x + "%", diagramHeight + 25)

    let line = svg.newLine({
      "x1": x + "%",
      "y1": 0,
      "x2": x + "%",
      "y2": diagramHeight
    })

    const lastMark = marks[i - 1]
    if (lastMark && mark.x - lastMark.x < 1) {
      lineLabel.setAttribute("x", lastMark.x + 1 + "%")
      mark.x = lastMark.x + 1
    }
    // would use polyline but can't use percentage for points
    let lineConnection = svg.newLine({
      "x1": x + "%",
      "y1": diagramHeight,
      "x2": mark.x + "%",
      "y2": diagramHeight + 23
    })
    lineHolder.appendChild(line)
    lineHolder.appendChild(lineConnection)

    overlayChangesPubSub.subscribeToOverlayChanges((change: OverlayChangeEvent) => {
      let offset = change.combinedOverlayHeight
      let scale = (diagramHeight + offset) / (diagramHeight)

      line.setAttribute("transform", `scale(1, ${scale})`)
      lineLabelHolder.setAttribute("transform", `translate(0, ${offset})`)
      lineConnection.setAttribute("transform", `translate(0, ${offset})`)
    })

    let isActive = false
    let onLabelMouseEnter = () => {
      if (!isActive) {
        isActive = true
        svg.addClass(lineHolder, "active")
        // firefox has issues with this
        markHolder.parentNode.appendChild(markHolder)
      }
    }

    let onLabelMouseLeave = () => {
      isActive = false
      svg.removeClass(lineHolder, "active")
    }

    lineLabel.addEventListener("mouseenter", onLabelMouseEnter)
    lineLabel.addEventListener("mouseleave", onLabelMouseLeave)
    lineLabelHolder.appendChild(lineLabel)

    markHolder.appendChild(svg.newTitle(mark.name + " (" + Math.round(mark.startTime) + "ms)"))
    markHolder.appendChild(lineHolder)
    markHolder.appendChild(lineLabelHolder)
    marksHolder.appendChild(markHolder)
  })

  return marksHolder
}

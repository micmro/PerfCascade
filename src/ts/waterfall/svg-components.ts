/**
 * Creation of sub-components of the waterfall chart
 */

import svg from "../helpers/svg"
import dom from "../helpers/dom"
import TimeBlock from "../typing/time-block"

/**
 * Interface for `createRect` parameter
 */
export interface RectData {
  width: number
  height: number
  x: number
  y: number
  cssClass: string
  label?: string
  unit: number
  onRectMouseEnter: EventListener
  onRectMouseLeave: EventListener
}


/**
 * Eventlisteners for verticale alignment bars to be shown on hover
 * @param {number} diagramHeight  height of the requests part of the diagram in px
 */
export function makeHoverEvtListener(diagramHeight: number) {

  let endline = svg.newEl("line", {
    x1: "0",
    y1: "0",
    x2: "0",
    y2: diagramHeight,
    class: "line-end"
  }) as SVGLineElement

  let startline = svg.newEl("line", {
    x1: "0",
    y1: "0",
    x2: "0",
    y2: diagramHeight,
    class: "line-start"
  }) as SVGLineElement

  return {
    onRectMouseEnter: function(evt: MouseEvent) {
      let targetRect = evt.target as SVGRectElement
      dom.addClass(targetRect, "active")

      const xPosEnd = targetRect.x.baseVal.valueInSpecifiedUnits + 
        targetRect.width.baseVal.valueInSpecifiedUnits + "%"
      const xPosStart = targetRect.x.baseVal.valueInSpecifiedUnits + "%"

      endline.x1.baseVal.valueAsString = xPosEnd
      endline.x2.baseVal.valueAsString = xPosEnd
      startline.x1.baseVal.valueAsString = xPosStart
      startline.x2.baseVal.valueAsString = xPosStart
      dom.addClass(endline, "active")
      dom.addClass(startline, "active")

      targetRect.parentNode.appendChild(endline)
      targetRect.parentNode.appendChild(startline)
    },
    onRectMouseLeave: function(evt: MouseEvent) {
      dom.removeClass(evt.target as SVGRectElement, "active")
      dom.removeClass(endline, "active")
      dom.removeClass(startline, "active")
    }
  }
}



/**
 * Render the block and timings for a request
 * @param  {RectData}         rectData Basic dependencys and globals
 * @param  {Array<TimeBlock>} segments Request and Timing Data
 * @return {SVGElement}                Renerated SVG (rect or g element)
 */
export function createRect(rectData: RectData, segments?: Array<TimeBlock>): SVGElement {
  let rectHolder
  let rect = svg.newEl("rect", {
    width: (rectData.width / rectData.unit) + "%",
    height: rectData.height - 1,
    x: Math.round((rectData.x / rectData.unit) * 100) / 100 + "%",
    y: rectData.y,
    class: ((segments && segments.length > 0 ? "time-block" : "segment")) + " "
      + (rectData.cssClass || "block-other")
  })
  if (rectData.label) {
    rect.appendChild(svg.newEl("title", {
      text: rectData.label
    })) // Add tile to wedge path
  }

  rect.addEventListener("mouseenter", rectData.onRectMouseEnter)
  rect.addEventListener("mouseleave", rectData.onRectMouseLeave)

  if (segments && segments.length > 0) {
    rectHolder = svg.newEl("g")
    rectHolder.appendChild(rect)
    segments.forEach((segment) => {
      if (segment.total > 0 && typeof segment.start === "number") {
        let childRectData = {
          width: segment.total,
          height: 8,
          x: segment.start || 0.001,
          y: rectData.y,
          cssClass: segment.cssClass,
          label: segment.name + " (" + Math.round(segment.start) + "ms - " 
             + Math.round(segment.end) + "ms | total: " + Math.round(segment.total) + "ms)",
          unit: rectData.unit,
          onRectMouseEnter: rectData.onRectMouseEnter,
          onRectMouseLeave: rectData.onRectMouseLeave
        } as RectData
        rectHolder.appendChild(createRect(childRectData))
      }
    })
    return rectHolder
  } else {
    return rect
  }
}


/**
 * Create a new SVG Text element to label a request block
 * @param {TimeBlock} block      Asset Request
 * @param {number}    blockWidth Width of request block
 * @param {number}    y          vertical postion (in px)
 * @param {number}    unit       horizontal unit (duration in ms of 1%)
 */
export function createRequestLabel(block: TimeBlock, blockWidth: number, y: number, unit: number): SVGTextElement {
  //crop name if longer than 30 characters
  let clipName = (block.name.length > 30 && block.name.indexOf("?") > 0)
  let blockName = (clipName) ? block.name.split("?")[0] + "?…" : block.name
  
  let blockLabel = svg.newTextEl(blockName + " (" + Math.round(block.total) + "ms)", (y + (block.segments ? 20 : 17)))

  blockLabel.appendChild(svg.newEl("title", {
    text: block.name
  }))

  if (((block.total || 1) / unit) > 10 && svg.getNodeTextWidth(blockLabel) < 200) {
    //position label within block
    blockLabel.setAttribute("class", "inner-label")
    blockLabel.setAttribute("x", ((block.start || 0.001) / unit) + 0.5 + "%")
    blockLabel.setAttribute("width", (blockWidth / unit) + "%")
  } else if (((block.start || 0.001) / unit) + (blockWidth / unit) < 80) {
    //position label
    blockLabel.setAttribute("x", ((block.start || 0.001) / unit) + (blockWidth / unit) + 0.5 + "%")
  } else {
    blockLabel.setAttribute("x", (block.start || 0.001) / unit - 0.5 + "%")
    blockLabel.setAttribute("text-anchor", "end")
  }
  blockLabel.style.opacity = block.name.match(/js.map$/) ? "0.5" : "1"
  
  return blockLabel
}



/**
 * Renders the time-scale SVG elements (1sec, 2sec...)
 * @param {number} durationMs    Full duration of the waterfall
 * @param {number} diagramHeight Full height of SVG in px
 */
export function createTimeWrapper(durationMs: number, diagramHeight: number) {
  var timeHolder = svg.newEl("g", { class: "time-scale full-width" })
  for (let i = 0, secs = durationMs / 1000, secPerc = 100 / secs; i <= secs; i++) {
    var lineLabel = svg.newTextEl(i + "sec", diagramHeight)
    if (i > secs - 0.2) {
      lineLabel.setAttribute("x", secPerc * i - 0.5 + "%")
      lineLabel.setAttribute("text-anchor", "end")
    } else {
      lineLabel.setAttribute("x", secPerc * i + 0.5 + "%")
    }

    var lineEl = svg.newEl("line", {
      x1: secPerc * i + "%",
      y1: "0",
      x2: secPerc * i + "%",
      y2: diagramHeight
    })
    timeHolder.appendChild(lineEl)
    timeHolder.appendChild(lineLabel)
  }
  return timeHolder
}



//TODO: Implement - data for this not parsed yet
export function createBgRect(block: TimeBlock, unit: number, diagramHeight: number) {
  let rect = svg.newEl("rect", {
    width: ((block.total || 1) / unit) + "%",
    height: diagramHeight,
    x: ((block.start || 0.001) / unit) + "%",
    y: 0,
    class: block.cssClass || "block-other"
  })

  rect.appendChild(svg.newEl("title", {
    text: block.name
  })) // Add tile to wedge path
  return rect
}



//TODO: Implement - data for this not parsed yet
export function renderMarks(marks: Array<any>, unit: number, diagramHeight: number) {
  var marksHolder = svg.newEl("g", {
    transform: "scale(1, 1)",
    class: "marker-holder"
  })

  marks.forEach((mark, i) => {
    var x = mark.startTime / unit
    var markHolder = svg.newEl("g", {
      class: "mark-holder"
    })
    var lineHolder = svg.newEl("g", {
      class: "line-holder"
    })
    var lineLabelHolder = svg.newEl("g", {
      class: "line-label-holder",
      x: x + "%"
    })
    mark.x = x
    var lineLabel = svg.newTextEl(mark.name, diagramHeight + 25)
    //lineLabel.setAttribute("writing-mode", "tb")
    lineLabel.setAttribute("x", x + "%")
    lineLabel.setAttribute("stroke", "")


    lineHolder.appendChild(svg.newEl("line", {
      x1: x + "%",
      y1: 0,
      x2: x + "%",
      y2: diagramHeight
    }))

    if (marks[i - 1] && mark.x - marks[i - 1].x < 1) {
      lineLabel.setAttribute("x", marks[i - 1].x + 1 + "%")
      mark.x = marks[i - 1].x + 1
    }

    //would use polyline but can't use percentage for points 
    lineHolder.appendChild(svg.newEl("line", {
      x1: x + "%",
      y1: diagramHeight,
      x2: mark.x + "%",
      y2: diagramHeight + 23
    }))

    var isActive = false
    var onLableMouseEnter = function(evt) {
      if (!isActive) {
        isActive = true
        dom.addClass(lineHolder, "active")
        //firefox has issues with this
        markHolder.parentNode.appendChild(markHolder)
      }
    }

    var onLableMouseLeave = function(evt) {
      isActive = false
      dom.removeClass(lineHolder, "active")
    }

    lineLabel.addEventListener("mouseenter", onLableMouseEnter)
    lineLabel.addEventListener("mouseleave", onLableMouseLeave)
    lineLabelHolder.appendChild(lineLabel)

    markHolder.appendChild(svg.newEl("title", {
      text: mark.name + " (" + Math.round(mark.startTime) + "ms)",
    }))
    markHolder.appendChild(lineHolder)
    marksHolder.appendChild(markHolder)
    markHolder.appendChild(lineLabelHolder)
  })

  return marksHolder
}
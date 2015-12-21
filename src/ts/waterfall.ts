import TimeBlock from "./typing/time-block"
import {WaterfallData} from "./typing/waterfall-data"
import svg from "./helpers/svg"
import dom from "./helpers/dom"
import {
  RectData,
  createRect,
  createBgRect,
  createTimeWrapper,
  renderMarks
} from "./helpers/waterfall-componets"


/**
 * Entry point to start rendeing the full waterfall SVG
 * @param {WaterfallData} data Object containing the setup parameter
 * @return {SVGSVGElement}      SVG Element ready to render
 */
export function setupTimeLine(data: WaterfallData): SVGSVGElement {

  //constants
  const unit: number = data.durationMs / 100
  const barsToShow = data.blocks
    .filter((block) => (typeof block.start == "number" && typeof block.total == "number"))
    .sort((a, b) => (a.start || 0) - (b.start || 0))
  const maxMarkTextLength: number = (data.marks.length > 0 ? data.marks.reduce((currMax: number, currValue: TimeBlock) => {
      return Math.max(currMax, svg.getNodeTextWidth(svg.newTextEl(currValue.name, 0)))
    }, 0) : 0)
  const diagramHeight = (barsToShow.length + 1) * 25
  const chartHolderHeight = diagramHeight + maxMarkTextLength + 35

  //Main holder
  let timeLineHolder = svg.newEl("svg:svg", {
    height: Math.floor(chartHolderHeight),
    class: "water-fall-chart"
  }) as SVGSVGElement

  let timeLineLabelHolder = svg.newEl("g", { class: "labels" }) as SVGGElement



  //Setup of vertical-alignment-bars to show on hover

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

  let onRectMouseEnter = function(evt: MouseEvent) {
    let targetRect = evt.target as SVGRectElement
    dom.addClass(targetRect, "active")

    const xPosEnd = targetRect.x.baseVal.valueInSpecifiedUnits + targetRect.width.baseVal.valueInSpecifiedUnits + "%"
    const xPosStart = targetRect.x.baseVal.valueInSpecifiedUnits + "%"

    endline.x1.baseVal.valueAsString = xPosEnd
    endline.x2.baseVal.valueAsString = xPosEnd
    startline.x1.baseVal.valueAsString = xPosStart
    startline.x2.baseVal.valueAsString = xPosStart
    dom.addClass(endline, "active")
    dom.addClass(startline, "active")

    targetRect.parentNode.appendChild(endline)
    targetRect.parentNode.appendChild(startline)
  }

  let onRectMouseLeave = function(evt: MouseEvent) {
    dom.removeClass(evt.target as SVGRectElement, "active")
    dom.removeClass(endline, "active")
    dom.removeClass(startline, "active")
  }



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
      onRectMouseEnter: onRectMouseEnter,
      onRectMouseLeave: onRectMouseLeave
    } as RectData

    timeLineHolder.appendChild(createRect(rectData, block.segments))
    
    //crop name if longer than 30 characters
    let clipName = (block.name.length > 30 && block.name.indexOf("?") > 0)
    let blockName = (clipName) ? block.name.split("?")[0] + "?...." : block.name

    let blockLabel = svg.newTextEl(blockName + " (" + Math.round(block.total) + "ms)", (y + (block.segments ? 20 : 17)))
    blockLabel.appendChild(svg.newEl("title", {
      text: block.name
    }))

    if (((block.total || 1) / unit) > 10 && svg.getNodeTextWidth(blockLabel) < 200) {
      blockLabel.setAttribute("class", "inner-label")
      blockLabel.setAttribute("x", ((block.start || 0.001) / unit) + 0.5 + "%")
      blockLabel.setAttribute("width", (blockWidth / unit) + "%")
    } else if (((block.start || 0.001) / unit) + (blockWidth / unit) < 80) {
      blockLabel.setAttribute("x", ((block.start || 0.001) / unit) + (blockWidth / unit) + 0.5 + "%")
    } else {
      blockLabel.setAttribute("x", (block.start || 0.001) / unit - 0.5 + "%")
      blockLabel.setAttribute("text-anchor", "end")
    }
    blockLabel.style.opacity = block.name.match(/js.map$/) ? "0.5" : "1"
    timeLineLabelHolder.appendChild(blockLabel)
  })

  timeLineHolder.appendChild(timeLineLabelHolder)


  return timeLineHolder
}

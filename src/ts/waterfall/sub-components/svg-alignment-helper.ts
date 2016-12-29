/**
 * vertical alignment helper lines
 * */

import * as svg from "../../helpers/svg"


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
    endline: svg.newLine({
      "x1": "0",
      "y1": "0",
      "x2": "0",
      "y2": diagramHeight,
      "class": "line-end"
    }),

    startline: svg.newLine({
      "x1": "0",
      "y1": "0",
      "x2": "0",
      "y2": diagramHeight,
      "class": "line-start"
    })
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

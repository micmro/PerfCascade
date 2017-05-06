/**
 * vertical alignment helper lines
 */

import { addClass, removeClass } from "../../helpers/dom";
import * as svg from "../../helpers/svg";
import { HoverElements, HoverEvtListeners } from "../../typing/svg-alignment-helpers";

/**
 * Creates verticale alignment bars
 * @param {number} diagramHeight  height of the requests part of the diagram in px
 */
export function createAlignmentLines(diagramHeight: number): HoverElements {
  return {
    endline: svg.newLine({
      "x1": "0",
      "x2": "0",
      "y1": "0",
      "y2": diagramHeight,
    }, "line-end"),

    startline: svg.newLine({
      "x1": "0",
      "x2": "0",
      "y1": "0",
      "y2": diagramHeight,
    }, "line-start"),
  };
}

/**
 * Partially appliable Eventlisteners for verticale alignment bars to be shown on hover
 * @param {HoverElements} hoverEl  verticale alignment bars SVG Elements
 */
export function makeHoverEvtListeners(hoverEl: HoverElements): HoverEvtListeners {
  return {
    onMouseEnterPartial() {
      return (evt: MouseEvent) => {
        const targetRect = evt.target as SVGRectElement;
        addClass(targetRect, "active");

        const xPosEnd = targetRect.x.baseVal.valueInSpecifiedUnits +
          targetRect.width.baseVal.valueInSpecifiedUnits + "%";
        const xPosStart = targetRect.x.baseVal.valueInSpecifiedUnits + "%";

        hoverEl.endline.x1.baseVal.valueAsString = xPosEnd;
        hoverEl.endline.x2.baseVal.valueAsString = xPosEnd;
        hoverEl.startline.x1.baseVal.valueAsString = xPosStart;
        hoverEl.startline.x2.baseVal.valueAsString = xPosStart;
        addClass(hoverEl.endline, "active");
        addClass(hoverEl.startline, "active");
      };
    },
    onMouseLeavePartial() {
      return (evt: MouseEvent) => {
        const targetRect = evt.target as SVGRectElement;
        removeClass(targetRect, "active");
        removeClass(hoverEl.endline, "active");
        removeClass(hoverEl.startline, "active");
      };
    },
  };
}

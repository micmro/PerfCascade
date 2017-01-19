import { addClass, removeClass } from "../../helpers/dom";
import {roundNumber} from "../../helpers/misc";
import * as svg from "../../helpers/svg";
import {Context} from "../../typing/context";
import {OverlayChangeEvent} from "../../typing/open-overlay";
import {Mark} from "../../typing/waterfall";

/**
 * Renders global marks for events like the onLoad event etc
 * @param  {Context} context  Execution context object
 * @param {Mark[]} marks         [description]
 */
export function createMarks(context: Context, marks: Mark[]) {
  const diagramHeight = context.diagramHeight;
  let marksHolder = svg.newG("marker-holder", {
    "transform": "scale(1, 1)",
  });

  marks.forEach((mark, i) => {
    const x = roundNumber(mark.startTime / context.unit);
    let markHolder = svg.newG("mark-holder type-" + mark.name.toLowerCase());
    let lineHolder = svg.newG("line-holder");
    let lineLabelHolder = svg.newG("line-label-holder");
    let lineLabel = svg.newTextEl(mark.name, {x: x + "%", y: diagramHeight + 25});
    mark.x = x;

    let line = svg.newLine({
      "x1": x + "%",
      "x2": x + "%",
      "y1": 0,
      "y2": diagramHeight,
    });

    const lastMark = marks[i - 1];
    const minDistance = 2.5; // minimum distance between marks
    if (lastMark && mark.x - lastMark.x < minDistance) {
      lineLabel.setAttribute("x", lastMark.x + minDistance + "%");
      mark.x = lastMark.x + minDistance;
    }
    // would use polyline but can't use percentage for points
    let lineConnection = svg.newLine({
      "x1": x + "%",
      "x2": mark.x + "%",
      "y1": diagramHeight,
      "y2": diagramHeight + 23,
    });
    lineHolder.appendChild(line);
    lineHolder.appendChild(lineConnection);

    context.pubSub.subscribeToOverlayChanges((change: OverlayChangeEvent) => {
      let offset = change.combinedOverlayHeight;
      let scale = (diagramHeight + offset) / (diagramHeight);

      line.setAttribute("transform", `scale(1, ${scale})`);
      lineLabelHolder.setAttribute("transform", `translate(0, ${offset})`);
      lineConnection.setAttribute("transform", `translate(0, ${offset})`);
    });

    let isActive = false;
    let onLabelMouseEnter = () => {
      if (!isActive) {
        isActive = true;
        addClass(lineHolder, "active");
        // firefox has issues with this
        markHolder.parentNode.appendChild(markHolder);
      }
    };

    let onLabelMouseLeave = () => {
      isActive = false;
      removeClass(lineHolder, "active");
    };

    lineLabel.addEventListener("mouseenter", onLabelMouseEnter);
    lineLabel.addEventListener("mouseleave", onLabelMouseLeave);
    lineLabelHolder.appendChild(lineLabel);

    markHolder.appendChild(svg.newTitle(mark.name + " (" + Math.round(mark.startTime) + "ms)"));
    markHolder.appendChild(lineHolder);
    markHolder.appendChild(lineLabelHolder);
    marksHolder.appendChild(markHolder);
  });

  return marksHolder;
}

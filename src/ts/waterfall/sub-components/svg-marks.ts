import { addClass, removeClass } from "../../helpers/dom";
import { roundNumber, toCssClass } from "../../helpers/misc";
import * as svg from "../../helpers/svg";
import { Context } from "../../typing/context";
import { OverlayChangeEvent } from "../../typing/open-overlay";
import { Mark } from "../../typing/waterfall";

/**
 * Renders global marks for events like the onLoad event etc
 * @param  {Context} context  Execution context object
 * @param {Mark[]} marks         [description]
 */
export function createMarks(context: Context, marks: Mark[]) {
  const diagramHeight = context.diagramHeight;
  const marksHolder = svg.newG("marker-holder", {
    transform: "scale(1, 1)",
  });

  marks.forEach((mark, i) => {
    const x = roundNumber(mark.startTime / context.unit);
    const markHolder = svg.newG("mark-holder type-" + mark.name.toLowerCase().replace(/([0-9]+[ ]?ms)|\W/g, ""));
    const lineHolder = svg.newG("line-holder");
    const lineLabelHolder = svg.newG("line-label-holder");
    const lineLabel = svg.newTextEl(mark.name, { x: `${x}%`, y: diagramHeight + 25 });
    lineLabel.setAttribute("writing-mode", "tb");
    let lineRect: SVGGElement;
    mark.x = x;

    const line = svg.newLine({
      x1: x + "%",
      x2: x + "%",
      y1: 0,
      y2: diagramHeight,
    });

    const previousMark = marks[i - 1];
    const nextMark: Mark | undefined = marks[i + 1];
    const minDistance = 2.5; // minimum distance between marks
    const isCloseToPerviousMark = previousMark?.x !== undefined && mark.x - previousMark.x < minDistance;
    const nextX = roundNumber((nextMark?.startTime || 0) / context.unit);

    if (nextX && nextX - mark.x < minDistance && nextX + minDistance >= 100 && !isCloseToPerviousMark) { // look ahead
      // push current mark back if next mark would be pushed past 100% and there is no close previous mark
      lineLabel.setAttribute("x", `${nextX - minDistance}%`);
      mark.x = nextX - minDistance;
    } else if (previousMark?.x !== undefined && isCloseToPerviousMark) { // look behind
      // push mark ahead to not collide with previous mark
      lineLabel.setAttribute("x", `${previousMark.x + minDistance}%`);
      mark.x = previousMark.x + minDistance;
    }
    // would use polyline but can't use percentage for points
    const lineConnection = svg.newLine({
      x1: x + "%",
      x2: mark.x + "%",
      y1: diagramHeight,
      y2: diagramHeight + 23,
    });
    lineHolder.appendChild(line);
    lineHolder.appendChild(lineConnection);

    if (mark.duration) {
      lineRect = createLineRect(context, mark);
      lineHolder.appendChild(lineRect);
    }

    context.pubSub.subscribeToOverlayChanges((change: OverlayChangeEvent) => {
      const offset = change.combinedOverlayHeight;
      const scale = (diagramHeight + offset) / (diagramHeight);

      line.setAttribute("transform", `scale(1, ${scale})`);
      lineLabelHolder.setAttribute("transform", `translate(0, ${offset})`);
      lineConnection.setAttribute("transform", `translate(0, ${offset})`);
      if (lineRect) {
        lineRect.setAttribute("transform", `translate(0, ${offset})`);
      }
    });

    let isHoverActive = false;
    /** click indicator - overwrites `isHoverActive` */
    let isClickActive = false;
    const onLabelMouseEnter = () => {
      if (!isHoverActive) {
        // move marker to top
        (markHolder.parentNode as SVGElement).appendChild(markHolder);
        isHoverActive = true;
        // assign class later to not break animation with DOM re-order
        if (typeof window.requestAnimationFrame === "function") {
          window.requestAnimationFrame(() => addClass(lineHolder, "active"));
        } else {
          addClass(lineHolder, "active");
        }
      }
    };

    const onLabelMouseLeave = () => {
      isHoverActive = false;
      if (!isClickActive) {
        removeClass(lineHolder, "active");
      }
    };

    const onLabelClick = () => {
      if (isClickActive) {
        // deselect
        isHoverActive = false;
        removeClass(lineHolder, "active");
      } else if (!isHoverActive) {
        // for touch devices
        addClass(lineHolder, "active");
      } else {
        isHoverActive = false;
      }
      // set new state
      isClickActive = !isClickActive;
    };

    lineLabel.addEventListener("mouseenter", onLabelMouseEnter);
    lineLabel.addEventListener("mouseleave", onLabelMouseLeave);
    lineLabel.addEventListener("click", onLabelClick);
    lineLabelHolder.appendChild(lineLabel);

    markHolder.appendChild(svg.newTitle(mark.name));
    markHolder.appendChild(lineHolder);
    markHolder.appendChild(lineLabelHolder);
    marksHolder.appendChild(markHolder);
  });

  return marksHolder;
}

/**
 * Converts a `Mark` with a duration (e.g. a UserTiming with `startTimer` and `endTimer`) into a rect.
 * @param {Context} context Execution context object
 * @param {Mark} entry  Line entry
 */
export function createLineRect(context: Context, entry: Mark): SVGGElement {
  const holder = svg.newG(`line-mark-holder line-marker-${toCssClass(entry.name)}`);
  holder.appendChild(svg.newTitle(entry.name.replace(/^startTimer-/, "")));
  holder.appendChild(svg.newRect({
    height: context.diagramHeight,
    width: ((entry.duration || 1) / context.unit) + "%",
    x: ((entry.startTime || 0.001) / context.unit) + "%",
    y: 0,
  }, "line-mark"));

  return holder;
}

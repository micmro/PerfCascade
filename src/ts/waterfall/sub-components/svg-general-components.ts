/**
 * Creation of sub-components of the waterfall chart
 */

import { roundNumber } from "../../helpers/misc";
import * as svg from "../../helpers/svg";
import { Context } from "../../typing/context";
import { OverlayChangeEvent } from "../../typing/open-overlay";

/**
 * Renders a per-second marker line and appends it to `timeHolder`
 *
 * @param  {Context} context  Execution context object
 * @param  {SVGGElement} timeHolder element that the second marker is appended to
 * @param  {number} secsTotal  total number of seconds in the timeline
 * @param  {number} sec second of the time marker to render
 * @param  {boolean} addLabel  if true a time label is added to the marker-line
 */
const appendSecond = (context: Context, timeHolder: SVGGElement,
                      secsTotal: number, sec: number, addLabel: boolean = false) => {

  const diagramHeight = context.diagramHeight;
  const secPerc = 100 / secsTotal;
  /** just used if `addLabel` is `true` - for full seconds */
  let lineLabel;
  let lineClass = "sub-second-line";

  if (addLabel) {
    const showTextBefore = (sec > secsTotal - 0.2);
    lineClass = "second-line";
    let x = roundNumber(secPerc * sec) + 0.5 + "%";
    const css = {};
    if (showTextBefore) {
      x = roundNumber(secPerc * sec) - 0.5 + "%";
      css["text-anchor"] = "end";
    }
    lineLabel = svg.newTextEl(sec + "s", { x, y: diagramHeight }, css);
  }

  const x = roundNumber(secPerc * sec) + "%";
  const lineEl = svg.newLine({
    "x1": x,
    "x2": x,
    "y1": 0,
    "y2": diagramHeight,
  }, lineClass);

  context.pubSub.subscribeToOverlayChanges((change: OverlayChangeEvent) => {
    const offset = change.combinedOverlayHeight;
    // figure out why there is an offset
    const scale = (diagramHeight + offset) / (diagramHeight);

    lineEl.setAttribute("transform", `scale(1, ${scale})`);
    if (addLabel) {
      lineLabel.setAttribute("transform", `translate(0, ${offset})`);
    }
  });

  timeHolder.appendChild(lineEl);
  if (addLabel) {
    timeHolder.appendChild(lineLabel);
  }
};

/**
 * Renders the time-scale SVG elements (1sec, 2sec...)
 * @param  {Context} context  Execution context object
 * @param {number} durationMs    Full duration of the waterfall
 */
export function createTimeScale(context: Context, durationMs: number): SVGGElement {
  const timeHolder = svg.newG("time-scale full-width");
  const subStepMs = Math.ceil(durationMs / 10000) * 200;
  /** steps between each major second marker */
  const subStep = 1000 / subStepMs;
  const secs = durationMs / 1000;
  const steps = durationMs / subStepMs;

  for (let i = 0; i <= steps; i++) {
    const isMarkerStep = i % subStep < 0.000000001; // to avoid rounding issues
    const secValue = i / subStep;

    appendSecond(context, timeHolder, secs, secValue, isMarkerStep);
  }
  return timeHolder;
}

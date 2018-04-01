import { supportsPassiveEventListener } from "../../helpers/feature-detection";
import { Context } from "../../typing/context";

/**
 * Calculates current position in Milliseconds
 * @param offsetX offset on the X-axis relative to `fullWidth` in px
 * @param leftColumnWidthPerc width of the the left (description) column
 * @param fullWidth Width of the full chart (including the left column)
 * @param fullDuration Duration in milliseconds
 */
const toPosInMs = (offsetX: number, leftColumnWidthPerc: number, fullWidth: number, fullDuration: number) => {
  const leftWidthPx = fullWidth / 100 * leftColumnWidthPerc;
  if (offsetX <= leftWidthPx) {
    return null; // not over waterfall content
  }
  const rigthWidthPx = fullWidth - leftWidthPx;
  const posRightPx = offsetX - leftWidthPx;
  const posRightPerc = posRightPx / rigthWidthPx;
  /** Curent position in Milliseconds */
  return fullDuration * posRightPerc;
};

/**
 * Generates a slice-change check `mousemove` callback
 * @param context context object
 */
const sliceChangeCheck = (context: Context) => {
  const fullDuration = context.unit * 100;
  const options = context.options;
  const leftColumnWidthPerc = context.options.leftColumnWidth;
  const slices = options.timeSlices;
  const lastSlideIndex = options.timeSlices.length - 1;

  const onMouseMoveSliceCheck = (evt: MouseEvent) => {
    const tar = evt.currentTarget as SVGSVGElement;
    const currMs = toPosInMs(evt.offsetX, leftColumnWidthPerc, tar.clientWidth, fullDuration);
    if (currMs === null) {
      if (context.activeTimeslice !== null) {
        options.timeSliceOnLeave(context.activeTimeslice, evt);
        context.activeTimeslice = null;
      }
      return;
    }
    for (let i = 0; i <= lastSlideIndex; i++) {
      if ( currMs >= slices[i] && (i === lastSlideIndex || currMs < slices[i + 1])) {
        if (context.activeTimeslice !== slices[i] ) {
          if (context.activeTimeslice !== null) {
            options.timeSliceOnLeave(context.activeTimeslice, evt);
          }
          context.activeTimeslice = slices[i];
          options.timeSliceOnEnter(slices[i], evt);
        }
      }
    }
  };
  return onMouseMoveSliceCheck;
};

/**
 * Sets up the event listener and detection for the time-slice hit-detection
 * @param holder
 * @param context
 */
export const setupTimeSlices = (holder: SVGElement, context: Context) => {
  const pass: any = supportsPassiveEventListener ? {
    passive: true,
  } : false; // ts does not have typing for passive yet - use any

  holder.addEventListener("mousemove", sliceChangeCheck(context), pass);
  holder.addEventListener("mouseleave", (evt) => {
    context.options.timeSliceOnLeave(context.activeTimeslice || 0, evt as MouseEvent);
    context.activeTimeslice = null;
  }, pass);
};

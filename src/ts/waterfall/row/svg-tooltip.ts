import {
  addClass,
  getParentByClassName,
  makeBodyEl,
  makeHtmlEl,
  removeClass,
} from "../../helpers/dom";
import * as svg from "../../helpers/svg";
import { ChartRenderOption } from "../../typing/options";
import { RectData } from "../../typing/rect-data";

const translateYRegEx = /(?:translate)\(.+[, ]+(.+)\)/;
const tooltipMaxWidth = 200;

const getTranslateY = (str: string = "") => {
  const res = translateYRegEx.exec(str);
  if (res && res.length >= 2) {
    return parseInt(res[1], 10);
  }
  return 0;
};

/** static event-handler to show tooltip */
export const onHoverInShowTooltip = (base: SVGRectElement, rectData: RectData, foreignEl: SVGForeignObjectElement) => {
  const innerDiv = foreignEl.querySelector(".tooltip-payload") as HTMLDivElement;
  const row = getParentByClassName(base, "row-item") as SVGAElement;
  const yTransformOffsest = getTranslateY(row.getAttribute("transform"));
  /** Base Y */
  const yInt = parseInt(base.getAttribute("y"), 10);
  /** Base X */
  const x = base.getAttribute("x");
  /** X Positon of parent in Percent */
  const xPercInt = parseFloat(x);
  let offsetY = 50;
  /** Row's width in Pixel */
  const rowWidthPx = base.width.baseVal.value || base.getBoundingClientRect().width;
  /** current ratio: 1% ≙ `pxPerPerc` Pixel */
  const pxPerPerc = rowWidthPx / (rectData.width / rectData.unit);
  const percPerPx = (rectData.width / rectData.unit) / rowWidthPx;
  const isLeftOfRow = xPercInt > 50 && ((95 - xPercInt) * pxPerPerc < tooltipMaxWidth);
  innerDiv.innerText = rectData.label;
  addClass(innerDiv, "no-anim");
  foreignEl.style.display = "block";
  innerDiv.style.opacity = "0.1";

  /** First heigth, floating might change this later, since with is not fixed */
  const initialHeight = innerDiv.clientHeight + 5;

  if (yInt + yTransformOffsest - initialHeight > 0) { // above row
    offsetY = yTransformOffsest - initialHeight;
  } else { // below row: more offset to not hide text with mouse
    offsetY = yTransformOffsest + rectData.height + 10;
  }
  if (isLeftOfRow) {
    innerDiv.style.left = `${xPercInt - ((innerDiv.clientWidth + 5) * percPerPx)}%`;
  } else {
    innerDiv.style.left = x;
  }
  foreignEl.setAttribute("y", `${yInt + offsetY}px`);
  foreignEl.setAttribute("height", initialHeight.toString());
  removeClass(innerDiv, "no-anim");
  innerDiv.style.opacity = "1";

  const diff = (innerDiv.clientHeight + 5) - initialHeight;
  if (diff !== 0) {
    // make adjustments if the initial height was wrong
    foreignEl.setAttribute("height", (initialHeight + diff).toString());
    foreignEl.setAttribute("y", `${yInt + offsetY - diff}px`);
  }
};

export const onHoverOutShowTooltip = (base: SVGRectElement) => {
  const holder = getParentByClassName(base, "water-fall-chart") as SVGGElement;
  const foreignEl = holder.querySelector(".tooltip") as SVGForeignObjectElement;
  const innerDiv = foreignEl.querySelector(".tooltip-payload") as HTMLDivElement;
  foreignEl.style.display = "none";
  foreignEl.setAttribute("height", "250"); // set to high value
  innerDiv.style.opacity = "0";
};

/**
 * Creates the Tooltip base elements
 * @param {ChartOptions} options - Chart config/customization options
 */
export const makeTooltip = (options: ChartRenderOption) => {
  const leftColOffsetPerc = options.leftColumnWith;
  const holder = svg.newSvg("tooltip-holder", {
    width: "100%",
    x: "0",
    y: "0",
  });
  const foreignEl = svg.newForeignObject({
    width: `100%`,
    x: "0",
    y: `${leftColOffsetPerc}%`,
  }, "tooltip", {
    display: "none",
  });

  const html = makeHtmlEl();
  const body = makeBodyEl({
    left: `${leftColOffsetPerc}%`,
    width: `${100 - leftColOffsetPerc}%`,
  }, `<div class="tooltip-payload" style="max-width: ${tooltipMaxWidth}px; opacity: 0;"></div>`);

  html.appendChild(body);
  foreignEl.appendChild(html);
  holder.appendChild(foreignEl);
  return holder;
};

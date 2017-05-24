import { getParentByClassName } from "../../helpers/dom";
import * as svg from "../../helpers/svg";
import { RectData } from "../../typing/rect-data";

/** static event-handler to show tooltip */
export const onHoverInShowTooltip = (evt: MouseEvent, rectData: RectData) => {
  const base = evt.target as SVGRectElement;
  const holder = getParentByClassName(base, "water-fall-chart") as SVGGElement;
  const foreignEl = holder.getElementsByClassName("tooltip").item(0) as SVGForeignObjectElement;
  const innerDiv = foreignEl.firstElementChild as HTMLDivElement;
  const y = parseInt(base.getAttribute("y"), 10);
  let x = base.getAttribute("x");
  const xPercInt = parseFloat(x);
  const rowWidth = base.width.baseVal.value || base.getBoundingClientRect().width;
  const pxPerPerc = rowWidth / (rectData.width / rectData.unit);
  const percPerPx = (rectData.width / rectData.unit) / rowWidth;
  if (xPercInt > 55) {
    if ((95 - xPercInt) * pxPerPerc > 200) {
      foreignEl.setAttribute("width", `${95 - xPercInt}%`);
    } else {
      x = `${xPercInt - 210 * percPerPx}%`;
      foreignEl.setAttribute("width", `200`);
    }
  }
  innerDiv.innerText = rectData.label;
  foreignEl.style.display = "block";
  const height = innerDiv.clientHeight + 5;
  let yOffset = height;
  foreignEl.setAttribute("x", x);
  if (y - height < 0) {
    yOffset = -(yOffset + base.clientHeight);
  }
  foreignEl.setAttribute("transform", `translate(0, ${y + -yOffset})`);
  foreignEl.setAttribute("height", height.toString());
};

export const onHoverOutShowTooltip = (evt: MouseEvent) => {
  const base = evt.target as SVGRectElement;
  const holder = getParentByClassName(base, "water-fall-chart") as SVGGElement;
  const foreignEl = holder.getElementsByClassName("tooltip").item(0) as SVGForeignObjectElement;
  foreignEl.style.display = "none";
};

// Ref:
// http://www.petercollingridge.co.uk/sites/files/peter/tooltip_final_0.svg
// view-source:http://www.petercollingridge.co.uk/sites/files/peter/tooltip_final_0.svg

export const makeTooltip = () => {
  const holder = svg.newSvg("tooltip-holder", {
    // height: "100%",
    transform: "translate(5, 0)", // offset from original
    width: "75%",
    x: "25%",
    y: "0",
  });
  // const y = rectData.y;
  const width = 200;
  const foreignEl = svg.newForeignObject({
    height: "25%",
    transform: `translate(0, 0)`,
    width,
    x: 0,
    y: 0,
  });
  foreignEl.classList.add("tooltip");
  // foreignEl.classList.add("tooltip");
  foreignEl.innerHTML = `<body>
    <div class="tootlip-payload" style="max-width: 100%">XXXX</div>
  </body>`;
  foreignEl.style.display = "none";
  holder.appendChild(foreignEl);
  return holder;
};

import { addClass, getParentByClassName, removeClass } from "../../helpers/dom";
import * as svg from "../../helpers/svg";
import { RectData } from "../../typing/rect-data";

const translateYRegEx = /translate\(\d+[, ]+(\d+)\)/;

const getTranslateY = (str: string = "") => {
  const res = translateYRegEx.exec(str);
  if (res && res.length >= 2) {
    return parseInt(res[1], 10);
  }
  return 0;
};

/** static event-handler to show tooltip */
export const onHoverInShowTooltip = (base: SVGRectElement, rectData: RectData, foreignEl: SVGForeignObjectElement) => {
  console.log("onHoverInShowTooltip");
  const offsetX = 5;
  let offsetY = 5;
  const innerDiv = foreignEl.firstElementChild as HTMLDivElement;
  const row = getParentByClassName(base, "row-item") as SVGAElement;
  const yTransformOffest = getTranslateY(row.getAttribute("transform"));
  const y = base.getAttribute("y");
  const yNum = parseInt(base.getAttribute("y"), 10);
  let x = base.getAttribute("x");
  const xPercInt = parseFloat(x);
  const rowWidth = base.width.baseVal.value || base.getBoundingClientRect().width;
  const pxPerPerc = rowWidth / (rectData.width / rectData.unit);
  const percPerPx = (rectData.width / rectData.unit) / rowWidth;
  if (xPercInt > 55 && ((95 - xPercInt) * pxPerPerc < 200)) {
    // if ((95 - xPercInt) * pxPerPerc > 200) {
    //   console.log("right - slim");
    //   foreignEl.setAttribute("width", `${95 - xPercInt}%`);
    //   innerDiv.style.width = `${95 - xPercInt}%`;
    // } else {
       x = `${xPercInt - 220 * percPerPx}%`;
       console.log("left", x);
       addClass(foreignEl, "tooltip-left");
       innerDiv.style.width = "200px";
    // }
  } else {
    addClass(foreignEl, "tooltip-right");
    console.log("right");
  }
  innerDiv.innerText = rectData.label;
  foreignEl.style.display = "block";
  const height = innerDiv.clientHeight + 5;
  foreignEl.setAttribute("x", x);
  foreignEl.setAttribute("y", y);
  if (yNum - height < 0) {
    console.log("Top max");
    offsetY = height + 2;
  } else {
    offsetY = -height;
  }
  foreignEl.style.transform = `translate(${offsetX}px, ${offsetY + yTransformOffest}px)`;
  foreignEl.setAttribute("height", height.toString());
  foreignEl.style.opacity = "1";
  // foreignEl.style.display = "block";

  /// TODO: Handle open overlays

};

export const onHoverOutShowTooltip = (base: SVGRectElement) => {
  const holder = getParentByClassName(base, "water-fall-chart") as SVGGElement;
  const foreignEl = holder.getElementsByClassName("tooltip").item(0) as SVGForeignObjectElement;
  const innerDiv = foreignEl.firstElementChild as HTMLDivElement;
  // foreignEl.style.display = "none";
  // foreignEl.style.opacity = "0";
  innerDiv.style.width = "auto";
  removeClass(foreignEl, "tooltip-left");
  removeClass(foreignEl, "tooltip-right");
  // foreignEl.firstElementChild.style.width = "200px";
  // removeClass(foreignEl, "tooltip-holder-left");
  foreignEl.setAttribute("width", `200`); // reset
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
  holder.appendChild(svg.newRect({
    // fill: "#f00",
    height: "5",
    width: "100%",
  }, "spacer", {
    fill: "#f00",
  }));
  // const y = rectData.y;
  const width = 200;
  const foreignEl = svg.newForeignObject({
    height: "25%",
    width,
    x: 0,
    y: 0,
  });
  foreignEl.style.opacity = "0";
  addClass(foreignEl, "tooltip");
  foreignEl.innerHTML = `<body>
    <div class="tootlip-payload" style="max-width: 100%">XXXX</div>
  </body>`;
  foreignEl.style.display = "none";
  holder.appendChild(foreignEl);
  return holder;
};

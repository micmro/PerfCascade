import * as svg from "../../helpers/svg";
import { RectData } from "../../typing/rect-data";

/** static event-handler to show tooltip */
export const onHoverInShowTooltip = (evt: MouseEvent) => {
  const parent = evt.target as SVGRectElement;
  const foreignEl = (parent).nextElementSibling as SVGForeignObjectElement;
  foreignEl.style.display = "block";
  const innerDiv = foreignEl.firstElementChild as HTMLDivElement;
  const height = innerDiv.clientHeight + 5;

  foreignEl.setAttribute("transform", `translate(5, ${-height})`);
};
export const onHoverOutShowTooltip = (evt: MouseEvent) => {
  const foreignEl = (evt.target as SVGRectElement).nextElementSibling as SVGForeignObjectElement;
  foreignEl.style.display = "none";
};

// Ref:
// http://www.petercollingridge.co.uk/sites/files/peter/tooltip_final_0.svg
// view-source:http://www.petercollingridge.co.uk/sites/files/peter/tooltip_final_0.svg

export const makeTooltip = (rectData: RectData, x: string, blockHeight: number) => {
  const y = rectData.y;
  const width = 200;
  // const holder = svg.newG("tooltip", {}, {
  //   display: "none",
  //   zIndex: 999,
  // });
  // const txtEl = svg.makeWrapSvgText(rectData.label, 150, x);
  blockHeight++; // REMOVE ME
  const foreignEl = svg.newForeignObject({
    x,
    y,
    width,
    height: "100%",
    transform: `translate(0, 0)`,
  });
  foreignEl.classList.add("tooltip");
  foreignEl.innerHTML = `<body>
    <div class="tootlip-payload" style="max-width: ${width}px">${rectData.label}</div>
  </body>`;
  foreignEl.style.display = "none";
  // console.log(txtEl.childElementCount, blockHeight);
  // const offset = txtEl.childElementCount * 12 * 1.2;
  // txtEl.setAttribute("x", x);
  // txtEl.setAttribute("y", (y - (txtEl.childElementCount - 1) * 12 * 1.2).toString());
  // const height = txtEl.childNodes.length * 1.2;
  // console.log(txtEl);
  // const txt = svg.newTextEl(rectData.label, {
  //     // lengthAdjust: "spacingAndGlyphs",
  //     // textLength: width,
  //     x,
  //     y: y  + 12,
  //   }, {
  //     alignmentBaseline: "baseline",
  //     fontSize: 12,
  //   });
  // const bgEl = svg.newRect({
  //     height: blockHeight + "em",
  //     width,
  //     x,
  //     y: (y).toString(),
  //   }, "", {
  //     fill: "#fff",
  //   });
  // // console.log(txt.getComputedTextLength());
  // holder.appendChild(bgEl);
  // holder.appendChild(txtEl);
  return foreignEl;
};

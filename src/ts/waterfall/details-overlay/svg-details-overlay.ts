import * as svg from "../../helpers/svg";
import { OpenOverlay } from "../../typing/open-overlay";
import { createDetailsBody } from "./html-details-body";

export function forEach(els: NodeListOf<Element>, fn: (el: Element, index: number) => any) {
  Array.prototype.forEach.call(els, fn);
}

function createCloseButtonSvg(y: number): SVGGElement {
  let closeBtn = svg.newA("info-overlay-close-btn");

  closeBtn.appendChild(svg.newRect({
    "height": 23,
    "width": 23,
    "x": "100%",
    "y": y,
  }));

  closeBtn.appendChild(svg.newTextEl("✕", {
    dx: 7,
    dy: 16,
    x: "100%",
    y,
  }));

  closeBtn.appendChild(svg.newTitle("Close Overlay"));

  return closeBtn;
}

function createHolder(y: number, detailsHeight: number) {

  let innerHolder = svg.newG("info-overlay-holder");

  let bg = svg.newRect({
    "height": detailsHeight,
    "rx": 2,
    "ry": 2,
    "width": "100%",
    "x": "0",
    "y": y,
  }, "info-overlay");

  innerHolder.appendChild(bg);
  return innerHolder;
}

export function createRowInfoOverlay(overlay: OpenOverlay, y: number, detailsHeight: number): SVGGElement {
  const requestID = overlay.index + 1;
  let wrapper = svg.newG(`outer-info-overlay-holder overlay-index-${overlay.index}`);
  let holder = createHolder(y, detailsHeight);

  let foreignObject = svg.newForeignObject({
    "height": detailsHeight,
    "width": "100%",
    "x": "0",
    "y": y,
  });

  let closeBtn = createCloseButtonSvg(y);
  closeBtn.addEventListener("click", () => overlay.onClose(overlay.index));

  let body = createDetailsBody(requestID, detailsHeight, overlay.entry);
  let buttons = body.getElementsByClassName("tab-button") as NodeListOf<HTMLButtonElement>;
  let tabs = body.getElementsByClassName("tab") as NodeListOf<HTMLDivElement>;

  let setTabStatus = (tabIndex: number) => {
    overlay.openTabIndex = tabIndex;
    forEach(tabs, (tab: HTMLDivElement, j) => {
      tab.style.display = (tabIndex === j) ? "block" : "none";
      buttons.item(j).classList.toggle("active", (tabIndex === j));
    });
  };

  forEach(buttons, (btn, tabIndex) => {
    btn.addEventListener("click", () => setTabStatus(tabIndex));
  });

  setTabStatus(overlay.openTabIndex);

  foreignObject.appendChild(body);
  holder.appendChild(foreignObject);
  holder.appendChild(closeBtn);

  wrapper.appendChild(holder);

  return wrapper;
}

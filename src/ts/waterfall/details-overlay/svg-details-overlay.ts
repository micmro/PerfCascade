import * as svg from "../../helpers/svg";
import {WaterfallEntry} from "../../typing/waterfall";
import {createDetailsBody} from "./html-details-body";

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

  closeBtn.appendChild(svg.newTextEl("X", {
    dx: 7,
    dy: 16,
    x: "100%",
    y,
  }));

  closeBtn.appendChild(svg.newTitle("Close Overlay"));

  return closeBtn;
}

function createHolder(y: number, accordionHeight: number) {

  let innerHolder = svg.newG("info-overlay-holder");

  let bg = svg.newRect({
    "height": accordionHeight,
    "rx": 2,
    "ry": 2,
    "width": "100%",
    "x": "0",
    "y": y,
  }, "info-overlay");

  innerHolder.appendChild(bg);
  return innerHolder;
}

export function createRowInfoOverlay(indexBackup: number, y: number,
                                     accordionHeight: number, block: WaterfallEntry,
                                     onClose: Function): SVGGElement {
  const requestID =  parseInt(block.rawResource._index + 1, 10) || indexBackup + 1;
  let wrapper = svg.newG("outer-info-overlay-holder");
  let holder = createHolder(y, accordionHeight);

  let foreignObject = svg.newForeignObject({
    "height": accordionHeight,
    "width": "100%",
    "x": "0",
    "y": y,
  });

  let closeBtn = createCloseButtonSvg(y);
  closeBtn.addEventListener("click", () => onClose(indexBackup, holder));

  let body = createDetailsBody(requestID, block, accordionHeight);
  let buttons = body.getElementsByClassName("tab-button") as NodeListOf<HTMLButtonElement>;
  let tabs = body.getElementsByClassName("tab") as NodeListOf<HTMLDivElement>;

  let setTabStatus = (index) => {
    forEach(tabs, (tab: HTMLDivElement, j) => {
      tab.style.display = (index === j) ? "block" : "none";
      buttons.item(j).classList.toggle("active", (index === j));
    });
  };

  forEach(buttons, (btn, i) => {
    btn.addEventListener("click", () => { setTabStatus(i); });
  });

  setTabStatus(0);

  foreignObject.appendChild(body);
  holder.appendChild(foreignObject);
  holder.appendChild(closeBtn);

  wrapper.appendChild(holder);

  return wrapper;
}

import { forEachNodeList } from "../../helpers/dom";
import * as svg from "../../helpers/svg";
import { OpenOverlay } from "../../typing/open-overlay";
import { createDetailsBody } from "./html-details-body";

function createCloseButtonSvg(y: number): SVGGElement {
  const closeBtn = svg.newA("info-overlay-close-btn");

  closeBtn.appendChild(svg.newRect({
    height: 23,
    width: 23,
    x: "100%",
    y,
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
  const holder = svg.newG("info-overlay-holder");
  const bg = svg.newRect({
    height: detailsHeight,
    rx: 2,
    ry: 2,
    width: "100%",
    x: "0",
    y,
  }, "info-overlay-bg");

  holder.appendChild(bg);
  return holder;
}

export function createRowInfoOverlay(overlay: OpenOverlay, y: number, detailsHeight: number): SVGGElement {
  const requestID = overlay.index + 1;
  const holder = createHolder(y, detailsHeight);

  const foreignObject = svg.newForeignObject({
    height: detailsHeight,
    width: "100%",
    x: "0",
    y,
  });

  const closeBtn = createCloseButtonSvg(y);
  closeBtn.addEventListener("click", () => overlay.onClose(overlay.index));

  const body = createDetailsBody(requestID, detailsHeight, overlay.entry);
  const buttons = body.getElementsByClassName("tab-button") as NodeListOf<HTMLButtonElement>;
  const tabs = body.getElementsByClassName("tab") as NodeListOf<HTMLDivElement>;

  const setTabStatus = (tabIndex: number) => {
    overlay.openTabIndex = tabIndex;
    forEachNodeList(tabs, (tab: HTMLDivElement, j) => {
      tab.style.display = (tabIndex === j) ? "block" : "none";
      buttons.item(j).classList.toggle("active", (tabIndex === j));
    });
  };

  forEachNodeList(buttons, (btn, tabIndex) => {
    btn.addEventListener("click", () => setTabStatus(tabIndex));
  });

  setTabStatus(overlay.openTabIndex);

  foreignObject.appendChild(body);
  holder.appendChild(foreignObject);
  holder.appendChild(closeBtn);

  return holder;
}

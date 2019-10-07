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

/** Shared function to copy the tabs data */
const onTabDataCopyClick = (event: MouseEvent) => {
  const btn = event.target as HTMLButtonElement;
  if (btn.tagName.toLowerCase() === "button" && btn.classList.contains("copy-tab-data")) {
    const el = document.createElement("textarea");
    el.value = btn.nextElementSibling ? (btn.nextElementSibling as HTMLElement).innerText : "";
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999); // for mobile
    document.execCommand("copy");
    document.body.removeChild(el);
  }
};

export function createRowInfoOverlay(overlay: OpenOverlay, y: number, detailsHeight: number): SVGGElement {
  const requestID = overlay.index + 1;
  const holder = createHolder(y, detailsHeight);

  const foreignObject = svg.newForeignObject({
    height: detailsHeight,
    width: "100%",
    x: "0",
    y,
  });

  const body = createDetailsBody(requestID, detailsHeight, overlay.entry);
  const closeBtn = createCloseButtonSvg(y);
  closeBtn.addEventListener("click", () => {
    overlay.onClose(overlay.index);
    body.removeEventListener("click", onTabDataCopyClick);
  });
  body.addEventListener("click", onTabDataCopyClick);

  // need to re-fetch the elements to fix Edge "Invalid Calling Object" bug
  const getButtons = () => body.getElementsByClassName("tab-button") as NodeListOf<HTMLButtonElement>;
  const getTabs = () => body.getElementsByClassName("tab") as NodeListOf<HTMLDivElement>;

  const setTabStatus = (tabIndex: number | undefined) => {
    overlay.openTabIndex = tabIndex;
    forEachNodeList(getTabs(), (tab: HTMLDivElement, j) => {
      tab.style.display = (tabIndex === j) ? "block" : "none";
      getButtons().item(j).classList.toggle("active", (tabIndex === j));
    });
  };

  forEachNodeList(getButtons(), (btn, tabIndex) => {
    btn.addEventListener("click", () => setTabStatus(tabIndex));
  });

  setTabStatus(overlay.openTabIndex);

  foreignObject.appendChild(body);
  holder.appendChild(foreignObject);
  holder.appendChild(closeBtn);

  return holder;
}

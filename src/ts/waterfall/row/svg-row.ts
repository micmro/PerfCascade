// import { getLastItemOfNodeList } from "../../helpers/dom";
import * as icons from "../../helpers/icons";
import {
  isTabDown,
  isTabUp,
  resourceUrlFormatter,
} from "../../helpers/misc";
import * as svg from "../../helpers/svg";
import { Context } from "../../typing/context";
import { OpenOverlay } from "../../typing/open-overlay";
import { RectData } from "../../typing/rect-data";
import { WaterfallEntry } from "../../typing/waterfall";
import { getIndicatorIcons } from "./svg-indicators";
import * as rowSubComponents from "./svg-row-subcomponents";

// initial clip path
const clipPathElProto = svg.newClipPath("titleClipPath");
clipPathElProto.appendChild(svg.newRect({
  "height": "100%",
  "width": "100%",
}));

const ROW_LEFT_MARGIN = 3;

// Create row for a single request
export function createRow(context: Context, index: number,
                          maxIconsWidth: number, maxNumberWidth: number,
                          rectData: RectData, entry: WaterfallEntry,
                          onDetailsOverlayShow: EventListener): SVGAElement {

  const y = rectData.y;
  const rowHeight = rectData.height;
  const leftColumnWith = context.options.leftColumnWith;
  let rowItem = svg.newA(entry.responseDetails.rowClass);
  rowItem.setAttribute("href", "javascript:void(0)");
  let leftFixedHolder = svg.newSvg("left-fixed-holder", {
    "width": `${leftColumnWith}%`,
    "x": "0",
  });
  let flexScaleHolder = svg.newSvg("flex-scale-waterfall", {
    "width": `${100 - leftColumnWith}%`,
    "x": `${leftColumnWith}%`,
  });

  let rect = rowSubComponents.createRect(rectData, entry.segments, entry.total);
  let rowName = rowSubComponents.createNameRowBg(y, rowHeight);
  let rowBar = rowSubComponents.createRowBg(y, rowHeight);
  let bgStripe = rowSubComponents.createBgStripe(y, rowHeight, (index % 2 === 0));

  let x = ROW_LEFT_MARGIN + maxIconsWidth;

  if (context.options.showMimeTypeIcon) {
    const icon = entry.responseDetails.icon;
    x -= icon.width;
    rowName.appendChild(icons[icon.type](x, y + 3, icon.title));
  }

  if (context.options.showIndicatorIcons) {
    // Create and add warnings for potentia;l issues
    getIndicatorIcons(entry).forEach((icon) => {
      x -= icon.width;
      rowName.appendChild(icons[icon.type](x, y + 3, icon.title));
    });
  }

  // Jump to the largest offset of all rows
  x = ROW_LEFT_MARGIN + maxIconsWidth;

  let requestNumber = `${index + 1}`;

  const requestNumberLabel = rowSubComponents.createRequestNumberLabel(x, y, requestNumber, rowHeight, maxNumberWidth);
  // 4 is slightly bigger than the hover "glow" around the url
  x += maxNumberWidth + 4;
  let shortLabel = rowSubComponents.createRequestLabelClipped(x, y, resourceUrlFormatter(entry.url, 40),
    rowHeight);
  let fullLabel = rowSubComponents.createRequestLabelFull(x, y, entry.url, rowHeight);

  // create and attach request block
  rowBar.appendChild(rect);

  rowSubComponents.appendRequestLabels(rowName, requestNumberLabel, shortLabel, fullLabel);

  // const onOpenOverlayFocusOut = (evt: KeyboardEvent) => {
  //   if (evt.which !== 9) {
  //     return; // only handle tabs
  //   }
  //   const isUpward = evt.shiftKey;
  //   console.log("onActiveFocusOut", isUpward);
  // };

  // accordeon a11y guide
  // https://www.w3.org/TR/wai-aria-practices-1.1/#accordion
  context.pubSub.subscribeToSpecificOverlayChanges(index, (change) => {
    openOverlay = (change.type === "open") ? change.changedOverlay : undefined;
  });
  if (index > 0) {
    context.pubSub.subscribeToSpecificOverlayChanges(index - 1, (change) => {
      prevOpenOverlay = (change.type === "open") ? change.changedOverlay : undefined;
    });
  }

  let isPoinerClick = false;
  let openOverlay: OpenOverlay;
  /** Poiter to the previous open Oberlay (if exist) */
  let prevOpenOverlay: OpenOverlay;
  // let showDetailsTimeout: number;



  // const enterOverlaySetup = (isDownwards: boolean, openOverlay: OpenOverlay) => {
  //   const overlayEl = context.overlayManager.getOpenOverlayDomEl(openOverlay);
  //   /** Top header el */
  //   const firstFocusEl = overlayEl.getElementsByTagName("a")[0];
  //   /** All focusable elements */
  //   const allFocusEl = overlayEl.querySelectorAll(":scope a, :scope button");
  //   const lastTab = getLastItemOfNodeList(allFocusEl);
  //   for (let i = allFocusEl.length - 1; i <= 0 i--) {
  //     const el = allFocusEl.item(i);
  //     el.setAttribute("tabindex", "0");
  //   }
  //   console.log(allFocusEl)

  //   const onOverlayExit = () => {
  //     console.log("Implement me");
  //     for (let i = allFocusEl.length - 1; i <= 0 i--) {
  //       const el = allFocusEl.item(i);
  //       el.setAttribute("tabindex", "-1");
  //     }
  //     lastTab.removeEventListener("keypress", onLastElKeypress);
  //   };

  //   const onLastElKeypress = (evt: KeyboardEvent) => {
  //     if (isTabDown(evt)) {
  //       evt.preventDefault();
  //       onOverlayExit();
  //     }
  //   };
  //   lastTab.addEventListener("keypress", onLastElKeypress)
  //   firstFocusEl.focus();
  // };




  // triggered before click by touch and mouse devices
  rowItem.addEventListener("mouseup", () => {
    isPoinerClick = true;
  });
  rowItem.addEventListener("click", (evt: MouseEvent) => {
    isPoinerClick = false;
    onDetailsOverlayShow(evt);
  });
  rowItem.addEventListener("keydown", (evt: KeyboardEvent) => {
    // on enter
    if (evt.which === 32) {
      evt.preventDefault();
      onDetailsOverlayShow(evt);
      return;
    }

    // // moving down into overlay
    // if (isTabDown(evt) && openOverlay) {
    //   console.log("moving down into overlay");
    //   evt.preventDefault();
    //   const overlayEl = context.overlayManager.getOpenOverlayDomEl(openOverlay);
    //   /** Top header el */
    //   const firstFocusEl = overlayEl.getElementsByTagName("a")[0];
    //   const lastTab = getLastItemOfNodeList(overlayEl.getElementsByClassName("tab-button") as
    //     NodeListOf<HTMLButtonElement>);

    //   // Move out up the the top, to the node el
    //   firstFocusEl.addEventListener("keydown", (inOverlayEvt: KeyboardEvent) => {
    //     // IE & Edge do not support `focus()` in SVG
    //     if (isTabUp(inOverlayEvt) && typeof (rowItem as any).focus === "function") {
    //       console.log("Move out up the the top, to the node el");
    //       inOverlayEvt.preventDefault();
    //       console.log("rowItem in `nextFocusEl.on keydown with tab+shift`", rowItem);
    //       (rowItem as any).focus();
    //     }
    //   });

    //   console.log("lastTab", lastTab);
    //   // Move out down at the end
    //   lastTab.addEventListener("keydown", (inOverlayEvt: KeyboardEvent) => {
    //     // IE & Edge do not support `focus()` in SVG
    //     if (isTabDown(inOverlayEvt) && typeof (rowItem as any).focus === "function") {
    //       console.log("Move out down at the end");
    //       if (rowItem.nextSibling) {
    //         inOverlayEvt.preventDefault();
    //         // not last in chart
    //         (rowItem.nextSibling as any).focus();
    //       } else {
    //         //last in chart
    //         console.log("last in chart")
    //         inOverlayEvt.preventDefault();
    //       }
    //     } else if (isTabDown(inOverlayEvt)) {
    //       console.log(">>>");
    //     }
    //   });
    //   firstFocusEl.focus();
    //   return;
    //   // evt.cancelBubble = true;
    // }

    // // moving up into overlay
    // if (isTabUp(evt) && prevOpenOverlay) {
    //   console.log("moving up into overlay");
    //   evt.preventDefault();
    //   const prevOverlayEl = context.overlayManager.getOpenOverlayDomEl(prevOpenOverlay);
    //   const lastTab = getLastItemOfNodeList(prevOverlayEl.getElementsByClassName("tab-button") as
    //     NodeListOf<HTMLButtonElement>);
    //   lastTab.focus();
    //   return;
    // }

    // // tab without open overlays around
    if (isTabUp(evt) && !prevOpenOverlay && index > 0) {
      rowItem.previousSibling.previousSibling.lastChild.lastChild.dispatchEvent(new MouseEvent("mouseenter"));
      return;
    }
    if (isTabDown(evt) && !openOverlay) {
      if (rowItem.nextSibling && rowItem.nextSibling.nextSibling) {
        rowItem.nextSibling.nextSibling.lastChild.lastChild.dispatchEvent(new MouseEvent("mouseenter"));
      }
    // else {
    //     console.log("Sort this out > tab without open overlays around");
    //     if (context.overlayManager.hasOpenOverlays()) {
    //       const lastTab = getLastItemOfNodeList(context.overlayManager.getLastOpenOverlayDomEl()
    //         .getElementsByClassName("tab-button") as NodeListOf<HTMLButtonElement>);
    //       console.log("END", lastTab);
    //       lastTab.focus();
    //     }
    //     // prev
    //     // do not prevent default, so the focus moves on
    // }
      return;
    }
    // // Not handled
    // if (evt.which === 9) {
    //   console.log("go to next/prev thing");
    // }
  });

  // rowItem.addEventListener("keyup", (evt: KeyboardEvent) => {
  //   if (evt.which === 9) {
  //     //document.activeElement === rowItem
  //     console.log("keydown");
  //     rowName.dispatchEvent(new MouseEvent("mouseenter"));
  //     window["eventsStore"]["key"].push(evt);
  //   }
  // });


  // rowItem.addEventListener("focusin", (evt: FocusEvent) => {
  //   console.log("in", isPoinerClick);
  //   // const test = new MouseEvent("mouseenter");
  //   rowName.dispatchEvent(new MouseEvent("mouseenter"));
  //   window["eventsStore"]["mouse"].push(evt);
  // });


  rowItem.addEventListener("focusout", () => {
    rowName.dispatchEvent(new MouseEvent("mouseleave"));
  });

  // rowItem.addEventListener("click", (evt) => {
  //   console.log("click", evt);
  //   onDetailsOverlayShow(evt);
  // });


  flexScaleHolder.appendChild(rowBar);
  leftFixedHolder.appendChild(clipPathElProto.cloneNode(true));
  leftFixedHolder.appendChild(rowName);

  rowItem.appendChild(bgStripe);
  rowItem.appendChild(flexScaleHolder);
  rowItem.appendChild(leftFixedHolder);

  return rowItem;
}

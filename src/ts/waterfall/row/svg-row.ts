import * as icons from "../../helpers/icons";
import * as misc from "../../helpers/misc";
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
  let shortLabel = rowSubComponents.createRequestLabelClipped(x, y, misc.resourceUrlFormatter(entry.url, 40),
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
    console.log("onOverlayChange", change.type);
    if (change.type === "open") {
      openOverlay = change.changedOverlay;
    } else {
      openOverlay = undefined;
    }
  });

  let isPoinerClick = false;
  let openOverlay: OpenOverlay;
  // let showDetailsTimeout: number;
  // triggered before click by touch and mouse devices
  rowItem.addEventListener("mouseup", () => {
    isPoinerClick = true;
  });
  rowItem.addEventListener("click", (evt: MouseEvent) => {
    isPoinerClick = false;
    onDetailsOverlayShow(evt);
  });
  rowItem.addEventListener("keydown", (evt: KeyboardEvent) => {
    if (evt.which === 32) {
      evt.preventDefault();
      onDetailsOverlayShow(evt);
    }
    if (evt.which === 9) {
      if (openOverlay) {
        // const overlayCount = context.overlayManager.getOpenOverlays().length;
        // if(openOverlay.index){

        // }
        // openOverlay.
      } else {
        let nextRowItem = evt.shiftKey ? rowItem.previousSibling : rowItem.nextSibling;
        nextRowItem.lastChild.lastChild.dispatchEvent(new MouseEvent("mouseenter"));
      }
    }
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
    console.log("out");
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

import {OpenOverlay, OverlayChangeEvent} from "../../typing/open-overlay";
import {WaterfallEntry} from "../../typing/waterfall";
import * as overlayChangesPubSub from "./overlay-changes-pub-sub";
import {createRowInfoOverlay} from "./svg-details-overlay";

/** Collection of currely open overlays */
let openOverlays: {[overlayId: string]: OpenOverlay[]} = {};

/** all open overlays height combined */
export function getCombinedOverlayHeight(overlayHolderId: string) {
  return openOverlays[overlayHolderId].reduce((pre, curr) => pre + curr.height, 0);
}

/** y offset to it's default y position */
function getOverlayOffset(overlayHolderId: string, rowIndex: number): number {
  return openOverlays[overlayHolderId].reduce((col, overlay) => {
    if (overlay.index < rowIndex) {
      return col + overlay.height;
    }
    return col;
  }, 0);
}

/**
 * closes on overlay - rerenders others internally
 */
export function closeOverlay(index: number, overlayHolder: SVGGElement,
                             accordionHeight: number, barEls: SVGGElement[]) {

  const overlayHolderId = overlayHolder.id;
  openOverlays[overlayHolderId].splice(openOverlays[overlayHolderId].reduce((prev: number, curr, i) => {
    return (curr.index === index) ? i : prev;
  }, -1), 1);

  renderOverlays(accordionHeight, overlayHolder);
  overlayChangesPubSub.publishToOverlayChanges({
    "combinedOverlayHeight": getCombinedOverlayHeight(overlayHolderId),
    "openOverlays": openOverlays[overlayHolderId],
    "overlayHolderId": overlayHolderId,
    "type" : "closed",
  } as OverlayChangeEvent, overlayHolder);
  realignBars(overlayHolderId, barEls);
}

/**
 * Opens an overlay - rerenders others internaly
 */
export function openOverlay(index: number, y: number, accordionHeight: number, entry: WaterfallEntry,
                            overlayHolder: SVGGElement, barEls: SVGGElement[]) {

  const overlayHolderId = overlayHolder.id;
  if (openOverlays[overlayHolderId] === undefined) {
    openOverlays[overlayHolderId] = [];
  }
  if (openOverlays[overlayHolderId].some((o) => o.index === index)) {
    return;
  }

  openOverlays[overlayHolderId].push({
    "defaultY": y,
    "entry": entry,
    "index": index,
    "onClose": () => {
      this.closeOverlay(index, overlayHolder, accordionHeight, barEls);
    },
  });

  renderOverlays(accordionHeight, overlayHolder);
  overlayChangesPubSub.publishToOverlayChanges({
    "combinedOverlayHeight": getCombinedOverlayHeight(overlayHolderId),
    "openOverlays": openOverlays[overlayHolderId],
    "overlayHolderId": overlayHolderId,
    "type" : "open",
  } as OverlayChangeEvent, overlayHolder);
  realignBars(overlayHolderId, barEls);
}

/**
 * sets the offset for request-bars
 * @param  {SVGGElement[]} barEls
 */
function realignBars(overlayHolderId: string, barEls: SVGGElement[]) {
  barEls.forEach((bar, j) => {
    let offset = getOverlayOffset(overlayHolderId, j);
    bar.style.transform = `translate(0, ${offset}px)`;
  });
}

 /**
  * removes all overlays and renders them again
  *
  * @summary this is to re-set the "y" position since there is a bug in chrome with
  * tranform of an SVG and positioning/scoll of a foreignObjects
  * @param  {number} accordionHeight
  * @param  {SVGGElement} overlayHolder
  */
function renderOverlays(accordionHeight: number, overlayHolder: SVGGElement) {
  const overlayHolderId = overlayHolder.id;
  while (overlayHolder.firstChild ) {
    overlayHolder.removeChild(overlayHolder.firstChild);
  }

  let currY = 0;
  openOverlays[overlayHolderId]
    .sort((a, b) => a.index > b.index ? 1 : -1)
    .forEach((overlay) => {
      let y = overlay.defaultY + currY;
      let infoOverlay = createRowInfoOverlay(overlay.index, y, accordionHeight,
        overlay.entry, overlay.onClose);
      // if overlay has a preview image show it
      let previewImg = infoOverlay.querySelector("img.preview") as HTMLImageElement;
      if (previewImg && !previewImg.src) {
        previewImg.setAttribute("src", previewImg.attributes.getNamedItem("data-src").value);
      }
      overlayHolder.appendChild(infoOverlay);

      let currHeight = infoOverlay.getBoundingClientRect().height;
      currY += currHeight;
      overlay.actualY = y;
      overlay.height = currHeight;
      return overlay;
    });
}

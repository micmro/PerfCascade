import {OpenOverlay, OverlayChangeEvent} from "../../typing/open-overlay.d"
import {createRowInfoOverlay} from "./svg-details-overlay"
import * as overlayChangesPubSub from "./overlay-changes-pub-sub"
import {WaterfallEntry} from "../../typing/waterfall";

/** Collection of currely open overlays */
let openOverlays: OpenOverlay[] = []

/** all open overlays height combined */
export function getCombinedOverlayHeight() {
  return openOverlays.reduce((pre, curr) => pre + curr.height, 0)
}

/** y offset to it's default y position */
export function getOverlayOffset(rowIndex: number): number {
  return openOverlays.reduce((col, overlay) => {
    if (overlay.index < rowIndex) {
      return col + overlay.height
    }
    return col
  }, 0)
}


/**
 * closes on overlay - rerenders others internally
 */
export function closeOverlay(index: number, overlayHolder: SVGGElement,
                             barX: number, accordionHeight: number, barEls: SVGGElement[], unit: number) {

  openOverlays.splice(openOverlays.reduce((prev: number, curr, i) => {
    return (curr.index === index) ? i : prev
  }, -1), 1)

  renderOverlays(barX, accordionHeight, overlayHolder, unit)
  overlayChangesPubSub.publishToOverlayChanges({
    "type" : overlayChangesPubSub.eventTypes.CLOSE,
    "openOverlays": openOverlays,
    "combinedOverlayHeight": getCombinedOverlayHeight()
  } as OverlayChangeEvent)
  realignBars(barEls)
}

/**
 * Opens an overlay - rerenders others internaly
 */
export function openOverlay(index: number, barX: number,  y: number, accordionHeight: number, block: WaterfallEntry,
  overlayHolder: SVGGElement, barEls: SVGGElement[], unit: number) {

  if (openOverlays.filter((o) => o.index === index).length > 0) {
    return
  }

  openOverlays.push({
    "index": index,
    "defaultY": y,
    "block": block,
    "onClose": () => {
      this.closeOverlay(index, overlayHolder, barX, accordionHeight, barEls, unit)
    }
  })

  renderOverlays(barX, accordionHeight, overlayHolder, unit)
  overlayChangesPubSub.publishToOverlayChanges({
    "type" : overlayChangesPubSub.eventTypes.OPEN,
    "openOverlays": openOverlays,
    "combinedOverlayHeight": getCombinedOverlayHeight()
  } as OverlayChangeEvent)
  realignBars(barEls)
}

/**
 * sets the offset for request-bars
 * @param  {SVGGElement[]} barEls
 */
function realignBars(barEls: SVGGElement[]) {
  barEls.forEach((bar, j) => {
    let offset = getOverlayOffset(j)
    bar.style.transform = `translate(0, ${offset}px)`
  })
}


 /**
  * removes all overlays and renders them again
  *
  * @summary this is to re-set the "y" position since there is a bug in chrome with
  * tranform of an SVG and positioning/scoll of a foreignObjects
  * @param  {number} barX
  * @param  {number} accordionHeight
  * @param  {SVGGElement} overlayHolder
  * @param  {number} unit
  */
function renderOverlays(barX: number, accordionHeight: number, overlayHolder: SVGGElement, unit: number) {
  while (overlayHolder.firstChild ) {
    overlayHolder.removeChild(overlayHolder.firstChild)
  }

  let currY = 0
  openOverlays
    .sort((a, b) => a.index > b.index ? 1 : -1)
    .forEach((overlay) => {
      let y = overlay.defaultY + currY
      let infoOverlay = createRowInfoOverlay(overlay.index, barX, y, accordionHeight, overlay.block, overlay.onClose, unit)
      //if overlay has a preview image show it
      let previewImg = infoOverlay.querySelector("img.preview") as HTMLImageElement
      if (previewImg && !previewImg.src) {
        previewImg.setAttribute("src", previewImg.attributes.getNamedItem("data-src").value)
      }
      overlayHolder.appendChild(infoOverlay)

      let currHeight = infoOverlay.getBoundingClientRect().height
      currY += currHeight
      overlay.actualY = y
      overlay.height = currHeight
      return overlay
    })
}

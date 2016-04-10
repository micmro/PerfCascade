import {OpenOverlay} from "../../typing/open-overlay"
import TimeBlock from "../../typing/time-block"
import {createRowInfoOverlay} from "./svg-details-overlay"

/** Collection of currely open overlays */
let openOverlays: OpenOverlay[] = []

export function getCombinedOverlayHeight() {
  return openOverlays.reduce((pre, curr) => pre + curr.height, 0)
}

export function getOverlayOffset(rowIndex: number): number {
  return openOverlays.reduce((col, overlay) => {
    if (overlay.index < rowIndex) {
      return col + overlay.height
    }
    return col
  }, 0)
}


export function closeOvelay(index: number, holder: SVGElement, overlayHolder: SVGGElement,
  barX: number, accordeonHeigh: number, barEls: SVGGElement[], unit: number) {

  openOverlays.splice(openOverlays.reduce((prev: number, curr, i) => {
    console.log(curr.index, index)
    return (curr.index === index) ? i : prev
  }, -1), 1)

  renderOverlays(barX, accordeonHeigh, overlayHolder, unit)
  reAlignBars(barEls)
}


export function openOverlay(index: number,
  barX: number,  y: number, accordeonHeight: number, block: TimeBlock,
  onClose: Function, overlayHolder: SVGGElement, barEls: SVGGElement[], unit: number) {

      if(openOverlays.filter((o) => o.index === index).length > 0){
        return
      }
      openOverlays.push({
        "index": index,
        "defaultY": y,
        "block": block,
        "onClose": onClose
      })

      renderOverlays(barX, accordeonHeight, overlayHolder, unit)
      reAlignBars(barEls)
}


function reAlignBars(barEls: SVGGElement[]) {
    barEls.forEach((bar, j) => {
      let offset = getOverlayOffset(j)
      bar.style.transform = `translate(0, ${offset}px)`
    })
}


function renderOverlays(barX: number, accordeonHeight: number, overlayHolder: SVGGElement, unit: number) {
      while (overlayHolder.firstChild ) {
        overlayHolder.removeChild(overlayHolder.firstChild)
      }

      // TODO :change to reduce
      let currY = 0;
      openOverlays
        .sort((a, b) => a.index > b.index ? 1 : -1)
        .map((overlay) => {
          let y = overlay.defaultY + currY
          let infoOverlay = createRowInfoOverlay(overlay.index, barX, y, accordeonHeight, overlay.block, overlay.onClose, unit)
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

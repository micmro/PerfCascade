import {OpenRowMeta} from "../../typing/open-row-meta"
import TimeBlock from "../../typing/time-block"
import {createRowInfoOverlay} from "./svg-details-overlay"

interface OpenOverlay {
  index: number
  defaultY: number
  block: TimeBlock
  onClose: Function
   /* instance  info **/
  actualY?: number
  height?: number
}


/** Collection of currely open overlays */
let openOverlays: OpenOverlay[] = []

export function getCombinedAccordeonHeight() {
  return openOverlays.reduce((pre, curr) => pre + curr.height, 0)
}

function getOverlayOffset(rowIndex: number): number {
  return openOverlays.reduce((col, overlay) => {
    if (overlay.index < rowIndex) {
      return col + overlay.height
    }
    return col
  }, 0)
}



export function closeOvelay(holder: SVGElement, overlayHolder: SVGGElement,
  barX: number, accordeonHeigh: number, barEls: SVGGElement[], unit: number) {
  openOverlays.splice(openOverlays.reduce((prev: number, curr, index) => {
    return (curr.index === index) ? index : prev
  }, -1))
  renderOverlays(barX, accordeonHeigh, overlayHolder, unit)
  renderBars(barEls)
}


export function openOverlay(index: number,
  barX: number,  y: number, accordeonHeight: number, block: TimeBlock,
  onClose: Function, overlayHolder: SVGGElement, barEls: SVGGElement[], unit: number) {

      openOverlays.push({
        "index": index,
        "defaultY": y,
        "block": block,
        "onClose": onClose
      })

      renderOverlays(barX, accordeonHeight, overlayHolder, unit)
      renderBars(barEls)
}


function renderBars(barEls: SVGGElement[]) {
    barEls.forEach((bar, j) => {
      let offset = getOverlayOffset(j)
      bar.style.transform = `translate(0, ${offset}px)`
      console.log(offset, bar.style.transform)
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

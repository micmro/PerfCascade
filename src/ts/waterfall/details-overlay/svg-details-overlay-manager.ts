import {OpenRowMeta} from "../../typing/open-row-meta"
import svg from "../../helpers/svg"
import dom from "../../helpers/dom"
import TimeBlock from "../../typing/time-block"
import {createDetailsBody} from "./html-details-body"
import {createRowInfoOverlay} from "./svg-details-overlay"


let openRows: OpenRowMeta[] = []

export function getCombinedAccordeonHeight() {
  return openRows.reduce((pre, curr) => pre + curr.height, 0)
}


export function closeOvelay(holder, overlayHolder: SVGGElement) {
  console.log(overlayHolder)
  overlayHolder.removeChild(holder)
  openRows.splice(openRows.reduce((prev: number, curr, index) => {
    return (curr.index === index) ? index : prev
  }, -1))
}

export function openOverlay(index: number,
  barX: number,  y: number, accordeonHeight: number, block: TimeBlock,
  onClose: Function, overlayHolder: SVGGElement, unit: number) {
      let infoOverlay = createRowInfoOverlay(index, barX, y, accordeonHeight, block, onClose, unit)

        //if overlay has a preview image show it
      let previewImg = infoOverlay.querySelector("img.preview") as HTMLImageElement
      if (previewImg && !previewImg.src) {
        previewImg.setAttribute("src", previewImg.attributes.getNamedItem("data-src").value)
      }
      overlayHolder.appendChild(infoOverlay)
      openRows = openRows.map(v => {
        v.height = v.el.getBoundingClientRect().height
        return v
      }).concat({
          "index": index,
          "y": y,
          "height": infoOverlay.getBoundingClientRect().height,
          "el": infoOverlay
        } as OpenRowMeta
      ).sort((a, b) => a.index > b.index ? 1 : -1)


            // let yOffset = getOverlayOffset(i, accordeonHeight)
      // openRows.push(i)
      // let combinedAccordeonHeight = accordeonHeight * openRows.length
      // let yPos = y + yOffset
      // // dom.removeAllChildren(overlayHolder)
      // // infoOverlay.style.marginTop = `${yOffset}px`
      // infoOverlay.style.transform = `translate(0, ${yOffset}px)`
      // // let fgnObj = infoOverlay.getElementsByTagName("foreignObject")[0] as SVGForeignObjectElement
      // // fgnObj.
      // // fgnObj. = `${yPos}px`
      // // fgnObj.y = `${ddd}px`

      // renderOverlays()

      positionOverlayVertically(infoOverlay, y, index, openRows)
      // console.log(infoOverlay.getBoundingClientRect().height)


}



export function getOverlayOffset(rowIndex: number, openRows: OpenRowMeta[]): number {
  return openRows.reduce((col, overlay) => {
    if (overlay.index < rowIndex) {
      return col + overlay.height
    }
    return col
  }, 0)
}



function positionOverlayVertically(infoOverlay: SVGGElement, y: number,
  rowIndex: number, openRows: OpenRowMeta[]) {
    let yOffset = getOverlayOffset(rowIndex, openRows)
    let combinedAccordeonHeight = getCombinedAccordeonHeight()
    let yPos = y + yOffset
    // dom.removeAllChildren(overlayHolder)
    // infoOverlay.style.marginTop = `${yOffset}px`
    // infoOverlay./


    infoOverlay.style.transform = `translate(0, ${yOffset}px)`


    let fgnObj = infoOverlay.getElementsByTagName("foreignObject")[0] as SVGForeignObjectElement

    let body = ((fgnObj.firstChild.firstChild) as HTMLBodyElement)
    let wrapper = body.children[0] as HTMLDivElement
    // console.log(body, wrapper)
    console.log(infoOverlay.getBoundingClientRect().height)


    // wrapper.style.height = "450px"
    // wrapper.style.overflow = "scroll"
    // body.
    // fgnObj.style.transform = `translate(0, ${yOffset}px)`
}


function renderOverlays(indexBackup: number,
  barX: number,  y: number, accordeonHeight: number, block: TimeBlock,
  onClose: Function, unit: number) {

    // TODO: re-reate all overlays
  // createRowInfoOverlay

}

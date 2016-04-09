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
let openRows: OpenRowMeta[] = []

/* TODO: use this instead of openrows? */
let openOverlays: OpenOverlay[] = []

export function getCombinedAccordeonHeight() {
  return openRows.reduce((pre, curr) => pre + curr.height, 0)
}


export function closeOvelay(holder, overlayHolder: SVGGElement) {
  console.log(overlayHolder)
  overlayHolder.removeChild(holder)
  openRows.splice(openRows.reduce((prev: number, curr, index) => {
    return (curr.index === index) ? index : prev
  }, -1))
  openOverlays.splice(openOverlays.reduce((prev: number, curr, index) => {
    return (curr.index === index) ? index : prev
  }, -1))
}

export function openOverlay(index: number,
  barX: number,  y: number, accordeonHeight: number, block: TimeBlock,
  onClose: Function, overlayHolder: SVGGElement, barEls: SVGGElement[], unit: number) {

      /**
       - store setup data
       - remove all other overlays
       - add they one by one
         - calculate new y
         - update height got next ones y

       */

      openOverlays.push({
        "index": index,
        "defaultY": y,
        "block": block,
        "onClose": close
      })



      renderOverlays(index, barX, y, accordeonHeight, block, onClose, overlayHolder, unit)
      renderBar(index, barEls)

      // positionOverlayVertically(infoOverlay, y, index)
      // console.log(infoOverlay.getBoundingClientRect().height)
}


function renderBar(i: number, barEls: SVGGElement[]) {
  let combinedAccordeonHeight = getCombinedAccordeonHeight()

    //TODO: calculate based on where in between multiple detail boxes this is
    barEls.forEach((bar, j) => {
      if (i < j) {
        bar.style.transform = `translate(0, ${combinedAccordeonHeight}px)`
      } else {
        bar.style.transform = "translate(0, 0)"
      }
    })
}


// function getOverlayOffset(rowIndex: number): number {
//   return openRows.reduce((col, overlay) => {
//     if (overlay.index < rowIndex) {
//       return col + overlay.height
//     }
//     return col
//   }, 0)
// }



// function positionOverlayVertically(infoOverlay: SVGGElement, y: number, rowIndex: number) {

//     let yOffset = getOverlayOffset(rowIndex)
//     let combinedAccordeonHeight = getCombinedAccordeonHeight()
//     let yPos = y + yOffset
//     // dom.removeAllChildren(overlayHolder)
//     // infoOverlay.style.marginTop = `${yOffset}px`
//     // infoOverlay./


//     infoOverlay.style.transform = `translate(0, ${yOffset}px)`


//     let fgnObj = infoOverlay.getElementsByTagName("foreignObject")[0] as SVGForeignObjectElement

//     let body = ((fgnObj.firstChild.firstChild) as HTMLBodyElement)
//     let wrapper = body.children[0] as HTMLDivElement
//     // console.log(body, wrapper)
//     console.log(infoOverlay.getBoundingClientRect().height)

//     // wrapper.style.height = "450px"
//     // wrapper.style.overflow = "scroll"
//     // body.
//     // fgnObj.style.transform = `translate(0, ${yOffset}px)`
// }


function renderOverlays(index: number,
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


    // TODO: re-reate all overlays
  // createRowInfoOverlay

}

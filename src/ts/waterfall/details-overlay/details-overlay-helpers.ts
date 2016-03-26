

export function getOverlayOffset(rowIndex: number, accordeonHeight: number, openRows: number[]): number {
  return openRows.reduce((col, overlayIndex) => {
    if (overlayIndex < rowIndex) {
      return col + accordeonHeight
    }
    return col
  }, 0)
}


export function positionOverlayVertically(infoOverlay: SVGGElement, y: number,
  rowIndex: number, accordeonHeight: number, openRows: number[]) {
    let yOffset = this.getOverlayOffset(rowIndex, accordeonHeight, openRows)
    let combinedAccordeonHeight = accordeonHeight * openRows.length
    let yPos = y + yOffset
    // dom.removeAllChildren(overlayHolder)
    // infoOverlay.style.marginTop = `${yOffset}px`
    infoOverlay.style.transform = `translate(0, ${yOffset}px)`
}
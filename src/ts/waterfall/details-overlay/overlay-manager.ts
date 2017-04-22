import { removeChildren } from "../../helpers/dom";
import { Context, OverlayManagerClass } from "../../typing/context";
import { OpenOverlay, OverlayChangeEvent } from "../../typing/open-overlay";
import { WaterfallEntry } from "../../typing/waterfall";
import { createRowInfoOverlay } from "./svg-details-overlay";

/** Overlay (popup) instance manager */
class OverlayManager implements OverlayManagerClass {
  /** Collection of currely open overlays */
  private openOverlays: OpenOverlay[] = [];

  // TODO: move `overlayHolder` to constructor
  constructor(private context: Context, private overlayHolder: SVGGElement) {

  }

  /** all open overlays height combined */
  public getCombinedOverlayHeight(): number {
    return this.openOverlays.reduce((pre, curr) => pre + curr.height, 0);
  }

  public getOpenOverlays() {
    return this.openOverlays;
  }

  /**
   * Opens an overlay - rerenders others internaly
   */
  public openOverlay(index: number, y: number, detailsHeight: number,
                     entry: WaterfallEntry, barEls: SVGGElement[]) {
    if (this.openOverlays.some((o) => o.index === index)) {
      return;
    }
    const self = this;
    const newOverlay: OpenOverlay = {
      "defaultY": y,
      "entry": entry,
      "index": index,
      "onClose": () => {
        self.closeOverlay(index, detailsHeight, barEls);
      },
      "openTabIndex": 0,
    };
    this.openOverlays.push(newOverlay);

    this.renderOverlays(detailsHeight);
    this.context.pubSub.publishToOverlayChanges({
      "changedIndex": index,
      "changedOverlay": newOverlay,
      "combinedOverlayHeight": self.getCombinedOverlayHeight(),
      "openOverlays": self.openOverlays,
      "type": "open",
    } as OverlayChangeEvent);
    this.realignBars(barEls);
  }

  /**
   * Toggles an overlay - rerenders others
   */
  public toggleOverlay(index: number, y: number, detailsHeight: number,
                       entry: WaterfallEntry, barEls: SVGGElement[]) {
    if (this.openOverlays.some((o) => o.index === index)) {
      this.closeOverlay(index, detailsHeight, barEls);
    } else {
      this.openOverlay(index, y, detailsHeight, entry, barEls);
    }
  }

  /**
   * closes on overlay - rerenders others internally
   */
  public closeOverlay(index: number, detailsHeight: number, barEls: SVGGElement[]) {
    const self = this;
    this.openOverlays.splice(this.openOverlays.reduce((prev: number, curr, i) => {
      return (curr.index === index) ? i : prev;
    }, -1), 1);

    this.renderOverlays(detailsHeight);
    this.context.pubSub.publishToOverlayChanges({
      "changedIndex": index,
      "combinedOverlayHeight": self.getCombinedOverlayHeight(),
      "openOverlays": self.openOverlays,
      "type": "closed",
    } as OverlayChangeEvent);
    this.realignBars(barEls);
  }

  /**
   * sets the offset for request-bars
   * @param  {SVGGElement[]} barEls
   */
  private realignBars(barEls: SVGGElement[]) {
    barEls.forEach((bar, j) => {
      let offset = this.getOverlayOffset(j);
      bar.setAttribute("transform", `translate(0, ${offset})`);
    });
  }

  /** y offset to it's default y position */
  private getOverlayOffset(rowIndex: number): number {
    return this.openOverlays.reduce((col, overlay) => {
      if (overlay.index < rowIndex) {
        return col + overlay.height;
      }
      return col;
    }, 0);
  }

  /**
   * removes all overlays and renders them again
   *
   * @summary this is to re-set the "y" position since there is a bug in chrome with
   * tranform of an SVG and positioning/scoll of a foreignObjects
   * @param  {number} detailsHeight
   * @param  {SVGGElement} overlayHolder
   */
  private renderOverlays(detailsHeight: number) {
    removeChildren(this.overlayHolder);

    let currY = 0;
    this.openOverlays
      .sort((a, b) => a.index > b.index ? 1 : -1)
      .forEach((overlay) => {
        let y = overlay.defaultY + currY;
        let infoOverlay = createRowInfoOverlay(overlay, y, detailsHeight);
        // if overlay has a preview image show it
        let previewImg = infoOverlay.querySelector("img.preview") as HTMLImageElement;
        if (previewImg && !previewImg.src) {
          previewImg.setAttribute("src", previewImg.attributes.getNamedItem("data-src").value);
        }
        this.overlayHolder.appendChild(infoOverlay);

        let currHeight = infoOverlay.getBoundingClientRect().height;
        currY += currHeight;
        overlay.actualY = y;
        overlay.height = currHeight;
        return overlay;
      });
  }
};
export {
  OverlayManager
};
export default OverlayManager;

import { forEachNodeList, removeChildren } from "../../helpers/dom";
import { find } from "../../helpers/misc";
import { Context, OverlayManagerClass } from "../../typing/context";
import { OpenOverlay, OverlayChangeEvent } from "../../typing/open-overlay";
import { WaterfallEntry } from "../../typing/waterfall";
import { createRowInfoOverlay } from "./svg-details-overlay";

/** Overlay (popup) instance manager */
class OverlayManager implements OverlayManagerClass {
  /** Collection of currely open overlays */
  private openOverlays: OpenOverlay[] = [];

  constructor(private context: Context, private rowHolder: SVGGElement) {

  }

  /** all open overlays height combined */
  public getCombinedOverlayHeight(): number {
    return this.openOverlays.reduce((pre, curr) => pre + curr.height, 0);
  }

  /**
   * Get ref to Overlay SVG Element in DOM.
   *
   * _Item might be re-drawn, when another Overlay is changed_
   */
  public getOpenOverlayDomEl(overlay: OpenOverlay) {
    return this.rowHolder.querySelector(`.overlay-index-${overlay.index}`) as SVGGElement;
  }

  /**
   * Get ref to the last (DOM element wise) Overlay SVG Element in DOM.
   *
   * _Item might be re-drawn, when another Overlay is changed_
   */
  public getLastOpenOverlayDomEl() {
    const overlays = this.rowHolder.querySelectorAll(".info-overlay-holder");
    return overlays.item(overlays.length - 1) as SVGGElement;
  }

  /**
   * Are any overlays currently open?
   */
  public hasOpenOverlays() {
    return this.openOverlays.length > 0;
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
    this.openOverlays = this.openOverlays.sort((a, b) => a.index > b.index ? 1 : -1);

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
    // removeChildren(this.rowHolder);

    let currY = 0;

    let updateHeight = (overlay, y, currHeight) => {
      currY += currHeight;
      overlay.actualY = y;
      overlay.height = currHeight;
    };

    let addNewOverlay = (overlayHolder: SVGGElement, overlay: OpenOverlay) => {
      let y = overlay.defaultY + currY;
      let infoOverlay = createRowInfoOverlay(overlay, y, detailsHeight);
      // if overlay has a preview image show it
      let previewImg = infoOverlay.querySelector("img.preview") as HTMLImageElement;
      if (previewImg && !previewImg.src) {
        previewImg.setAttribute("src", previewImg.attributes.getNamedItem("data-src").value);
      }
      overlayHolder.appendChild(infoOverlay);
      updateHeight(overlay, y, infoOverlay.getBoundingClientRect().height);
    };

    const rowItems = this.rowHolder.getElementsByClassName("row-item") as NodeListOf<SVGAElement>;
    forEachNodeList(rowItems, (rowItem, index) => {
      const overlay = find(this.openOverlays, (o) => o.index === index);
      let overlayEl = rowItem.nextElementSibling.firstElementChild as SVGGElement;
      if (overlay === undefined) {
        if (overlayEl) {
          // remove closed overlay
          removeChildren(rowItem.nextElementSibling);
        }
        return; // not open
      }
      if (overlayEl) {
        updateHeight(overlay, overlay.defaultY + currY, overlay.height);
        const fo = overlayEl.getElementsByTagName("foreignObject").item(0) as SVGForeignObjectElement;
        fo.setAttribute("y", overlay.actualY.toString());
        return;
      }
      addNewOverlay(rowItem.nextElementSibling as SVGGElement, overlay);
    });
  }
};
export {
  OverlayManager
};
export default OverlayManager;

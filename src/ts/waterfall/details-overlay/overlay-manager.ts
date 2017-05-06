import {
  getLastItemOfNodeList,
  getParentByClassName,
  removeChildren,
} from "../../helpers/dom";
import {
  find,
  isTabDown,
  isTabUp,
} from "../../helpers/misc";
import { Context } from "../../typing/context";
import { OpenOverlay, OverlayChangeEvent } from "../../typing/open-overlay";
import { WaterfallEntry } from "../../typing/waterfall";
import { createRowInfoOverlay } from "./svg-details-overlay";

/** Overlay (popup) instance manager */
class OverlayManager {
  private static showFullName = (el: Element) => {
    el.getElementsByClassName("row-fixed").item(0)
      .dispatchEvent(new MouseEvent("mouseenter"));
  }
  /**
   * Keypress Event handler for fist el in Overlay,
   * to manage highlighting of the element above
   */
  private static firstElKeypress = (evt: KeyboardEvent) => {
    if (isTabUp(evt)) {
      const par = getParentByClassName(evt.target as Element, "row-overlay-holder") as SVGGElement;
      if (par && par.previousElementSibling) {
        OverlayManager.showFullName(par.previousElementSibling);
      }
    }
  }

  /**
   * Keypress Event handler for last el in Overlay,
   * to manage highlighting of the element below
   */
  private static lastElKeypress = (evt: KeyboardEvent) => {
    if (isTabDown(evt)) {
      const par = getParentByClassName(evt.target as Element, "row-overlay-holder") as SVGGElement;
      if (par && par.nextElementSibling) {
        OverlayManager.showFullName(par.nextElementSibling);
      }
    }
  }

  /** Collection of currely open overlays */
  private openOverlays: OpenOverlay[] = [];

  constructor(private context: Context) {
  }

  /** all open overlays height combined */
  public getCombinedOverlayHeight(): number {
    return this.openOverlays.reduce((pre, curr) => pre + curr.height, 0);
  }

  /**
   * Opens an overlay - rerenders others internaly
   */
  public openOverlay(index: number, y: number, detailsHeight: number,
                     entry: WaterfallEntry, rowItems: SVGAElement[]) {
    if (this.openOverlays.some((o) => o.index === index)) {
      return;
    }
    const self = this;
    const newOverlay: OpenOverlay = {
      "defaultY": y,
      "entry": entry,
      "index": index,
      "onClose": () => {
        self.closeOverlay(index, detailsHeight, rowItems);
      },
      "openTabIndex": 0,
    };
    this.openOverlays.push(newOverlay);
    this.openOverlays = this.openOverlays.sort((a, b) => a.index > b.index ? 1 : -1);

    this.renderOverlays(detailsHeight, rowItems);
    this.context.pubSub.publishToOverlayChanges({
      "changedIndex": index,
      "combinedOverlayHeight": self.getCombinedOverlayHeight(),
      "type": "open",
    } as OverlayChangeEvent);
  }

  /**
   * Toggles an overlay - rerenders others
   */
  public toggleOverlay(index: number, y: number, detailsHeight: number,
                       entry: WaterfallEntry, rowItems: SVGAElement[]) {
    if (this.openOverlays.some((o) => o.index === index)) {
      this.closeOverlay(index, detailsHeight, rowItems);
    } else {
      this.openOverlay(index, y, detailsHeight, entry, rowItems);
    }
  }

  /**
   * closes on overlay - rerenders others internally
   */
  public closeOverlay(index: number, detailsHeight: number, rowItems: SVGAElement[]) {
    const self = this;
    this.openOverlays.splice(this.openOverlays.reduce((prev: number, curr, i) => {
      return (curr.index === index) ? i : prev;
    }, -1), 1);

    this.renderOverlays(detailsHeight, rowItems);
    this.context.pubSub.publishToOverlayChanges({
      "changedIndex": index,
      "combinedOverlayHeight": self.getCombinedOverlayHeight(),
      "type": "closed",
    } as OverlayChangeEvent);
  }

  /**
   * Sets the offset for a request-bar
   * @param {SVGAElement[]} rowItems
   * @param {number} offset
   */
  private realignRow = (rowItem: SVGAElement, offset: number) => {
    rowItem.setAttribute("transform", `translate(0, ${offset})`);
  }

  /**
   * Renders / Adjusts Overlays
   *
   * @summary this is to re-set the "y" position since there is a bug in chrome with
   * tranform of an SVG and positioning/scoll of a foreignObjects
   * @param  {number} detailsHeight
   * @param  {SVGAElement[]} rowItems
   */
  private renderOverlays(detailsHeight: number, rowItems: SVGAElement[]) {
    /** shared variable to keep track of heigth */
    let currY = 0;
    const updateHeight = (overlay, y, currHeight) => {
      currY += currHeight;
      overlay.actualY = y;
      overlay.height = currHeight;
    };

    const addNewOverlay = (overlayHolder: SVGGElement, overlay: OpenOverlay) => {
      const y = overlay.defaultY + currY;
      const infoOverlay = createRowInfoOverlay(overlay, y, detailsHeight);
      // if overlay has a preview image show it
      const previewImg = infoOverlay.querySelector("img.preview") as HTMLImageElement;
      if (previewImg && !previewImg.src) {
        previewImg.setAttribute("src", previewImg.attributes.getNamedItem("data-src").value);
      }
      infoOverlay.querySelector("a")
        .addEventListener("keydown", OverlayManager.firstElKeypress);
      getLastItemOfNodeList(infoOverlay.querySelectorAll("button"))
        .addEventListener("keydown", OverlayManager.lastElKeypress);
      overlayHolder.appendChild(infoOverlay);
      updateHeight(overlay, y, infoOverlay.getBoundingClientRect().height);
    };
    const updateRow = (rowItem: SVGAElement, index: number) => {
      const overlay = find(this.openOverlays, (o) => o.index === index);
      const overlayEl = rowItem.nextElementSibling.firstElementChild as SVGGElement;
      this.realignRow(rowItem, currY);

      if (overlay === undefined) {
        if (overlayEl) {
          // remove closed overlay
          rowItem.nextElementSibling.querySelector("a")
            .removeEventListener("keydown", OverlayManager.firstElKeypress);
          getLastItemOfNodeList(rowItem.nextElementSibling.querySelectorAll("button"))
            .removeEventListener("keydown", OverlayManager.lastElKeypress);
          removeChildren(rowItem.nextElementSibling);
        }
        return; // not open
      }
      if (overlayEl) {
        const bg = overlayEl.querySelector(".info-overlay-bg");
        const fo = overlayEl.querySelector("foreignObject");
        const btnRect = overlayEl.querySelector(".info-overlay-close-btn rect");
        const btnText = overlayEl.querySelector(".info-overlay-close-btn text");
        updateHeight(overlay, overlay.defaultY + currY, overlay.height);
        // needs updateHeight
        bg.setAttribute("y", overlay.actualY.toString());
        fo.setAttribute("y", overlay.actualY.toString());
        btnText.setAttribute("y", overlay.actualY.toString());
        btnRect.setAttribute("y", overlay.actualY.toString());
        return;
      }
      addNewOverlay(rowItem.nextElementSibling as SVGGElement, overlay);
    };
    rowItems.forEach(updateRow);
  }
}

export {
  OverlayManager,
};
export default OverlayManager;

import * as svg from "../helpers/svg";
import {OnPagingCb} from "../typing/paging";
import {WaterfallData, WaterfallDocs} from "../typing/waterfall";

/** Class to keep track of run of a multi-run har is beeing shown  */
export default class Paging {
  private selectedPageIndex = 0;
  private onPageUpdateCbs: OnPagingCb[] = [];

  constructor(private doc: WaterfallDocs) {

  }

  /**
   * Returns number of pages
   * @returns number - number of pages in current doc
   */
  public getPageCount(): number {
    return this.doc.pages.length;
  }

  /**
   * Returns selected pages
   * @returns WaterfallData - currently selected page
   */
  public getSelectedPage(): WaterfallData {
    return this.doc.pages[this.selectedPageIndex];
  }

  /**
   * Returns index of currently selected page
   * @returns number - index of current page (0 based)
   */
  public getSelectedPageIndex(): number {
    return this.selectedPageIndex;
  }

  /**
   * Update which pageIndex is currently update.
   * Published `onPageUpdate`
   * @param  {number} pageIndex
   */
  public setSelectedPageIndex(pageIndex: number) {
    if (this.selectedPageIndex === pageIndex) {
      return;
    }
    if (pageIndex < 0 || pageIndex >=  this.getPageCount()) {
      throw new Error("Page does not exist - Invalid pageIndex selected");
    }

    this.selectedPageIndex = pageIndex;
    let selectedPage = this.doc.pages[this.selectedPageIndex];
    this.onPageUpdateCbs.forEach((cb) => {
      cb(this.selectedPageIndex, selectedPage);
    });
  }

  /**
   * Register subscriber callbacks to be called when the pageindex updates
   * @param  {OnPagingCb} cb
   * @returns number - index of the callback
   */
  public onPageUpdate(cb: OnPagingCb): number {
    if (this.getPageCount() > 1) {
      return this.onPageUpdateCbs.push(cb);
    }
    return undefined;
  }

  /**
   * hooks up select box with paging options
   * @param  {HTMLSelectElement} selectbox
   */
  public initPagingSelectBox(selectbox: HTMLSelectElement) {
    const self = this;
    if (this.getPageCount() <= 1) {
      selectbox.style.display = "none";
      return;
    }
    // remove all existing options, like placeholders
    svg.removeChildren(selectbox);
    this.doc.pages.forEach((p, i) => {
      let option = new Option(p.title, i.toString(), i === this.selectedPageIndex);
      selectbox.add(option);
    });

    selectbox.style.display = "block";
    selectbox.addEventListener("change", (evt) => {
      let val = parseInt((evt.target as HTMLOptionElement).value, 10);
      self.setSelectedPageIndex(val);
    });
  }
}

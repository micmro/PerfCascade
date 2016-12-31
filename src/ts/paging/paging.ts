import {OnPagingCb} from "../typing/paging"
import {WaterfallData} from "../typing/waterfall"

import * as waterfallDocsService from "../state/waterfall-docs-service"

let selectedPageIndex = 0
let onPageUpdateCbs: OnPagingCb[] = []

/**
 * Returns number of pages
 * @returns number - number of pages in current doc
 */
export function getPageCount(): number {
  return waterfallDocsService.getDocs().pages.length
}

/**
 * Returns selected pages
 * @returns WaterfallData - currently selected page
 */
export function getSelectedPage(): WaterfallData {
  return waterfallDocsService.getDocs().pages[selectedPageIndex]
}

/**
 * Returns index of currently selected page
 * @returns number - index of current page (0 based)
 */
export function getSelectedPageIndex(): number {
  return selectedPageIndex
}

/**
 * Update which pageIndex is currently update.
 * Published `onPageUpdate`
 * @param  {number} pageIndex
 */
export function setSelectedPageIndex(pageIndex: number) {
  if (selectedPageIndex === pageIndex) {
    return
  }
  if (pageIndex < 0 || pageIndex >=  getPageCount()) {
    throw new Error("Page does not exist - Invalid pageIndex selected")
  }

  selectedPageIndex = pageIndex
  let selectedPage = waterfallDocsService.getDocs().pages[selectedPageIndex]
  onPageUpdateCbs.forEach((cd) => {
    cd(selectedPageIndex, selectedPage)
  })
}

/**
 * Register subscriber callbacks to be called when the pageindex updates
 * @param  {OnPagingCb} cb
 * @returns number - index of the callback
 */
export function onPageUpdate(cb: OnPagingCb): number {
  if (getPageCount() > 1) {
    return onPageUpdateCbs.push(cb)
  }
  return undefined
}

/**
 * hooks up select box with paging options
 * @param  {HTMLSelectElement} selectbox
 */
export function initPagingSelectBox(selectbox: HTMLSelectElement) {
  if (getPageCount() <= 1) {
    return
  }
  waterfallDocsService.getDocs().pages.forEach((p, i) => {
    let option = new Option(p.title, i.toString(), i === selectedPageIndex)
    selectbox.add(option)
  })

  selectbox.style.display = "block"
  selectbox.addEventListener("change", (evt) => {
    let val = parseInt((evt.target as HTMLOptionElement).value, 10)
    setSelectedPageIndex(val)
  })
}

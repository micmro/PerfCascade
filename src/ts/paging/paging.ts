import {onPagingCb} from "../typing/paging.d"
import {WaterfallData} from "../typing/waterfall-data.d"

import * as waterfallDocsStore from "../state/waterfall-docs-store"


let selectedPageIndex = 0
let onPageUpdateCbs: Array<onPagingCb> = []

/**
 * Returns number of pages
 * @returns number - number of pages in current doc
 */
export function getPageCount(): number {
  return waterfallDocsStore.getDocs().pages.length
}

/**
 * Returns selected pages
 * @returns WaterfallData - currerently selected page
 */
export function getSelectedPage(): WaterfallData {
  return waterfallDocsStore.getDocs().pages[selectedPageIndex]
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
  let selectedPage = waterfallDocsStore.getDocs().pages[selectedPageIndex]
  onPageUpdateCbs.forEach(cd => {
    cd(selectedPageIndex, selectedPage)
  })
}

/**
 * Register subscriber callbacks to be called when the pageindex updates
 * @param  {onPagingCb} cb
 * @returns number - index of the callback
 */
export function onPageUpdate(cb: onPagingCb): number {
  if (getPageCount() > 1) {
    return onPageUpdateCbs.push(cb)
  }
  return undefined
}

export interface ChartOptions {
  /** Height of every request bar block plus spacer pixel (in px) */
  rowHeight?: number
  /** show vertical lines to easier spot potential dependencies/blocking between requests */
  showAlignmentHelpers?: boolean
  /** show mime type icon on the left */
  showMimeTypeIcon?: boolean
  /** show warning icons for potential issues on the left */
  showIndicatorIcons?: boolean
  /** relative width of the info column on the left (in percent) */
  leftColumnWith: number
  /** select element to use for paging  */
  pageSelector?: HTMLSelectElement
  /** element that holds the Legend (if not set no Legend is shown) */
  legendHolder?: HTMLElement
}

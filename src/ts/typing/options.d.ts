export interface ChartOptions {
  /** Height of every request bar block plus spacer pixel (in px) */
  rowHeight?: number
  /** show verticale lines to easier spot potential dependencies/blocking between requests */
  showAlignmentHelpers?: boolean
  /** show warning icons for potential issues on the left */
  showIndicatorIcons?: boolean
  /** relative width of the info column on the left (in percent) */
  leftColumnWith: number
}

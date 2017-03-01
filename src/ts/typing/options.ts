export interface ChartOptions {
  /** Height of every request bar block plus spacer pixel (in px) */
  rowHeight: number;
  /** Show vertical lines to easier spot potential dependencies/blocking between requests */
  showAlignmentHelpers: boolean;
  /** Show mime type icon on the left */
  showMimeTypeIcon: boolean;
  /** Show warning icons for potential issues on the left */
  showIndicatorIcons: boolean;
  /** Relative width of the info column on the left (in percent) */
  leftColumnWith: number;
  /** Select element to use for paging (if not set no Selector is rendered)   */
  pageSelector: HTMLSelectElement;
  /** Zero-based index of the pre-selected page */
  selectedPage: number;
  /** Element that holds the Legend (if not set no Legend is sendered) */
  legendHolder: HTMLElement;
}

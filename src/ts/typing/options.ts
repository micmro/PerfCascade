import { WaterfallDocs } from "./waterfall";

export interface ChartRenderOption {
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
  /** Callback called when the HAR doc has been parsed into PerfCascases */
  onParsed: (data: WaterfallDocs) => void;
  /** Set a row max time in ms (if not set the time is calculated from the HAR)  */
  rowMaxTimeInMs: number;
}

export interface HarTransformerOptions {
  /** Should UserTimings in WPT be used and rendered as Mark (default: false) */
  showUserTiming: boolean | string[];
  /**
   * If this is enabled, the `endTimer-*` marker are shown,
   * and both start and end show the full `startTimer-*` and `endTimer-*` name. (default: false)
   *
   * _requires `showUserTiming` to be `true`_
   */
  showUserTimingEndMarker: boolean;
}

/** TypeDefinition for `fromHar`'s options */
export type ChartOptions = Partial<ChartRenderOption & HarTransformerOptions>;

export type TimingType = "blocked" | "dns" | "connect" | "send" | "wait" | "receive" | "ssl";
export type RequestType = "other" | "image" | "video" | "audio" | "font" | "svg" |  "html" |
  "plain" | "css" | "javascript" | "flash";

export type IndicatorType = "error" | "warning" | "info";

export type IndicatorDisplayType = "icon" | "inline";

/** Typing for a event, e.g. UserTiming API performance mark from WPT */
export interface UserTiming {
  duration?: number;
  name: string;
  startTime: number;
}

/** Type for a time-marker, e.g. the firing of an event */
export interface Mark extends UserTiming {
  /** custom data to store x position */
  x?: number;
}

/** Representation of one loaded resource  */
export interface WaterfallEntry {
  total: number;
  /** URL of the resource entry */
  url: string;
  /** Start time in ms - relative to initial document request */
  start: number;
  /** End time in ms - relative to initial document request */
  end: number;
  /** time segments (dns, tls/ssl, connect...) */
  segments: WaterfallEntryTiming[];
  /** Resource-type icon  */
  responseDetails: WaterfallResponseDetails;
  /** Tabs to render in the details-overlay view */
  tabs: WaterfallEntryTab[];
}

export type TabRenderer = (detailsHeight: number) => string;

/** Represents a single tab of a `WaterfallEntry` */
export interface WaterfallEntryTab {
  /** Tab title to show in tab-menu */
  title: string;
  /** stringified tab HTML */
  content?: string;
  /** lazy evaluation to create stringified tab HTML */
  renderContent?: TabRenderer;
  /** Add an additional CSS class-name to the tab */
  tabClass?: string;
}

/** Type for issues of a request */
export interface WaterfallEntryIndicator {
  /** Issue ID e.g. `noTls`, used for CSS class */
  id: string;
  /** name of icon to use (member of `helpers/icons`) -
   * falls back to `type` if not defined
   */
  icon?: string;
  /** short title describing indicator */
  title: string;
  /** long description e.g. for details overlay view */
  description: string;
  /** categorizes the indicator */
  type: IndicatorType;
  /** where to show the indicator, defaults to `"icon"` */
  displayType: IndicatorDisplayType;
}

export interface Chunk {
  /** float - timestamp of beginning of chunk */
  ts: number;
  /** integer - encoded data length (sum = _bytesIn) */
  bytes: number;
}

/** Time segment of an `WaterfallEntry` */
export interface WaterfallEntryTiming {
  /** total duration in ms */
  total: number;
  type: TimingType;
  /** start time in ms - relative to initial document request */
  start: number;
  /** end time in ms - relative to initial document request */
  end: number;
  chunks?: Chunk[];
}

export interface WaterfallResponseDetails {
  /** HTTP response status code */
  statusCode: number;
  /** Response Type Icon (e.g. Mime type) */
  icon: Icon;
  /** Warnings, Errors and Info indicators  */
  indicators: WaterfallEntryIndicator[];
  /** CSS class to use for row */
  rowClass?: string;
  /** media type category */
  requestType: RequestType;
}

/** Type data used to rendering a single waterfall diagram */
export interface WaterfallData {
  /** Page title */
  title: string;
  /** time to load all contained entries (in ms) */
  durationMs: number;
  /** Array of requests */
  entries: WaterfallEntry[];
  /** special time marker e.g. `onLoad` */
  marks: Mark[];
  /** indicates if the parent document is loaded with TLS or SSL */
  docIsTLS: boolean;
}

/** Type for a series of waterfall diagrams */
export interface WaterfallDocs {
  /** Series of waterfalls (e.g. multiple page-views) */
  pages: WaterfallData[];
}

/**
 * Interface for `Icon` metadata
 * (e.g. warning and response type icons)
 */
export interface Icon {
  /** Icon types (as in `helpers/icons.ts`) */
  type: string;
  /** title for icon */
  title: string;
  /** width of icon in px */
  width: number;
}

/** Key/Value pair in array `["key", "value"]` */
export type KvTuple = [string, string | undefined];
/** Key/Value pair in array `["key", "value"]` that promises to have both strings defined */
export type SafeKvTuple = [string, string];

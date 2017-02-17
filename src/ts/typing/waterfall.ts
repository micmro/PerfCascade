import {Entry} from "./har";

export type TimingType = "blocked" | "dns" | "connect" | "send" | "wait" | "receive" | "ssl";
export type RequestType = "other" | "image" | "video" | "audio" | "font" | "svg" |  "html" |
  "plain" | "css" | "javascript" | "flash";

export type IndicatorType = "error" | "warning" | "info";

export interface UserTiming {
  duration?: number;
  name: string;
  startTime: number;
}

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
  /** raw e.g. HAR entry */
  rawResource: Entry;
  /** media type category */
  requestType: RequestType;
  /** Warnings, Errors and Info indicators  */
  indicators: WaterfallEntryIndicator[];
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
  /** catrgorizes the indicator */
  type: IndicatorType;
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
}

export interface WaterfallData {
  title: string;
  durationMs: number;
  entries: WaterfallEntry[];
  marks: Mark[];
  lines: WaterfallEntry[];
  /** indicates if the parent document is loaded with TLS or SSL */
  docIsTLS: boolean;
}

export interface WaterfallDocs {
  pages: WaterfallData[];
}

import {Entry} from "./har";

export type TimingType = "blocked" | "dns" | "connect" | "send" | "wait" | "receive" | "ssl"
export type RequestType = "other" | "image" | "video" | "audio" | "font" | "svg" |  "html" | "plain" | "css" | "javascript" | "flash"

interface UserTiming {
  duration?: number
  name: string
  startTime: number
}

export interface Mark extends UserTiming {
  /** custom data to store x position */
  x?: number
}

export interface WaterfallEntry {
  total: number
  name: string,
  start: number,
  end: number,
  cssClass: string,
  segments: Array<WaterfallEntryTiming>,
  rawResource: Entry,
  requestType: RequestType
}

export interface WaterfallEntryTiming {
  total: number
  type: TimingType,
  start: number,
  end: number,
  cssClass: string
}

export interface WaterfallData {
  title: string,
  durationMs: number,
  blocks: Array<WaterfallEntry>,
  marks: Array<Mark>,
  lines: Array<WaterfallEntry>
}

export interface WaterfallDocs {
  pages: Array<WaterfallData>
}

import {Entry} from "./har";

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
  requestType: string
}

export interface WaterfallEntryTiming {
  total: number
  name: string,
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

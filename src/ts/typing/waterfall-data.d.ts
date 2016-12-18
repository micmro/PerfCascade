import { WaterfallEntry } from "../typing/time-block"

interface UserTiming {
  duration?: number
  name: string
  startTime: number
}

export interface Mark extends UserTiming {
  /** custom data to store x position */
  x?: number
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

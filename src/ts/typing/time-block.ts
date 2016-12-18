import {Entry} from "./har.d"

export class WaterfallEntry {
  public total: number
  constructor(
      public name: string,
      public start: number,
      public end: number,
      public cssClass: string = "",
      public segments: Array<WaterfallEntry> = [],
      public rawResource?: Entry,
      public requestType?: string
    ) {
    this.total = (typeof start !== "number" || typeof end !== "number") ? undefined : (end - start)
  }
}

import {Entry} from "./har.d"

export class WaterfallEntry {
  public total: number
  constructor(
      public name: string,
      public start: number,
      public end: number,
      public cssClass: string = "",
      public segments: Array<WaterfallEntryTiming> = [],
      public rawResource: Entry,
      public requestType: string
    ) {
    this.total = (typeof start !== "number" || typeof end !== "number") ? undefined : (end - start)
  }
}

export class WaterfallEntryTiming {
  public total: number
  constructor(
    public name: string,
    public start: number,
    public end: number,
    public cssClass: string = "",
  ) {
    this.total = (typeof start !== "number" || typeof end !== "number") ? undefined : (end - start)
  }
}

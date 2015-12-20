export default class TimeBlock{
  public total: number
  constructor(public name, public start: number, public end: number, public cssClass, public segments, public rawResource) {
    this.total = (typeof start !== "number" || typeof end !== "number") ? undefined : (end - start)
  }
}
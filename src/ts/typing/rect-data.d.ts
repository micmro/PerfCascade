/**
 * Interface for `createRect` parameter
 */
export interface RectData {
  width: number
  height: number
  x: number
  y: number
  cssClass: string
  label?: string
  unit: number
  /** @type {Function} Partially appliable function (to capture row data) that return an event listener */
  showOverlay: Function
  /** @type {Function} Partially appliable function (to capture row data) that return an event listener */
  hideOverlay: Function
}

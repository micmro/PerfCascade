/**
 * Interface for `createRect` parameter
 */
export interface RectData {
  width: number;
  height: number;
  x: number;
  y: number;
  cssClass: string;
  label?: string;
  unit: number;
  /** @type {Function} Partially applicable function (to capture row data) that return an event listener */
  showOverlay?: (rectData: RectData) => EventListener;
  /** @type {Function} Partially applicable function (to capture row data) that return an event listener */
  hideOverlay?: (rectData: RectData) => EventListener;
}

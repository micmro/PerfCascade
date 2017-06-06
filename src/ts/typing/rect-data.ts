/**
 * Interface for `createRect` parameter
 */
export interface RectData {
  /** duration in ms */
  width: number;
  /** height in px */
  height: number;
  x: number;
  y: number;
  cssClass: string;
  /** Label to show in the tooltip */
  label?: string;
  /** horizontal unit (duration in ms of 1%) */
  unit: number;
  /** @type {Function} Partially applicable function (to capture row data) that return an event listener */
  showOverlay?: (rectData: RectData) => EventListener;
  /** @type {Function} Partially applicable function (to capture row data) that return an event listener */
  hideOverlay?: (rectData: RectData) => EventListener;
}

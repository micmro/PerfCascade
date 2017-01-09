import {WaterfallEntry} from "./waterfall";

export type OnCloseFn = (indexBackup: number, holder: SVGElement) => void;

export interface OpenOverlay {
  index: number;
  defaultY: number;
  entry: WaterfallEntry;
  onClose: OnCloseFn;
   /* instance  info **/
  actualY?: number;
  height?: number;
}

export interface OverlayChangeEvent {
  type: EventType;
  /** list of currenly open overlays */
  openOverlays: OpenOverlay[];
  combinedOverlayHeight: number;
  /** unique id to identify of the overlay holder to identify the chart */
  overlayHolderId: string;
}

/**
 * @param  {OverlayChangeEvent} change - overlay change event
 * @param  {SVGSVGElement} chartBaseEl - base chart element of the chart instance that has triggered the update
 * @returns void
 */
export type OverlayChangeSubscriber = (change: OverlayChangeEvent, chartBaseEl: SVGSVGElement) => void;

export type EventType = "closed" | "open";

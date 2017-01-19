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
}

/**
 * @param  {OverlayChangeEvent} change - overlay change event
 * @returns void
 */
export type OverlayChangeSubscriber = (change: OverlayChangeEvent) => void;

export type EventType = "closed" | "open";

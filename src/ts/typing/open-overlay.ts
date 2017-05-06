import { WaterfallEntry } from "./waterfall";

export type OnCloseFn = (overlayIndex: number) => void;

/** Metadata to describe open overlays */
export interface OpenOverlay {
  /** index of row (request) associated with overlay  */
  index: number;
  /** default Y position of overlay if no overlay is opened */
  defaultY: number;
  /** data of row */
  entry: WaterfallEntry;
  /** callback called when closing overlay */
  onClose: OnCloseFn;
  /** current y position */
  actualY?: number;
  /** current visible height of the overlay in px */
  height?: number;
  /** index of the currently opened tab of the overlay */
  openTabIndex?: number;
}

export interface OverlayChangeEvent {
  type: EventType;
  /** index that triggerd the change */
  changedIndex?: number;
  combinedOverlayHeight: number;
}

/**
 * @param  {OverlayChangeEvent} change - overlay change event
 * @returns void
 */
export type OverlayChangeSubscriber = (change: OverlayChangeEvent) => void;

export type EventType = "closed" | "open";

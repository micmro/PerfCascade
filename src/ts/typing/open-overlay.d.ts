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
  type: string;
  openOverlays: OpenOverlay[];
  combinedOverlayHeight: number;
}

export interface OverlayChangeSubscriber {
  (change: OverlayChangeEvent): void;
}

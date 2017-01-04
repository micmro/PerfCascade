import {WaterfallEntry} from "./waterfall";

export interface OpenOverlay {
  index: number;
  defaultY: number;
  entry: WaterfallEntry;
  onClose: Function;
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

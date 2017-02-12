import {OverlayChangeEvent, OverlayChangeSubscriber} from "./open-overlay";
import {ChartOptions} from "./options";
import {WaterfallEntry} from "./waterfall";

/**
 * Context object that is passed to (usually stateless) child-functions
 * to inject state and dependencies
 */
export interface Context {
  /** Publish and Subscribe instance for overlay updates */
  pubSub: PubSubClass;
  /** Overlay (popup) instance manager */
  overlayManager: OverlayManagerClass;
  /** horizontal unit (duration in ms of 1%) */
  unit: number;
  /** height of the requests part of the diagram in px */
  diagramHeight: number;
  /** Chart config/customization options */
  options: ChartOptions;
}

export interface PubSubClass {
  subscribeToOverlayChanges: (fn: OverlayChangeSubscriber) => void;
  publishToOverlayChanges: (change: OverlayChangeEvent) => void;
}

export interface OverlayManagerClass {
  /** all open overlays height combined */
  getCombinedOverlayHeight: () => number;

  /** Opens an overlay - rerenders others  */
  openOverlay: (index: number, y: number, accordionHeight: number, entry: WaterfallEntry,
                              barEls: SVGGElement[]) => void;
  /** toggles an overlay - rerenders others  */
  toggleOverlay: (index: number, y: number, accordionHeight: number, entry: WaterfallEntry,
                              barEls: SVGGElement[]) => void;

  /** closes on overlay - rerenders others internally */
  closeOverlay: (index: number, accordionHeight: number, barEls: SVGGElement[]) => void;

  // constructor(context: Context, overlayHolder: SVGGElement);
}

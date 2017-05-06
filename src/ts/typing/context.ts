import { OverlayManager } from "../waterfall/details-overlay/overlay-manager";
import { PubSub } from "../waterfall/details-overlay/pub-sub";
import { ChartRenderOption } from "./options";

/**
 * Context object that is passed to (usually stateless) child-functions
 * to inject state and dependencies
 */
export interface Context {
  /** Publish and Subscribe instance for overlay updates */
  pubSub: PubSub;
  /** Overlay (popup) instance manager */
  overlayManager: OverlayManager;
  /** horizontal unit (duration in ms of 1%) */
  unit: number;
  /** height of the requests part of the diagram in px */
  diagramHeight: number;
  /** Chart config/customization options */
  options: ChartRenderOption;
}

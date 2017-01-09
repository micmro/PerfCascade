// simple pub/sub for change to the overlay

import {getBaseEl} from "../../helpers/svg";
import {OverlayChangeEvent, OverlayChangeSubscriber} from "../../typing/open-overlay";

let subscribers: OverlayChangeSubscriber[] = [];

export function subscribeToOverlayChanges(fn: OverlayChangeSubscriber) {
  subscribers.push(fn);
}

// no need for unsubscribe in the moment

export function publishToOverlayChanges(change: OverlayChangeEvent, overlayHolder: SVGGElement) {
  let eventChartBaseEl = getBaseEl(overlayHolder);
  subscribers.forEach((fn) => fn(change, eventChartBaseEl));
};

// simple pub/sub for change to the overlay

import {OverlayChangeEvent, OverlayChangeSubscriber} from "../../typing/open-overlay";

export const eventTypes = {
  "OPEN" : "open",
  "CLOSE" : "closed",
};

let subscribers: OverlayChangeSubscriber[] = [];

export function subscribeToOverlayChanges(fn: OverlayChangeSubscriber) {
  subscribers.push(fn);
}

// no need for unsubscribe in the moment

export function publishToOverlayChanges(change: OverlayChangeEvent) {
  subscribers.forEach((fn) => fn(change));
}

// simple pub/sub for change to the overlay
import {PubSubClass} from "../../typing/context";
import {OverlayChangeEvent, OverlayChangeSubscriber} from "../../typing/open-overlay";

export default class PubSub implements PubSubClass {
  private subscribers: OverlayChangeSubscriber[] = [];

  public subscribeToOverlayChanges(fn: OverlayChangeSubscriber) {
    this.subscribers.push(fn);
  }

  public publishToOverlayChanges(change: OverlayChangeEvent) {
    this.subscribers.forEach((fn) => fn(change));
  }
};

// simple pub/sub for change to the overlay
import { OverlayChangeEvent, OverlayChangeSubscriber } from "../../typing/open-overlay";

class PubSub {
  private subscribers: OverlayChangeSubscriber[] = [];

  /** Call `fn` whenever a new change is publisched on OverlayChanges channel */
  public subscribeToOverlayChanges(fn: OverlayChangeSubscriber) {
    this.subscribers.push(fn);
  }

  /**
   * Call `fn` whenever a new change for `index` are publisched
   * on OverlayChanges channel
   */
  public subscribeToSpecificOverlayChanges(index: number, fn: OverlayChangeSubscriber) {
    this.subscribers.push((evt) => {
      if (evt.changedIndex === index) {
        fn(evt);
      }
    });
  }

  /** Publish a change on OverlayChanges channel  */
  public publishToOverlayChanges(change: OverlayChangeEvent) {
    this.subscribers.forEach((fn) => fn(change));
  }
};

export {
  PubSub
}
export default PubSub;

import { IEventBus } from './IEventBus';

/**
 * Abstract base class for all event handlers.
 *
 * Automatically subscribes to events upon instantiation.
 * Concrete implementations must define the event subscription logic
 * by implementing the `subscribe` method.
 */
export abstract class EventHandler {
  /**
   * Initializes a new EventHandler and triggers the subscription setup.
   * @param eventBus The event bus used to subscribe to application events.
   */
  constructor(protected eventBus: IEventBus) {
    this.subscribe(eventBus);
  }

  /**
   * Abstract method that concrete classes must implement to subscribe to specific events.
   * @param eventBus The event bus used for event subscriptions.
   */
  protected abstract subscribe(eventBus: IEventBus): void;
}

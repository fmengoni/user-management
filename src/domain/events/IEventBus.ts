import { IEvent } from './IEvent';

/**
 * Defines the contract for an Event Bus system.
 *
 * An Event Bus is responsible for publishing and subscribing to events
 * within an application, enabling decoupled communication between components.
 */
export interface IEventBus {
  /**
   * Publishes an event to all subscribed handlers.
   *
   * @param event - The event object to be published.
   * @returns A promise that resolves once all handlers have processed the event.
   */
  publish(event: IEvent): Promise<void>;

  /**
   * Subscribes a handler function to a specific event name.
   *
   * @param eventName - The name of the event to subscribe to.
   * @param handler - The asynchronous function that will be called when the event is published.
   */
  subscribe(eventName: string, handler: (event: IEvent) => Promise<void>): void;
}

/**
 * Represents a generic event within the event-driven system (Event Bus).
 */
export interface IEvent {
  /**
   * The name or identifier of the event.
   *
   * Used to subscribe to or publish specific events.
   * Example: `'user::created'`, `'login::done'`.
   */
  name: string;

  /**
   * The data associated with the event.
   *
   * Contains all necessary information for event handlers to process the event.
   */
  payload: any;

  /**
   * The timestamp when the event was created.
   *
   * If not provided, it can be automatically assigned when the event is published.
   */
  timestamp?: Date;
}

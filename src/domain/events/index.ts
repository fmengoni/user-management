/* eslint-disable no-var */
import { IEventBus } from './IEventBus';

declare global {
  var eventBus: () => IEventBus | undefined;
}

export function setEventBusGetter(getter: () => IEventBus) {
  global.eventBus = getter;
}

export function getEventBus(): IEventBus {
  const getBus = global.eventBus;
  const eventBus = getBus();
  if (!eventBus) throw new Error('IEventBus getter not set');

  return eventBus;
}

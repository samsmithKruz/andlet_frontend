import type { Dispatcher, QueueActionType } from "../types";

const dispatchers = new Map<QueueActionType, Dispatcher>();

export function registerDispatcher<T extends QueueActionType>(
  dispatcher: Dispatcher<T>,
): void {
  if (dispatchers.has(dispatcher.type)) {
    console.warn(
      `Dispatcher for type "${dispatcher.type}" is being overwritten`,
    );
  }
  dispatchers.set(dispatcher.type, dispatcher as Dispatcher);
}

export function getDispatcher(type: QueueActionType): Dispatcher | undefined {
  return dispatchers.get(type);
}

export function getAllDispatchers(): Map<QueueActionType, Dispatcher> {
  return dispatchers;
}

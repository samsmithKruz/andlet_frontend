import type {
  QueueActionType,
  QueueActionPayload,
  QueueActionResult,
} from "../types";
import {
  preferenceFetchDispatcher,
  preferenceUpdateDispatcher,
} from "./preference-update";
import { getDispatcher, registerDispatcher } from "./handlers";

export async function dispatchAction(
  type: QueueActionType,
  payload: QueueActionPayload,
): Promise<QueueActionResult> {
  const dispatcher = getDispatcher(type);

  if (!dispatcher) {
    return {
      success: false,
      error: new Error(`No dispatcher registered for action type: ${type}`),
    };
  }

  try {
    return await dispatcher.execute(payload);
  } catch (error) {
    return {
      success: false,
      error: error as Error,
    };
  }
}

[preferenceUpdateDispatcher, preferenceFetchDispatcher].forEach((item) =>
  registerDispatcher(item),
);

// src/lib/queue/types.ts

export type QueueActionType = string;

export interface QueueActionPayload {
  [key: string]: any;
}

export interface QueueActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: Error;
}

export interface Dispatcher<T extends QueueActionType = string, P = any> {
  type: T;
  execute: (payload: P) => Promise<QueueActionResult>;
}
import api from "@/lib/axios";
import type { Dispatcher } from "../types";

export const preferenceUpdateDispatcher: Dispatcher<
  "preference-update",
  {
    theme?: "light" | "dark" | "system";
    notifications?: boolean;
    language?: "en" | "fr" | "pt";
  }
> = {
  type: "preference-update",
  execute: async (payload) => {
    const response = await api.patch("/user/preferences", payload);
    return { success: true, data: response.data };
  },
};

export const preferenceFetchDispatcher: Dispatcher<
  "preference-fetch",
  Record<string, never>
> = {
  type: "preference-fetch",
  execute: async () => {
    const response = await api.get("/user/preferences");
    return { success: true, data: response.data };
  },
};

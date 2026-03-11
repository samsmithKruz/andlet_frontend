import { toast } from "sonner";
import type { ExternalToast } from "sonner";

export const showToast = {
  success: (message: string, options?: ExternalToast) => {
    toast.success(message, options);
  },
  error: (message: string, options?: ExternalToast) => {
    toast.error(message, options);
  },
  info: (message: string, options?: ExternalToast) => {
    toast.info(message, options);
  },
  warning: (message: string, options?: ExternalToast) => {
    toast.warning(message, options);
  },
  custom: (message: string, options?: ExternalToast) => {
    toast(message, options);
  },
};

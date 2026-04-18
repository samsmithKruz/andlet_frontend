import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<void> | null = null;

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshTokens, logout } = useAuthStore.getState();

    // Prevent infinite loop if refresh endpoint itself returns 401
    if (originalRequest.url?.includes("/refresh")) {
      logout();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshTokens().finally(() => {
            refreshPromise = null;
          });
        }

        await refreshPromise;

        const newToken = useAuthStore.getState().accessToken;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

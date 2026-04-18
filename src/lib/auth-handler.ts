import { useAuthStore } from "@/stores/authStore";

export function handleAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const error = params.get("error");

  if (error) {
    console.error("Auth error:", error);
    return false;
  }

  if (token) {
    try {
      // Parse the token payload
      const payload = JSON.parse(atob(token));

      // Set auth state
      useAuthStore.setState({
        accessToken: payload.access_token,
        refreshToken: payload.refresh_token,
        user: payload.user,
        permissions: payload.permissions || [],
        subscription: payload.subscription || null,
        isAuthenticated: true,
        isLoading: false,
      });

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Redirect to saved path
      const redirectPath = localStorage.getItem("auth_redirect_path") || "/";
      localStorage.removeItem("auth_redirect_path");

      return redirectPath;
    } catch (e) {
      console.error("Failed to parse auth token", e);
    }
  }

  return null;
}

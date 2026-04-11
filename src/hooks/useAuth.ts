import { useAuthStore } from "@/stores/authStore";

export const useAuth = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshTokens,
  } = useAuthStore();

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshTokens,
  };
};

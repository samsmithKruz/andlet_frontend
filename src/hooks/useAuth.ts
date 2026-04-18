import { useAuthStore } from "@/stores/authStore";

export const useAuth = () => {
  const {
    user,
    accessToken,
    permissions,
    subscription,
    allFeatures,
    isAuthenticated,
    isLoading,
    login,
    signup,
    loginWithGoogle,
    logout,
    refreshTokens,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasFeature,
  } = useAuthStore();

  return {
    user,
    accessToken,
    permissions,
    subscription,
    allFeatures,
    isAuthenticated,
    isLoading,
    login,
    signup,
    loginWithGoogle,
    logout,
    refreshTokens,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasFeature,
  };
};

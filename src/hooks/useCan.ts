import { useAuth } from "./useAuth";

/**
 * Check if user has a specific permission
 * @param permission - The permission string (e.g., "listings.create")
 * @returns boolean
 */
export const useCan = (permission: string): boolean => {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
};

/**
 * Check if user has any of the given permissions
 * @param permissions - Array of permission strings
 * @returns boolean
 */
export const useCanAny = (permissions: string[]): boolean => {
  const { hasAnyPermission } = useAuth();
  return hasAnyPermission(permissions);
};

/**
 * Check if user has all of the given permissions
 * @param permissions - Array of permission strings
 * @returns boolean
 */
export const useCanAll = (permissions: string[]): boolean => {
  const { hasAllPermissions } = useAuth();
  return hasAllPermissions(permissions);
};

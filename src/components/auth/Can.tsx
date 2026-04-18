// src/components/auth/Can.tsx

import { type ReactNode } from "react";
import { useCan, useCanAny, useCanAll } from "@/hooks/useCan";

interface CanProps {
  permission?: string;
  any?: string[];
  all?: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Component for conditional rendering based on permissions
 *
 * @example
 * // Single permission
 * <Can permission="listings.create">
 *   <Button>Create Listing</Button>
 * </Can>
 *
 * @example
 * // Any permission (OR)
 * <Can any={["listings.edit", "listings.delete"]}>
 *   <Button>Manage Listing</Button>
 * </Can>
 *
 * @example
 * // All permissions (AND)
 * <Can all={["listings.edit", "listings.delete"]}>
 *   <Button>Full Management</Button>
 * </Can>
 *
 * @example
 * // With fallback
 * <Can permission="listings.create" fallback={<Button disabled>Create</Button>}>
 *   <Button>Create Listing</Button>
 * </Can>
 */
export function Can({
  permission,
  any,
  all,
  fallback = null,
  children,
}: CanProps) {
  const hasSingle = permission ? useCan(permission) : true;
  const hasAny = any ? useCanAny(any) : true;
  const hasAll = all ? useCanAll(all) : true;

  // Combine all conditions
  const canAccess = hasSingle && hasAny && hasAll;

  if (!canAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

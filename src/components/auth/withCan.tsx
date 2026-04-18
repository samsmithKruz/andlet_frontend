import { type ComponentType } from "react";
import { useCan, useCanAny, useCanAll } from "@/hooks/useCan";

interface WithCanOptions {
  permission?: string;
  any?: string[];
  all?: string[];
  fallback?: React.ReactNode;
}

/**
 * Higher-Order Component for permission-based component wrapping
 *
 * @example
 * const ProtectedButton = withCan(Button, { permission: "listings.create" });
 */
export function withCan<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithCanOptions,
) {
  return function WithCanComponent(props: P) {
    const { permission, any, all, fallback = null } = options;

    const hasSingle = permission ? useCan(permission) : true;
    const hasAny = any ? useCanAny(any) : true;
    const hasAll = all ? useCanAll(all) : true;

    const canAccess = hasSingle && hasAny && hasAll;

    if (!canAccess) {
      return <>{fallback}</>;
    }

    return <WrappedComponent {...props} />;
  };
}

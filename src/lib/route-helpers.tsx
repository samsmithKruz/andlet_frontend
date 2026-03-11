import { lazy, Suspense, type ComponentType } from "react";
import { PageLoader } from "@/components/ui/page-loader";
import { type RouteObject } from "react-router-dom";

// Generic lazy loading wrapper
export const lazyLoad = (
  importFn: () => Promise<{ default: ComponentType<any> }>,
) => {
  const Component = lazy(importFn);

  return (
    <Suspense fallback={<PageLoader fullscreen spinnerSize="lg" />}>
      <Component />
    </Suspense>
  );
};

// Route builder with layout support
export const createRoute = (
  path: string,
  importFn: () => Promise<{ default: ComponentType<any> }>,
  options?: {
    layout?: ComponentType<{ children: React.ReactNode }>;
    index?: boolean;
  },
): RouteObject => {
  const element = lazyLoad(importFn);

  return {
    path: options?.index ? undefined : path,
    index: options?.index,
    element: options?.layout ? (
      <options.layout>{element}</options.layout>
    ) : (
      element
    ),
  };
};

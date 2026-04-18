/* eslint-disable react-refresh/only-export-components */
import {
  createBrowserRouter,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";
import { createRoute } from "@/lib/route-helpers";
import { NotFound } from "@/pages";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

// Professional Error Boundary Component
function ErrorBoundary() {
  const error = useRouteError();
  const isDev = import.meta.env.DEV;

  // Handle different error types
  let errorMessage = "An unexpected error occurred.";
  let errorStack: string | undefined;
  let statusCode: number | undefined;

  if (isRouteErrorResponse(error)) {
    // Route error (404, 401, etc.)
    statusCode = error.status;
    errorMessage =
      error.statusText || error.data?.message || `Error ${error.status}`;
  } else if (error instanceof Error) {
    // JavaScript error
    errorMessage = error.message;
    errorStack = error.stack;
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  const handleReload = () => {
    window.location.reload();
  };

  const handleReset = () => {
    // Clear any cached state that might be causing the error
    localStorage.removeItem("andlet_nav_config");
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            {statusCode && (
              <p className="text-sm font-medium text-muted-foreground tracking-wider">
                ERROR {statusCode}
              </p>
            )}
            <h1 className="text-3xl font-bold tracking-tight">
              {isDev ? "Something went wrong" : "Oops! Something went wrong"}
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {isDev
                ? "An error occurred while rendering this page."
                : "We're sorry for the inconvenience. Our team has been notified."}
            </p>
          </div>

          {/* Dev Mode - Error Details */}
          {isDev && (
            <div className="mt-6 space-y-3">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-left">
                <p className="font-mono text-sm font-medium text-destructive mb-2">
                  Error Details:
                </p>
                <pre className="text-sm font-mono text-foreground/80 whitespace-pre-wrap break-words">
                  {errorMessage}
                </pre>
              </div>

              {errorStack && (
                <details className="text-left">
                  <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    View Stack Trace
                  </summary>
                  <pre className="mt-3 p-4 bg-muted rounded-lg text-xs font-mono text-muted-foreground overflow-auto max-h-96 whitespace-pre-wrap break-words">
                    {errorStack}
                  </pre>
                </details>
              )}

              {Boolean(error) && (
                <details className="text-left">
                  <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    View Raw Error Object
                  </summary>
                  <pre className="mt-3 p-4 bg-muted rounded-lg text-xs font-mono text-muted-foreground overflow-auto max-h-96">
                    {JSON.stringify(
                      error,
                      typeof error === "object" && error !== null
                        ? Object.getOwnPropertyNames(error)
                        : undefined,
                      2,
                    )}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button onClick={handleReload} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={handleReset} variant="outline" className="gap-2">
              Reset App
            </Button>
            <Button asChild className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>

          {/* Support Link */}
          <p className="text-sm text-muted-foreground pt-4">
            If this persists, please{" "}
            <Link to="/contact" className="text-primary hover:underline">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorBoundary />,
    element: <MainLayout />,
    children: [
      createRoute("/", () => import("@/pages/HomePage"), { index: true }),
      createRoute("/contact", () => import("@/pages/ContactPage")),
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

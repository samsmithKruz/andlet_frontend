/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import { createRoute } from "@/lib/route-helpers";
import { NotFound } from "@/pages";
import MainLayout from "@/layouts/MainLayout";

// Error boundary
const ErrorBoundary = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-destructive">
          Something went wrong
        </h1>
        {import.meta.env.DEV && (
          <pre className="mt-4 p-4 bg-muted rounded-lg text-left overflow-auto max-w-2xl">
            {/* Error details will be available via useRouteError hook */}
          </pre>
        )}
      </div>
    </div>
  );
};

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

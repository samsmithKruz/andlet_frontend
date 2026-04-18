import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  alternativeAction?: {
    text: string;
    linkText: string;
    href: string;
  };
}

export function AuthLayout({
  children,
  title,
  subtitle,
  alternativeAction,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left Column - Form */}
      <div className="flex items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-block mb-8">
            <img
              src="/logo.svg"
              alt="Andlet"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
            )}
          </div>

          {/* Form Content */}
          {children}

          {/* Alternative Action */}
          {alternativeAction && (
            <p className="text-sm text-muted-foreground text-center mt-6">
              {alternativeAction.text}{" "}
              <Link
                to={alternativeAction.href}
                className="font-medium text-primary hover:underline"
              >
                {alternativeAction.linkText}
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Right Column - Hero */}
      <div className="hidden lg:block relative bg-gradient-to-br from-primary/5 via-primary/10 to-background">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              Find your place.
              <br />
              List your space.
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands who trust Andlet for verified rentals, inspections,
              and seamless property management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

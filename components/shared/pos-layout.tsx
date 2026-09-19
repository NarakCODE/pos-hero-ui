"use client";

import type { ReactNode } from "react";
import { POSFooter } from "./pos-footer";
import { POSHeader } from "./pos-header";

interface POSLayoutProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  headerTitle?: string;
  className?: string;
}

export function POSLayout({
  children,
  className = "",
  headerTitle,
  onSearchChange,
  rightPanel,
  searchPlaceholder,
  searchQuery,
  showSearch = true,
}: POSLayoutProps) {
  return (
    <div
      className={`flex h-screen h-dvh w-full flex-col overflow-hidden bg-background text-foreground ${className}`}
    >
      {/* Upper Area: Left Main Workstation + Right Order Panel */}
      <div className="flex min-h-0 flex-1 w-full overflow-hidden">
        {/* Left Main Workstation */}
        <section
          aria-label="Left main workstation"
          className={`flex min-w-0 flex-1 flex-col h-full overflow-hidden border-e border-border bg-background ${
            rightPanel ? "lg:flex-none lg:w-[60%]" : ""
          }`}
        >
          {/* 1. Header Section */}
          <POSHeader
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            searchPlaceholder={searchPlaceholder}
            showSearch={showSearch}
            title={headerTitle}
          />

          {/* 2. Main Content */}
          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </section>

        {/* Right Side: Order Panel */}
        {rightPanel ? (
          <aside
            aria-label="Order summary panel"
            className="hidden h-full shrink-0 flex-col overflow-hidden bg-background lg:flex lg:w-[40%]"
          >
            {rightPanel}
          </aside>
        ) : null}
      </div>

      {/* Footer Section: Stuck at the bottom of the app */}
      <POSFooter className="sticky bottom-0 z-30 w-full shrink-0" />
    </div>
  );
}

"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  AppLayout,
  type AppLayoutSpacing,
} from "@/components/shared/app-layout";
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
  rightPanelLabel?: string;
  className?: string;
  mainClassName?: string;
  rightPanelClassName?: string;
  footerClassName?: string;
  contentPadding?: AppLayoutSpacing;
  padding?: AppLayoutSpacing;
  gap?: AppLayoutSpacing;
  maxWidth?: CSSProperties["maxWidth"];
  rightPanelWidth?: CSSProperties["width"];
}

const contentPaddingClasses: Record<AppLayoutSpacing, string> = {
  none: "[--pos-content-padding:0rem]",
  compact:
    "[--pos-content-padding:0.5rem] sm:[--pos-content-padding:0.75rem]",
  default: "[--pos-content-padding:0.75rem] sm:[--pos-content-padding:1rem]",
  comfortable: "[--pos-content-padding:1rem] sm:[--pos-content-padding:1.5rem]",
};

export function POSLayout({
  children,
  className = "",
  contentPadding = "default",
  footerClassName,
  gap = "none",
  headerTitle,
  mainClassName,
  maxWidth = "none",
  onSearchChange,
  padding = "none",
  rightPanel,
  rightPanelClassName,
  searchPlaceholder,
  searchQuery,
  showSearch = true,
  rightPanelLabel = "Right panel",
  rightPanelWidth = "40%",
}: POSLayoutProps) {
  return (
    <AppLayout
      aside={rightPanel}
      asideLabel={rightPanelLabel}
      asideWidth={rightPanelWidth}
      className={`${contentPaddingClasses[contentPadding]} ${className}`}
      footer={<POSFooter className="w-full" />}
      footerClassName={footerClassName}
      gap={gap}
      mainLabel="Left main workstation"
      maxWidth={maxWidth}
      padding={padding}
      mainClassName={`flex flex-col bg-background ${
        rightPanel ? "border-e border-border" : ""
      } ${mainClassName ?? ""}`}
      asideClassName={`flex-col bg-surface ${rightPanelClassName ?? ""}`}
    >
      <POSHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        showSearch={showSearch}
        title={headerTitle}
      />

      <div
        data-slot="pos-layout-content"
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      >
        {children}
      </div>
    </AppLayout>
  );
}

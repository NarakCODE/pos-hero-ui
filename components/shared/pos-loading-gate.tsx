"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ContextAsideSkeleton,
  POS_LOADING_DURATION_MS,
  POSPageLoading,
} from "./pos-loading";

export function POSLoadingGate({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
    }, POS_LOADING_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return <POSPageLoading aside={<ContextAsideSkeleton />} />;
  }

  return <>{children}</>;
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { authSessionStorageKey } from "@/config/auth";
import { POSLoadingGate } from "./pos-loading-gate";
import { POSPageLoading } from "./pos-loading";

export function ProtectedAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (window.sessionStorage.getItem(authSessionStorageKey) !== "true") {
        router.replace("/login");
        return;
      }

      setIsAuthorized(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  if (!isAuthorized) {
    return <POSPageLoading />;
  }

  return <POSLoadingGate key={pathname}>{children}</POSLoadingGate>;
}

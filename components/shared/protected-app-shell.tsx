"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { authSessionStorageKey } from "@/config/auth";

export function ProtectedAppShell({ children }: { children: ReactNode }) {
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
    return null;
  }

  return <>{children}</>;
}

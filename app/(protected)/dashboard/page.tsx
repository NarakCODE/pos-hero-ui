"use client";

import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authSessionStorageKey } from "@/config/auth";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
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

  const handleSignOut = () => {
    window.sessionStorage.removeItem(authSessionStorageKey);
    router.replace("/login");
  };

  return (
    <main className="min-h-screen bg-background p-6 text-foreground sm:p-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-muted">{t("description")}</p>
        </div>
        <Button type="button" onPress={handleSignOut}>
          {t("signOut")}
        </Button>
      </div>
    </main>
  );
}

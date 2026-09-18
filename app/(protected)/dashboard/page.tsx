"use client";

import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { authSessionStorageKey } from "@/config/auth";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const router = useRouter();

  const handleSignOut = () => {
    window.sessionStorage.removeItem(authSessionStorageKey);
    router.replace("/login");
  };

  return (
    <main className="min-h-screen bg-background p-6 text-foreground sm:p-10">
      <div className="mx-auto flex w-full max-w-full flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-muted">{t("description")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="primary" onPress={() => router.push("/sales")}>
            Open POS Register
          </Button>
          <Button type="button" variant="outline" onPress={handleSignOut}>
            {t("signOut")}
          </Button>
        </div>
      </div>
    </main>
  );
}

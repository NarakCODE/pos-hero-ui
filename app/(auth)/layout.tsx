import Link from "next/link";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";

export default async function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const t = await getTranslations("AuthShell");
  const brandName = t("brandName");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(26rem,34rem)]">
        <aside className="relative hidden overflow-hidden border-e border-border bg-black lg:flex">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/login-bg.png')",
              WebkitMaskImage:
                "linear-gradient(to right, black 0%, black 64%, rgba(0, 0, 0, 0.9) 74%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, black 0%, black 64%, rgba(0, 0, 0, 0.9) 74%, transparent 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -end-24 -top-24 size-96 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -start-16 size-72 rounded-full border border-white/20"
          />

          <div className="relative z-10 flex min-h-screen w-full flex-col items-start justify-center p-10 text-start text-white xl:p-14">
            <Link
              href="/"
              aria-label={brandName}
              className="w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Logo name={brandName} size="xl" />
            </Link>

            <div className="mt-4 w-full max-w-lg">
              <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
                {t("headline")}
              </h1>
              <p className="mt-3 max-w-md text-lg leading-8 text-white/80">
                {t("description")}
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col bg-white dark:bg-background">
          <header className="flex items-center justify-between gap-4 p-4 sm:p-6 lg:justify-end lg:p-8">
            <Link
              href="/"
              aria-label={brandName}
              className="w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus lg:hidden"
            >
              <Logo name={brandName} size="sm" />
            </Link>
            <div className="ms-auto flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </header>

          <main className="flex flex-1 items-center justify-center px-4 pb-8 sm:px-6 lg:px-10">
            <div className="w-full max-w-md">{children}</div>
          </main>

          <p className="px-4 pb-6 text-center text-xs text-muted sm:px-6 lg:px-10">
            {t("legal")}
          </p>
        </div>
      </div>
    </div>
  );
}

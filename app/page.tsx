"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Card } from "@heroui/react";
import {
  IconArrowUpRight,
  IconReceipt,
  IconTable,
  IconUsers,
} from "@tabler/icons-react";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";

export default function Home() {
  const router = useRouter();
  const t = useTranslations("HomePage");
  const features = [
    {
      icon: IconReceipt,
      title: t("features.salesTitle"),
      description: t("features.salesDescription"),
    },
    {
      icon: IconTable,
      title: t("features.tablesTitle"),
      description: t("features.tablesDescription"),
    },
    {
      icon: IconUsers,
      title: t("features.customersTitle"),
      description: t("features.customersDescription"),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <Logo name={t("appName")} size="md" />

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button
            onPress={() => router.push("/login")}
            size="sm"
            variant="secondary"
          >
            {t("signIn")}
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)] lg:gap-16 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {t("eyebrow")}
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t("heading")}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted sm:text-xl">
              {t("description")}
            </p>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button
                onPress={() => router.push("/login")}
                size="lg"
                variant="primary"
              >
                {t("getStarted")}
                <IconArrowUpRight aria-hidden="true" size={20} />
              </Button>
              <span className="text-sm text-muted">{t("trustLine")}</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[2rem] bg-accent/10 blur-2xl"
            />
            <Card className="relative overflow-hidden border border-border bg-surface shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  fill
                  priority
                  alt={t("heroImageAlt")}
                  className="object-cover"
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  src="/login-bg.png"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/25"
                />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white sm:inset-x-7 sm:bottom-7">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                      {t("previewTitle")}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                      {t("previewStatus")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full bg-success"
                    />
                    {t("previewLive")}
                  </div>
                </div>
              </div>

              <Card.Footer className="grid grid-cols-2 gap-4 p-5 sm:p-6">
                <div>
                  <p className="text-xs font-medium text-muted">
                    {t("previewRevenue")}
                  </p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                    {t("previewRevenueValue")}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-xs font-medium text-muted">
                    {t("previewOrders")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {t("previewOrdersValue")}
                  </p>
                </div>
              </Card.Footer>
            </Card>
          </div>
        </section>

        <section
          aria-labelledby="home-features-title"
          className="border-t border-border bg-surface/60"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                {t("featuresEyebrow")}
              </p>
              <h2
                id="home-features-title"
                className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                {t("featuresTitle")}
              </h2>
              <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
                {t("featuresDescription")}
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {features.map(({ description, icon: Icon, title }) => (
                <Card key={title} className="h-full" variant="secondary">
                  <Card.Header className="gap-5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon aria-hidden="true" size={24} />
                    </div>
                    <div>
                      <Card.Title className="text-lg">{title}</Card.Title>
                      <Card.Description className="mt-2 text-sm leading-6">
                        {description}
                      </Card.Description>
                    </div>
                  </Card.Header>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Logo name={t("appName")} size="sm" />
          <p>{t("footer")}</p>
        </div>
      </footer>
    </div>
  );
}

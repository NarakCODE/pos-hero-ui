import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background text-foreground font-sans min-h-screen p-4 sm:p-8">
      <header className="flex w-full max-w-3xl items-center justify-between pb-6">
        <Logo name={t("appName")} size="sm" />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>

      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-24 px-8 sm:px-16 bg-surface text-surface-foreground rounded-3xl border border-border sm:items-start shadow-sm">
        <Image
          className="dark:invert h-5 w-[100px]"
          src="/next.svg"
          alt={t("nextLogoAlt")}
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left my-12">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
            {t.rich("heading", {
              code: (chunks) => (
                <code className="rounded bg-default px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
                  {chunks}
                </code>
              ),
            })}
          </h1>
          <p className="max-w-md text-lg leading-8 text-muted">
            {t.rich("description", {
              templates: (chunks) => (
                <a
                  href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="font-medium text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {chunks}
                </a>
              ),
              learning: (chunks) => (
                <a
                  href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="font-medium text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
          <Button variant="primary">{t("ready")}</Button>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-opacity hover:opacity-90 md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert h-[14px] w-4"
              src="/vercel.svg"
              alt={t("vercelLogoAlt")}
              width={16}
              height={14}
            />
            {t("deployNow")}
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-border px-5 transition-colors hover:bg-default text-foreground md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("documentation")}
          </a>
        </div>
      </main>
    </div>
  );
}

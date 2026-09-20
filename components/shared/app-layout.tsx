import type { CSSProperties, ReactNode } from "react";

export type AppLayoutSpacing =
  | "none"
  | "compact"
  | "default"
  | "comfortable";

export interface AppLayoutProps {
  children: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
  asideLabel?: string;
  mainLabel?: string;
  padding?: AppLayoutSpacing;
  gap?: AppLayoutSpacing;
  maxWidth?: CSSProperties["maxWidth"];
  asideWidth?: CSSProperties["width"];
  className?: string;
  workspaceClassName?: string;
  mainClassName?: string;
  asideClassName?: string;
  footerClassName?: string;
  style?: CSSProperties;
}

type AppLayoutStyle = CSSProperties & {
  "--app-layout-aside-width": string;
  "--app-layout-max-width": string;
};

const paddingClasses: Record<AppLayoutSpacing, string> = {
  none: "p-0",
  compact: "p-2 sm:p-3",
  default: "p-3 sm:p-4",
  comfortable: "p-4 sm:p-6",
};

const gapClasses: Record<AppLayoutSpacing, string> = {
  none: "gap-0",
  compact: "gap-2 sm:gap-3",
  default: "gap-3 sm:gap-4",
  comfortable: "gap-4 sm:gap-6",
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function toCssLength(value: CSSProperties["width"], fallback: string) {
  if (value === undefined || value === null) {
    return fallback;
  }

  return typeof value === "number" ? `${value}px` : value;
}

/**
 * Structural application shell. It owns viewport sizing and the relationship
 * between the main workspace, optional aside, and footer while leaving each
 * region's internal design to its consumer.
 */
export function AppLayout({
  aside,
  asideClassName,
  asideLabel = "Context panel",
  asideWidth = "40%",
  children,
  className,
  footer,
  footerClassName,
  gap = "none",
  mainClassName,
  mainLabel,
  maxWidth = "none",
  padding = "none",
  style,
  workspaceClassName,
}: AppLayoutProps) {
  const hasAside = aside !== undefined && aside !== null && aside !== false;
  const layoutStyle: AppLayoutStyle = {
    ...style,
    "--app-layout-aside-width": toCssLength(asideWidth, "40%"),
    "--app-layout-max-width": toCssLength(maxWidth, "none"),
  };

  return (
    <div
      data-slot="app-layout"
      className={joinClasses(
        "flex h-screen h-dvh w-full flex-col overflow-hidden bg-background text-foreground",
        className,
      )}
      style={layoutStyle}
    >
      <div
        data-slot="app-layout-workspace"
        className={joinClasses(
          "mx-auto grid min-h-0 w-full max-w-[var(--app-layout-max-width)] flex-1 grid-cols-1 overflow-hidden",
          hasAside &&
            "lg:grid-cols-[minmax(0,1fr)_minmax(20rem,var(--app-layout-aside-width))]",
          paddingClasses[padding],
          gapClasses[gap],
          workspaceClassName,
        )}
      >
        <main
          aria-label={mainLabel}
          data-slot="app-layout-main"
          className={joinClasses(
            "min-h-0 min-w-0 overflow-hidden",
            mainClassName,
          )}
        >
          {children}
        </main>

        {hasAside ? (
          <aside
            aria-label={asideLabel}
            data-slot="app-layout-aside"
            className={joinClasses(
              "hidden min-h-0 min-w-0 overflow-hidden lg:flex",
              asideClassName,
            )}
          >
            {aside}
          </aside>
        ) : null}
      </div>

      {footer ? (
        <div
          data-slot="app-layout-footer"
          className={joinClasses(
            "mx-auto w-full max-w-[var(--app-layout-max-width)] shrink-0",
            footerClassName,
          )}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import type { TablerIcon } from "@tabler/icons-react";

interface POSPagePlaceholderProps {
  title: string;
  eyebrow?: string;
  emptyTitle: string;
  emptyDescription: string;
  icon: TablerIcon;
  action?: ReactNode;
  headerAction?: ReactNode;
  className?: string;
}

export function POSPagePlaceholder({
  action,
  className = "",
  emptyDescription,
  emptyTitle,
  headerAction,
  icon: Icon,
  eyebrow,
  title,
}: POSPagePlaceholderProps) {
  return (
    <div className={`flex h-full min-h-0 w-full flex-col p-4 sm:p-6 text-foreground ${className}`}>
      {/* Header bar */}
      <section
        aria-label={title}
        className="shrink-0 rounded-2xl border border-border bg-background p-4 sm:p-5 shadow-xs"
      >
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
          </div>
          {headerAction ? <div>{headerAction}</div> : null}
        </div>
      </section>

      {/* Empty State Body */}
      <div className="mt-4 flex min-h-0 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-secondary/20 p-8 text-center sm:p-12">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform duration-200 hover:scale-105">
          <Icon aria-hidden="true" size={32} />
        </div>

        <h2 className="mt-5 text-lg font-bold tracking-tight text-foreground sm:text-xl">
          {emptyTitle}
        </h2>

        <p className="mt-1.5 max-w-sm text-sm text-muted">
          {emptyDescription}
        </p>

        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </div>
  );
}

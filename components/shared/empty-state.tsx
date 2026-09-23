import type { HTMLAttributes } from "react";

type EmptyStateRootProps = HTMLAttributes<HTMLDivElement>;
type EmptyStateMediaProps = HTMLAttributes<HTMLDivElement>;
type EmptyStateHeaderProps = HTMLAttributes<HTMLDivElement>;
type EmptyStateTitleProps = HTMLAttributes<HTMLHeadingElement>;
type EmptyStateDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
type EmptyStateContentProps = HTMLAttributes<HTMLDivElement>;

function EmptyStateRoot({ className, ...props }: EmptyStateRootProps) {
  return (
    <div
      {...props}
      className={cx(
        "flex flex-col items-center justify-center text-center",
        className,
      )}
    />
  );
}

function EmptyStateMedia({ className, ...props }: EmptyStateMediaProps) {
  return (
    <div
      {...props}
      className={cx(
        "mb-4 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-default text-muted",
        className,
      )}
    />
  );
}

function EmptyStateHeader({ className, ...props }: EmptyStateHeaderProps) {
  return (
    <div
      {...props}
      className={cx("flex flex-col items-center", className)}
    />
  );
}

function EmptyStateTitle({ className, ...props }: EmptyStateTitleProps) {
  return (
    <h2
      {...props}
      className={cx("text-sm font-semibold text-foreground", className)}
    />
  );
}

function EmptyStateDescription({ className, ...props }: EmptyStateDescriptionProps) {
  return (
    <p {...props} className={cx("mt-1 text-sm text-muted", className)} />
  );
}

function EmptyStateContent({ className, ...props }: EmptyStateContentProps) {
  return (
    <div
      {...props}
      className={cx(
        "mt-4 flex flex-wrap items-center justify-center gap-2",
        className,
      )}
    />
  );
}

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const EmptyState = Object.assign(EmptyStateRoot, {
  Media: EmptyStateMedia,
  Header: EmptyStateHeader,
  Title: EmptyStateTitle,
  Description: EmptyStateDescription,
  Content: EmptyStateContent,
});

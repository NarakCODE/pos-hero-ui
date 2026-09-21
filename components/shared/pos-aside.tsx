import type { ReactNode } from "react";

interface POSAsideProps {
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerClassName?: string;
  mainClassName?: string;
  footerClassName?: string;
}

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Shared right-panel structure. The content region uses a div instead of a
 * second `main` landmark because the application shell already owns the page
 * main landmark.
 */
export function POSAside({
  ariaLabel,
  ariaLabelledBy,
  children,
  className,
  footer,
  footerClassName,
  header,
  headerClassName,
  id,
  mainClassName,
}: POSAsideProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={joinClasses(
        "flex h-full min-h-0 min-w-0 flex-col bg-surface",
        className,
      )}
    >
      {header ? (
        <header className={joinClasses("shrink-0", headerClassName)}>
          {header}
        </header>
      ) : null}
      <div
        data-slot="pos-aside-main"
        className={joinClasses("min-h-0 min-w-0 flex-1", mainClassName)}
      >
        {children}
      </div>
      {footer ? (
        <footer className={joinClasses("shrink-0", footerClassName)}>
          {footer}
        </footer>
      ) : null}
    </section>
  );
}

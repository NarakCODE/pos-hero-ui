"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Clock, Wifi } from "reicon-react";
import type { OrderPanelFooterProps } from "./types";

export function OrderPanelFooter({
  className = "",
  dateTime,
  dateTimeLabel = "Date & time",
  locale,
  shiftInfo,
  shiftLabel = "Shift",
  systemLabel = "System",
  systemStatus = "Online",
}: OrderPanelFooterProps) {
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      setCurrentDateTime(
        new Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date()),
      );
    };

    updateDateTime();
    const intervalId = window.setInterval(updateDateTime, 60_000);

    return () => window.clearInterval(intervalId);
  }, [locale]);

  return (
    <footer
      aria-label="Checkout system status"
      className={`grid grid-cols-3 items-start gap-2 border-t border-border/70 pt-2.5 text-[10px] text-muted ${className}`}
    >
      <FooterStatus icon={<Wifi aria-hidden="true" size={13} />} label={systemLabel}>
        {systemStatus}
      </FooterStatus>

      <FooterStatus
        label={shiftLabel}
        icon={<span aria-hidden="true" className="size-1.5 rounded-full bg-success" />}
      >
        {shiftInfo}
      </FooterStatus>

      <FooterStatus
        icon={<Clock aria-hidden="true" size={13} />}
        label={dateTimeLabel}
      >
        {dateTime ?? (currentDateTime || "—")}
      </FooterStatus>
    </footer>
  );
}

function FooterStatus({
  children,
  icon,
  label,
}: {
  children: ReactNode;
  icon: ReactNode;
  label: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-0.5 text-start">
      <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted/75">
        {icon}
        {label}
      </span>
      <span className="max-w-full truncate font-medium text-foreground/70">{children}</span>
    </div>
  );
}

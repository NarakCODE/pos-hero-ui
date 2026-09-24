"use client";

import { Card, Chip } from "@heroui/react";
import { IconTrendingUp } from "@tabler/icons-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export interface DailyGuestsCardProps {
  title?: string;
  chipLabel?: string;
  amount?: string;
  change?: string;
  imageSrc?: string;
  className?: string;
}

export function DailyGuestsCard({
  title,
  chipLabel,
  amount = "1.2K",
  change = "+9.2%",
  imageSrc = "/images/people.webp",
  className = "",
}: DailyGuestsCardProps) {
  const t = useTranslations("Dashboard.dailyGuests");

  const displayTitle = title ?? t("title");
  const displayChip = chipLabel ?? t("chip");

  return (
    <Card className={`relative justify-between overflow-hidden ${className}`}>
      <Card.Header className="relative z-10 flex flex-col items-start">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl tabular-nums">
            {amount}
          </span>
          <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-success">
            <IconTrendingUp aria-hidden="true" size={16} />
            {change}
          </span>
        </div>

        <Card.Title>
          {displayTitle}
        </Card.Title>

        <Chip color="accent" size="sm" variant="soft">
          {displayChip}
        </Chip>
      </Card.Header>

      <div className="pointer-events-none absolute -right-1 bottom-0 z-0 h-32 w-44 sm:h-36 sm:w-48">
        <Image
          alt={displayTitle}
          className="object-contain object-bottom"
          fill
          priority
          sizes="(max-width: 640px) 176px, 192px"
          src={imageSrc}
        />
      </div>
    </Card>
  );
}

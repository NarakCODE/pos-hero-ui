"use client";

import { Card, Chip } from "@heroui/react";
import { IconCreditCard, IconQrcode, IconReceipt } from "@tabler/icons-react";

export function ChannelTenderCard() {
  return (
    <Card>
      <Card.Header>
        <div className="flex w-full items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-muted">
              Sales Channels & Tenders
            </div>
            <div className="text-xl font-bold tabular-nums tracking-tight text-foreground sm:text-2xl">
              $2,480.50
            </div>
          </div>
          <Chip color="accent" size="sm" variant="soft">
            48 Tickets
          </Chip>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="flex flex-col gap-3.5 pt-2">
          {/* In-Store POS Channel */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                In-Store / Register (62%)
              </span>
              <span className="tabular-nums text-muted">
                $1,538.00 · 30 tickets
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: "62%" }}
              />
            </div>
          </div>

          {/* Dine-In Tables Channel */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                Dine-In Tables (24%)
              </span>
              <span className="tabular-nums text-muted">
                $595.00 · 12 tickets
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
              <div
                className="h-full rounded-full bg-success"
                style={{ width: "24%" }}
              />
            </div>
          </div>

          {/* Delivery Apps Channel */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                Delivery Apps (14%)
              </span>
              <span className="tabular-nums text-muted">
                $347.50 · 6 tickets
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
              <div
                className="h-full rounded-full bg-warning"
                style={{ width: "14%" }}
              />
            </div>
          </div>

          {/* Tender Breakdown Pills */}
          <div className="mt-1 flex flex-wrap items-center gap-2 border-t border-border pt-3">
            <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface-secondary/50 px-2.5 py-1 text-xs">
              <IconReceipt aria-hidden="true" className="text-muted" size={14} />
              <span className="text-muted">Cash:</span>
              <span className="font-semibold text-foreground">$780.00</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface-secondary/50 px-2.5 py-1 text-xs">
              <IconQrcode aria-hidden="true" className="text-muted" size={14} />
              <span className="text-muted">KHQR:</span>
              <span className="font-semibold text-foreground">$1,150.50</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface-secondary/50 px-2.5 py-1 text-xs">
              <IconCreditCard aria-hidden="true" className="text-muted" size={14} />
              <span className="text-muted">Card:</span>
              <span className="font-semibold text-foreground">$550.00</span>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

export default ChannelTenderCard;

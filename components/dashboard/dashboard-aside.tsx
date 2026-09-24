"use client";

import {
  Avatar,
  Button,
  Chip,
  ScrollShadow,
  toast,
} from "@heroui/react";
import {
  IconCashRegister,
  IconChefHat,
  IconClock,
  IconLock,
  IconScale,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CashInOutModal } from "@/components/more/cash-in-out-modal";
import { CloseShiftModal } from "@/components/more/close-shift-modal";
import { LockRegisterModal } from "@/components/more/lock-register-modal";
import { orderRecords } from "@/components/orders/orders-data";
import { POSAside } from "@/components/shared/pos-aside";

interface DashboardAsideProps {
  onOpenRegister?: () => void;
}

export function DashboardAside({ onOpenRegister }: DashboardAsideProps = {}) {
  const router = useRouter();
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isCloseShiftOpen, setIsCloseShiftOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);

  const handleOpenCashDrawer = () => {
    toast.success("Cash drawer kicked open", {
      description: "Manual drawer kick (No sale recorded).",
    });
  };

  const handleGoToSales = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else {
      router.push("/sales");
    }
  };

  const recentOrders = orderRecords.slice(0, 4);

  return (
    <>
      <POSAside
        ariaLabel="Terminal & shift summary"
        className="h-full border-s border-border"
        header={
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <Avatar
                color="accent"
                size="md"
                variant="soft"
              >
                <Avatar.Fallback>SK</Avatar.Fallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="truncate text-sm font-semibold text-foreground">
                    Sokha Chea
                  </h2>
                  <span className="size-2 rounded-full bg-success" />
                </div>
                <p className="text-xs text-muted">
                  Lead Cashier · Terminal #1
                </p>
              </div>
            </div>

            <Chip color="success" size="sm" variant="soft">
              Online
            </Chip>
          </div>
        }
        footer={
          <div className="flex flex-col gap-2 border-t border-border p-4">
            <Button
              className="w-full"
              size="lg"
              variant="primary"
              onPress={handleGoToSales}
            >
              <IconCashRegister aria-hidden="true" size={20} />
              <span>Open POS Register</span>
            </Button>
          </div>
        }
      >
        <ScrollShadow className="h-full">
          <div className="flex flex-col gap-5 p-4">
            {/* Shift Details */}
          <section aria-label="Shift details" className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Shift Status
              </span>
              <Chip size="sm" variant="secondary">
                Shift #104
              </Chip>
            </div>

            <div className="rounded-xl border border-border bg-surface-secondary/30 p-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted">Started</p>
                  <p className="mt-0.5 font-medium text-foreground">08:00 AM Today</p>
                </div>
                <div>
                  <p className="text-muted">Register</p>
                  <p className="mt-0.5 font-medium text-foreground">Station 01 (Front)</p>
                </div>
                <div>
                  <p className="text-muted">Orders Taken</p>
                  <p className="mt-0.5 font-medium text-foreground">48 Tickets</p>
                </div>
                <div>
                  <p className="text-muted">Cash in Drawer</p>
                  <p className="mt-0.5 font-semibold text-success">$350.00</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Cash & Register Tools */}
          <section aria-label="Quick operations" className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Register Actions
            </span>

            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                className="justify-start"
                onPress={handleOpenCashDrawer}
              >
                <IconCashRegister aria-hidden="true" size={16} />
                <span>Kick Drawer</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="justify-start"
                onPress={() => setIsCashModalOpen(true)}
              >
                <IconScale aria-hidden="true" size={16} />
                <span>Cash In / Out</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="justify-start"
                onPress={() => setIsLockModalOpen(true)}
              >
                <IconLock aria-hidden="true" size={16} />
                <span>Lock Screen</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="justify-start"
                onPress={() => setIsCloseShiftOpen(true)}
              >
                <IconClock aria-hidden="true" className="text-danger" size={16} />
                <span className="text-danger">End Shift</span>
              </Button>
            </div>
          </section>

          {/* Kitchen / Expediter Status */}
          <section aria-label="Kitchen queue" className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Kitchen Line
              </span>
              <Chip color="warning" size="sm" variant="soft">
                4 Active
              </Chip>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-lg border border-border/80 bg-surface p-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-warning/10 text-warning">
                    <IconChefHat aria-hidden="true" size={15} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">#15306 · Table 12</p>
                    <p className="text-[11px] text-muted">3 items · In progress (4m)</p>
                  </div>
                </div>
                <span className="font-semibold text-foreground">$42.50</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/80 bg-surface p-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-success/10 text-success">
                    <IconChefHat aria-hidden="true" size={15} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">#15305 · Takeaway</p>
                    <p className="text-[11px] text-muted">2 items · Ready to pack</p>
                  </div>
                </div>
                <span className="font-semibold text-foreground">$18.00</span>
              </div>
            </div>
          </section>

          {/* Recent Completed Tickets */}
          <section aria-label="Recent tickets" className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Recent Orders
              </span>
              <Button
                size="sm"
                variant="ghost"
                onPress={() => router.push("/orders")}
              >
                <span className="text-xs text-accent">View all</span>
              </Button>
            </div>

            <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-2.5 text-xs transition-colors hover:bg-surface-secondary/40"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">
                        {order.orderCode}
                      </span>
                      <Chip
                        size="sm"
                        color={order.paymentStatus === "paid" ? "success" : "warning"}
                        variant="soft"
                      >
                        <span className="text-[10px]">{order.paymentStatus}</span>
                      </Chip>
                    </div>
                    <span className="text-[11px] text-muted">
                      {order.createdTime} · {order.totalQuantity} items
                    </span>
                  </div>

                  <span className="font-semibold tabular-nums text-foreground">
                    ${order.totalUsd.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </section>
          </div>
        </ScrollShadow>
      </POSAside>

      <CashInOutModal
        isOpen={isCashModalOpen}
        onOpenChange={setIsCashModalOpen}
      />
      <CloseShiftModal
        isOpen={isCloseShiftOpen}
        onOpenChange={setIsCloseShiftOpen}
      />
      <LockRegisterModal
        isOpen={isLockModalOpen}
        onOpenChange={setIsLockModalOpen}
      />
    </>
  );
}

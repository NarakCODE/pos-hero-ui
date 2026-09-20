"use client";

import { isValidElement, useEffect, useState, type ReactNode } from "react";
import { AlertDialog, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock, Logout6, Wifi } from "reicon-react";
import { authSessionStorageKey } from "@/config/auth";
import type { OrderPanelFooterProps, SignOutAlertDialogProps } from "./types";

export function SignOutAlertDialog({
  body = "You'll need to sign in again to access your account. Any unsaved changes will be lost.",
  cancelLabel = "Stay Signed In",
  className = "",
  confirmLabel = "Sign Out",
  header = "Sign out of your account?",
  isOpen,
  onConfirm,
  onOpenChange,
  onSignOut,
  status = "danger",
  trigger,
  triggerClassName = "bg-accent-soft text-accent-soft-foreground",
}: SignOutAlertDialogProps) {
  const router = useRouter();

  const handleConfirm = () => {
    if (onSignOut) {
      onSignOut();
      return;
    }

    if (onConfirm) {
      onConfirm();
      return;
    }

    window.sessionStorage.removeItem(authSessionStorageKey);
    router.replace("/login");
  };

  const isControlled = isOpen !== undefined;
  const dialogProps = isControlled ? { isOpen, onOpenChange } : {};

  return (
    <AlertDialog {...dialogProps}>
      {isValidElement(trigger) ? (
        trigger
      ) : (
        <Button className={triggerClassName} variant="danger">
          {trigger ?? confirmLabel}
        </Button>
      )}
      <AlertDialog.Backdrop
        className="bg-linear-to-t from-red-950/90 via-red-950/50 to-transparent dark:from-red-950/95 dark:via-red-950/60"
        variant="blur"
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog
            className={`sm:max-w-[420px] ${className}`.trim()}
          >
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header className="items-center text-center">
              <AlertDialog.Icon status={status}>
                <AlertTriangle
                  aria-hidden="true"
                  className="size-5"
                  size={20}
                />
              </AlertDialog.Icon>
              <AlertDialog.Heading>{header}</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body className="text-center">
              <p>{body}</p>
            </AlertDialog.Body>
            <AlertDialog.Footer className="flex-col-reverse gap-2">
              <Button className="w-full" slot="close" variant="tertiary">
                {cancelLabel}
              </Button>
              <Button
                className="w-full"
                slot="close"
                variant={status === "danger" ? "danger" : "primary"}
                onPress={handleConfirm}
              >
                {confirmLabel}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

export function Statuses() {
  const examples = [
    {
      actions: {
        cancel: "Stay Signed In",
        confirm: "Sign Out",
      },
      body: "You'll need to sign in again to access your account. Any unsaved changes will be lost.",
      classNames: "bg-accent-soft text-accent-soft-foreground",
      header: "Sign out of your account?",
      status: "accent",
      trigger: "Sign Out",
    },
    {
      actions: {
        cancel: "Not Yet",
        confirm: "Mark Complete",
      },
      body: "This will mark the task as complete and notify all team members. The task will be moved to your completed list.",
      classNames: "bg-success-soft text-success-soft-foreground",
      header: "Complete this task?",
      status: "success",
      trigger: "Complete Task",
    },
    {
      actions: {
        cancel: "Keep Editing",
        confirm: "Discard",
      },
      body: "You have unsaved changes that will be permanently lost. Are you sure you want to discard them?",
      classNames: "bg-warning-soft text-warning-soft-foreground",
      header: "Discard unsaved changes?",
      status: "warning",
      trigger: "Discard Changes",
    },
    {
      actions: {
        cancel: "Cancel",
        confirm: "Delete Account",
      },
      body: "This will permanently delete your account and remove all your data from our servers. This action is irreversible.",
      classNames: "bg-danger-soft text-danger-soft-foreground",
      header: "Delete your account?",
      status: "danger",
      trigger: "Delete Account",
    },
  ] as const;

  return (
    <div className="flex flex-wrap gap-4">
      {examples.map(
        ({ actions, body, classNames, header, status, trigger }) => (
          <AlertDialog key={status}>
            <Button className={classNames}>{trigger}</Button>
            <AlertDialog.Backdrop>
              <AlertDialog.Container>
                <AlertDialog.Dialog className="sm:max-w-[400px]">
                  <AlertDialog.CloseTrigger />
                  <AlertDialog.Header>
                    <AlertDialog.Icon status={status} />
                    <AlertDialog.Heading>{header}</AlertDialog.Heading>
                  </AlertDialog.Header>
                  <AlertDialog.Body>
                    <p>{body}</p>
                  </AlertDialog.Body>
                  <AlertDialog.Footer>
                    <Button slot="close" variant="tertiary">
                      {actions.cancel}
                    </Button>
                    <Button
                      slot="close"
                      variant={status === "danger" ? "danger" : "primary"}
                    >
                      {actions.confirm}
                    </Button>
                  </AlertDialog.Footer>
                </AlertDialog.Dialog>
              </AlertDialog.Container>
            </AlertDialog.Backdrop>
          </AlertDialog>
        ),
      )}
    </div>
  );
}

export function OrderPanelFooter({
  className = "",
  dateTime,
  dateTimeLabel = "Date & time",
  locale,
  onSignOut,
  shiftInfo,
  shiftLabel = "Shift",
  showSignOut = true,
  signOutBody = "You'll need to sign in again to access your account. Any unsaved changes will be lost.",
  signOutCancelLabel = "Stay Signed In",
  signOutConfirmLabel = "Sign Out",
  signOutHeader = "Sign out of your account?",
  signOutStatus = "danger",
  signOutTrigger,
  signOutTriggerClassName,
  signOutTriggerLabel = "Sign Out",
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
      className={`border-t border-border/70 pt-2.5 text-[10px] text-muted ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="grid min-w-0 flex-1 grid-cols-3 items-start gap-2">
          <FooterStatus
            icon={<Wifi aria-hidden="true" size={13} />}
            label={systemLabel}
          >
            {systemStatus}
          </FooterStatus>

          <FooterStatus
            label={shiftLabel}
            icon={
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-success"
              />
            }
          >
            {shiftInfo}
          </FooterStatus>

          <FooterStatus
            icon={<Clock aria-hidden="true" size={13} />}
            label={dateTimeLabel}
          >
            {dateTime ?? (currentDateTime || "—")}
          </FooterStatus>
        </div>

        {showSignOut ? (
          <div className="shrink-0">
            <SignOutAlertDialog
              body={signOutBody}
              cancelLabel={signOutCancelLabel}
              confirmLabel={signOutConfirmLabel}
              header={signOutHeader}
              onSignOut={onSignOut}
              status={signOutStatus}
              trigger={
                signOutTrigger ?? (
                  <Button
                    size="sm"
                    variant="danger-soft"
                    className={`h-7 px-2.5 text-[11px] font-medium ${signOutTriggerClassName ?? ""}`}
                  >
                    <Logout6 aria-hidden="true" size={24} />

                    <span>{signOutTriggerLabel}</span>
                  </Button>
                )
              }
            />
          </div>
        ) : null}
      </div>
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
      <span className="max-w-full truncate font-medium text-foreground/70">
        {children}
      </span>
    </div>
  );
}

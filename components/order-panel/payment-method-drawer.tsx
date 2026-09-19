"use client";

import { Button, Drawer } from "@heroui/react";
import type { PaymentMethodOption } from "./types";

interface PaymentMethodDrawerProps {
  method: PaymentMethodOption;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function PaymentMethodDrawer({
  isOpen,
  method,
  onOpenChange,
}: PaymentMethodDrawerProps) {
  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog
          aria-label={method.label}
          className="w-[min(36rem,90vw)]! max-w-[90vw]!"
        >
          <Drawer.CloseTrigger />
          <Drawer.Header>
            <Drawer.Heading>{method.label}</Drawer.Heading>
          </Drawer.Header>
          <Drawer.Body>
            <p>Hello {method.label}</p>
          </Drawer.Body>
          <Drawer.Footer>
            <Button slot="close" variant="secondary">
              Close
            </Button>
          </Drawer.Footer>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}

import type { ReactNode } from "react";
import { ProtectedAppShell } from "@/components/shared/protected-app-shell";

export default function ProtectedLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <ProtectedAppShell>{children}</ProtectedAppShell>;
}

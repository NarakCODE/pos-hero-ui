"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button, Dropdown, Label } from "@heroui/react";

function SunIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function MonitorIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

export interface ThemeSwitcherProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ThemeSwitcher({ className, size = "sm" }: ThemeSwitcherProps) {
  const [mounted, setMounted] = React.useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        aria-label="Toggle theme"
        className={className}
        isIconOnly
        size={size}
        variant="outline"
      >
        <span className="size-4 opacity-0" aria-hidden="true" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const activeTheme = theme === "system" ? resolvedTheme : theme;

  const renderTriggerIcon = () => {
    if (theme === "system") {
      return <MonitorIcon className="size-4" />;
    }
    if (activeTheme === "dark") {
      return <MoonIcon className="size-4" />;
    }
    return <SunIcon className="size-4" />;
  };

  const currentThemeLabel =
    theme === "system"
      ? `System (${resolvedTheme ?? "auto"})`
      : theme === "dark"
        ? "Dark"
        : "Light";

  return (
    <Dropdown>
      <Button
        aria-label={`Current theme: ${currentThemeLabel}. Select theme`}
        className={className}
        isIconOnly
        size={size}
        variant="outline"
      >
        {renderTriggerIcon()}
        <span className="sr-only">Toggle theme menu</span>
      </Button>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu
          aria-label="Theme selection"
          onAction={(key) => setTheme(key as string)}
          selectedKeys={new Set([theme ?? "system"])}
          selectionMode="single"
        >
          <Dropdown.Item id="light" textValue="Light">
            <Dropdown.ItemIndicator />
            <SunIcon className="size-4 shrink-0 text-muted" />
            <Label>Light</Label>
          </Dropdown.Item>
          <Dropdown.Item id="dark" textValue="Dark">
            <Dropdown.ItemIndicator />
            <MoonIcon className="size-4 shrink-0 text-muted" />
            <Label>Dark</Label>
          </Dropdown.Item>
          <Dropdown.Item id="system" textValue="System">
            <Dropdown.ItemIndicator />
            <MonitorIcon className="size-4 shrink-0 text-muted" />
            <Label>System</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

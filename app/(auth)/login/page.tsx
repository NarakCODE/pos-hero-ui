"use client";

import { useState, type FormEvent } from "react";
import {
  Button,
  FieldError,
  Form,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authSessionStorageKey } from "@/config/auth";

function GoogleLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
      />
    </svg>
  );
}

function FacebookLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
    </svg>
  );
}

function AppleLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2.02.6-2.66 1.34-.56.65-1.06 1.71-.93 2.73 1.01.08 2.05-.47 2.67-1.22Z" />
    </svg>
  );
}

export default function LoginPage() {
  const t = useTranslations("AuthLogin");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!identifier.trim()) {
      newErrors.identifier = t("identifierRequired");
    }

    if (!password) {
      newErrors.password = t("passwordRequired");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    window.sessionStorage.setItem(authSessionStorageKey, "true");
    router.replace("/sales");
  };

  const handleIdentifierChange = (value: string) => {
    setIdentifier(value);
    if (errors.identifier) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.identifier;
        return next;
      });
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.password;
        return next;
      });
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto">
      {/* Heading */}
      <div className="mb-8 text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t("title")}
        </h1>
      </div>

      {/* Form */}
      <Form onSubmit={handleSubmit} validationErrors={errors}>
        <div className="flex flex-col gap-4">
          {/* Identifier Field */}
          <TextField
            fullWidth
            isRequired
            isInvalid={Boolean(errors.identifier)}
            name="identifier"
            value={identifier}
            onChange={handleIdentifierChange}
          >
            <Label>{t("identifierLabel")}</Label>
            <InputGroup fullWidth>
              <InputGroup.Input
                autoComplete="username"
                placeholder={t("identifierPlaceholder")}
              />
            </InputGroup>
            <FieldError>{errors.identifier}</FieldError>
          </TextField>

          {/* Password Field */}
          <TextField
            fullWidth
            isRequired
            isInvalid={Boolean(errors.password)}
            name="password"
            value={password}
            onChange={handlePasswordChange}
          >
            <Label>{t("passwordLabel")}</Label>
            <InputGroup fullWidth>
              <InputGroup.Input
                autoComplete="current-password"
                placeholder={t("passwordPlaceholder")}
                type={showPassword ? "text" : "password"}
              />
              <InputGroup.Suffix>
                <Button
                  isIconOnly
                  aria-label={
                    showPassword ? t("hidePassword") : t("showPassword")
                  }
                  size="sm"
                  type="button"
                  variant="ghost"
                  onPress={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? (
                    <IconEyeOff aria-hidden="true" className="size-4" />
                  ) : (
                    <IconEye aria-hidden="true" className="size-4" />
                  )}
                </Button>
              </InputGroup.Suffix>
            </InputGroup>
            <FieldError>{errors.password}</FieldError>
          </TextField>

          {/* Primary CTA */}
          <Button fullWidth type="submit">
            {t("submit")}
          </Button>

          {/* Utility Row */}
          <div className="flex items-center justify-between pt-1 text-sm">
            <Link
              className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
              href="/register"
            >
              {t("startTrial")}
            </Link>
            <Link
              className="font-medium text-slate-500 transition-colors hover:text-slate-800 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
              href="/forgot-password"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative bg-white px-3 text-xs font-medium uppercase tracking-wider text-slate-400 dark:bg-background dark:text-slate-500">
              {t("or")}
            </span>
          </div>

          {/* OAuth SSO Stack */}
          <div className="flex flex-col gap-3">
            <Button fullWidth type="button" variant="tertiary">
              <GoogleLogo  />
              <span>{t("google")}</span>
            </Button>

            <Button fullWidth type="button" variant="tertiary">
              <FacebookLogo  />
              <span>{t("facebook")}</span>
            </Button>

            <Button fullWidth type="button" variant="tertiary">
              <AppleLogo  />
              <span>{t("apple")}</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

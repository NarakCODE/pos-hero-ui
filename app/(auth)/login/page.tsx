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

function GoogleLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        fill="currentColor"
        d="M21.456 10.154c.123.659.19 1.348.19 2.067c0 5.624-3.764 9.623-9.449 9.623A9.84 9.84 0 0 1 2.353 12a9.84 9.84 0 0 1 9.844-9.844c2.658 0 4.879.978 6.583 2.566l-2.775 2.775V7.49c-1.033-.984-2.344-1.489-3.808-1.489c-3.248 0-5.888 2.744-5.888 5.993s2.64 5.999 5.888 5.999c2.947 0 4.953-1.686 5.365-4h-5.365v-3.839z"
      />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <g fill="none">
        <g clipPath="url(#SVGXv8lpc2Y)">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M0 12.067C0 18.034 4.333 22.994 10 24v-8.667H7V12h3V9.333c0-3 1.933-4.666 4.667-4.666c.866 0 1.8.133 2.666.266V8H15.8c-1.467 0-1.8.733-1.8 1.667V12h3.2l-.533 3.333H14V24c5.667-1.006 10-5.966 10-11.933C24 5.43 18.6 0 12 0S0 5.43 0 12.067"
            clipRule="evenodd"
          />
        </g>
        <defs>
          <clipPath id="SVGXv8lpc2Y">
            <path fill="#fff" d="M0 0h24v24H0z" />
          </clipPath>
        </defs>
      </g>
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 1024 1024"
    >
      <path d="M0 0h1024v1024H0z" fill="none" />
      <path
        fill="currentColor"
        d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5c-34.9-50-87.7-77.5-157.3-82.8c-65.9-5.2-138 38.4-164.4 38.4c-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8c23.8 68.2 109.6 235.3 199.1 232.6c46.8-1.1 79.9-33.2 140.8-33.2c59.1 0 89.7 33.2 141.9 33.2c90.3-1.3 167.9-153.2 190.5-221.6c-121.1-57.1-114.6-167.2-114.6-170.7m-105.1-305c50.7-60.2 46.1-115 44.6-134.7c-44.8 2.6-96.6 30.5-126.1 64.8c-32.5 36.8-51.6 82.3-47.5 133.6c48.4 3.7 92.6-21.2 129-63.7"
      />
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
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative bg-white px-3 text-xs font-medium uppercase tracking-wider text-slate-400 dark:bg-background dark:text-slate-500">
              {t("or")}
            </span>
          </div>

          {/* OAuth SSO Stack */}
          <div className="flex flex-col gap-3">
            <Button fullWidth type="button" variant="tertiary">
              <GoogleLogo />
              <span>{t("google")}</span>
            </Button>

            <Button fullWidth type="button" variant="tertiary">
              <FacebookLogo />
              <span>{t("facebook")}</span>
            </Button>

            <Button fullWidth type="button" variant="tertiary">
              <AppleLogo />
              <span>{t("apple")}</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

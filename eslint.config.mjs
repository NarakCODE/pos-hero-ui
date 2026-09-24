import { defineConfig, globalIgnores } from "eslint/config";
import { plugin as shadcn } from "@shadcn/lint";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { shadcn },
    settings: {
      shadcn: {
        componentImports: ["^@heroui/react(?:/|$)"],
      },
    },
    rules: {
      "shadcn/no-restyle": [
        "error",
        {
          allow: ["layout"],
          message:
            "Use HeroUI props or theme tokens for appearance; reserve className for layout. See the HeroUI component docs.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".heroui-docs/**",
  ]),
]);

export default eslintConfig;

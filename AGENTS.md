# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 App Router project using React, TypeScript, Tailwind CSS v4, and HeroUI v3. Application code lives in `app/`: `layout.tsx` defines the root document, `page.tsx` contains the home screen, and `globals.css` is the global Tailwind and HeroUI stylesheet. Static assets belong in `public/`. Root configuration includes `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, and `eslint.config.mjs`. No test directory exists yet.

## Build, Test, and Development Commands

Use pnpm (`pnpm@10.26.1`) for all project commands:

- `pnpm dev` starts the local development server at `http://localhost:3000`.
- `pnpm lint` runs ESLint across the repository.
- `pnpm build` creates the production Next.js build and performs TypeScript checks.
- `pnpm start` serves the latest production build; run `pnpm build` first.

Run `pnpm lint` and `pnpm build` before submitting changes.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Match the existing two-space indentation, double-quoted strings, semicolons, and trailing commas. Use PascalCase for component names and filenames, camelCase for variables and functions, and kebab-case for route segments. Keep App Router files in `app/` and prefer Tailwind utility classes for component styling. Preserve the stylesheet order in `app/globals.css`: import `tailwindcss` before `@heroui/styles`. HeroUI v3 components do not require a provider.

## Testing Guidelines

No test framework or coverage threshold is configured. Until one is introduced, validate changes with `pnpm lint` and `pnpm build`. When adding tests, colocate them with the feature or use a dedicated `tests/` directory, and use descriptive names such as `button.test.tsx`.

## Commit & Pull Request Guidelines

This repository has no commit history yet, so no established commit convention can be inferred. Use short, imperative messages with a clear scope, for example `feat: add settings page` or `fix: correct button spacing`. Pull requests should explain the behavior change, list validation commands, link the relevant issue when available, and include screenshots for visible UI changes.

## Security & Configuration

Do not commit secrets or local environment files. Keep dependency changes in `package.json` and `pnpm-lock.yaml`, and use the repository's pinned package manager and exact HeroUI versions when updating UI dependencies.

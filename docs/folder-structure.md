# Folder structure

This project uses the Next.js App Router with a small, domain-oriented structure.

```text
app/
  layout.tsx             # Root document, metadata, fonts, and global providers
  providers.tsx          # Client-only application providers
  globals.css            # Tailwind and HeroUI styles
  page.tsx               # Route entry point for `/`
  <route>/               # Route-owned UI, loading, error, and not-found states
  api/<resource>/        # Route handlers only when a backend boundary is needed

components/
  shared/                # Reusable product UI used by multiple routes/features
  ui/                    # App-specific UI primitives and composed controls

features/
  <domain>/              # POS domain modules, for example sales or inventory
    components/          # Domain-owned interactive components
    hooks/               # Domain-owned client hooks
    lib/                 # Domain-specific helpers and data adapters
    types.ts             # Domain types when they are not shared globally

config/                  # Static app-wide configuration
hooks/                   # Hooks shared across unrelated features
lib/                     # Framework-agnostic shared utilities
types/                   # Types shared across unrelated features
public/                  # Static assets served from the site root
```

## Conventions

- Keep route files and route-specific components close to their `app/` segment.
- Add a folder under `features/` when a POS domain has more than one related file.
- Keep client components small and place the `"use client"` boundary at the lowest useful level.
- Keep server-only code in `lib/server` and browser-only code in `lib/client` when those boundaries are introduced.
- Import directly from the owning module; avoid broad barrel exports for frequently used components.
- Do not create a folder until it owns real code, except for the lightweight placeholders used to establish this project layout.

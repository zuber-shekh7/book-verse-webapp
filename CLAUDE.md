@AGENTS.md

# BookVerse

Book discovery & reviews web app. Admins curate the catalog; readers browse it publicly.

## Docs
- Product and roadmap: [docs/PRODUCT.md](docs/PRODUCT.md)
- Technical spec (stack, data model, routes, env vars): [docs/TECH-SPEC.md](docs/TECH-SPEC.md)
- Decision records: [docs/decisions/](docs/decisions/)

Keep these up to date when decisions or scope change.

## Stack
Next.js (JavaScript, App Router, `src/` dir, `@/*` alias), Tailwind, ESLint, MongoDB + Mongoose, shadcn/ui, email/password auth.

## Commands
- `npm run dev`: start dev server (http://localhost:3000)
- `npm run lint`: ESLint
- `npm run build`: production build

## Conventions
- JavaScript only (no TypeScript).
- Secrets live in `.env.local`; never commit them.

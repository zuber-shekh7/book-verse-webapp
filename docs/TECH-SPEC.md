# BookVerse: Technical Specification

## Stack
- **Framework:** Next.js (JavaScript, App Router, `src/` dir, `@/*` import alias), full-stack via route handlers / server actions.
- **Database:** MongoDB (remote-hosted) with Mongoose.
- **Auth:** email/password only; users have a `role` (`admin`). No public admin sign-up.
- **UI:** Tailwind CSS + shadcn/ui (Radix components copied into the repo, JS mode).
- **Lint:** ESLint.

## Environment variables
| Name | Purpose |
|------|---------|
| `MONGODB_URI` | Remote MongoDB connection string |
| `ADMIN_EMAIL` | Email for the seeded first admin |
| `ADMIN_PASSWORD` | Password for the seeded first admin |

Set in `.env.local` (git-ignored via `.env*`). Auth session secret to be added once the auth approach is implemented.

## Data model (initial)
- **User:** email (unique), passwordHash, role (`admin`)
- **Author:** name, bio
- **Genre:** name (unique)
- **Book:** title, author -> Author, genres -> [Genre], description, coverUrl, isbn, publishedYear

## Seeding
- `npm run seed:admin` creates the first admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. It must be idempotent.

## Routes (planned)
**Public**
- `/` : landing / book list
- `/books/[id]` : book detail

**Admin** (requires admin session)
- `/admin/login`
- `/admin/books`, `/admin/books/new`, `/admin/books/[id]/edit`
- `/admin/authors`, `/admin/authors/new`, `/admin/authors/[id]/edit`
- `/admin/genres`, `/admin/genres/new`, `/admin/genres/[id]/edit`

## Open technical decisions
- Session mechanism for email/password auth (e.g. signed cookie sessions vs. Auth.js credentials)
- Password hashing library (e.g. bcrypt)
- Validation library (e.g. zod)
- Mutations via server actions vs. route handlers

## Verification
`npm run lint`, `npm run build`, then manual admin CRUD and public pages in `npm run dev`.

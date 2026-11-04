# BookVerse: Technical Specification

## Stack
- **Framework:** Next.js (JavaScript, App Router, `src/` dir, `@/*` import alias), full-stack via route handlers / server actions.
- **Database:** MongoDB (remote-hosted) with Mongoose.
- **Auth:** email/password only; users have a `role` (`admin` | `reader`). Readers sign themselves up; the role is fixed server-side. No public admin sign-up.
- **UI:** Tailwind CSS + shadcn/ui (Radix components copied into the repo, JS mode).
- **Lint:** ESLint.

## Environment variables
| Name | Purpose |
|------|---------|
| `MONGODB_URI` | Remote MongoDB connection string |
| `SESSION_SECRET` | Signs session cookies (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Email for the seeded first admin |
| `ADMIN_PASSWORD` | Password for the seeded first admin |
| `APP_URL` | Base URL used in password-reset links (default `http://localhost:3000`) |

Set in `.env.local` (git-ignored via `.env*`). See `.env.example`.

## Data model (initial)
- **User:** name (optional; admins have none), email (unique), passwordHash, role (`admin` | `reader`)
- **Author:** name, bio, isActive
- **Genre:** name (unique), isActive
- **PasswordReset:** userId -> User, tokenHash (SHA-256 of the emailed token, unique), expiresAt (TTL index, 30 min)
- **ReadingEntry:** userId -> User, bookId -> Book, status (`wishlist` | `reading` | `on_hold` | `dropped` | `completed`); unique on (userId, bookId). Removed when its book is deleted.
- **Book:** title, authors -> [Author] (at least one), genres -> [Genre], description, coverUrl, isbn, publishedYear, isActive

`isActive` (default `false`) is the draft/publish flag on Author, Genre and Book. Readers only see active content: inactive books are hidden (404 for non-admins; admins can preview), inactive authors/genres are left off a book's lists, and a book with no active author is hidden. Reading-list rows for hidden books are kept but not shown or counted. `publicBookFilter()` and `getBook(id, { publicOnly })` in `src/lib/catalog.js` implement this.

## Seeding
- `npm run seed:admin` creates the first admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. It must be idempotent.
- `npm run backfill:active` marks catalog documents created before `isActive` existed as active (run once after deploying the flag; idempotent).

## Routes (planned)
**Public**
- `/` : landing / book list; optional `?q=` search (title or author name)
- `/books/[id]` : book detail

**Reader**
- `/signup`, `/login` : reader account pages (signed-in readers are redirected to the dashboard)
- `/dashboard` : reader dashboard (requires reader session)
- `/dashboard/reading-list` : the reader's list with status tabs (`?status=`); status can be changed from here and from the book page (requires reader session)
- `/dashboard/settings` : edit name, change password (requires reader session)
- `/forgot-password`, `/reset-password/[token]` : password recovery (readers only; the link is printed to the server console in development, no mail provider yet)

**Admin** (requires admin session)
- `/admin/login`
- `/admin/books`, `/admin/books/new`, `/admin/books/[id]` (read-only view), `/admin/books/[id]/edit`
- `/admin/authors`, `/admin/authors/new`, `/admin/authors/[id]` (read-only view), `/admin/authors/[id]/edit`
- `/admin/users`, `/admin/users/[id]` (read-only: list of all users and a detail page; no edit/delete)
- `/admin/genres`, `/admin/genres/new`, `/admin/genres/[id]` (read-only view), `/admin/genres/[id]/edit`

## Open technical decisions
- Session mechanism for email/password auth (e.g. signed cookie sessions vs. Auth.js credentials)
- Password hashing library (e.g. bcrypt)
- Validation library (e.g. zod)
- Mutations via server actions vs. route handlers

## Verification
`npm run lint`, `npm run build`, then manual admin CRUD and public pages in `npm run dev`.

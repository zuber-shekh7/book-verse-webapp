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
- **User:** name (optional; admins have none), email (unique), passwordHash, role (`admin` | `reader`), isActive (default `true`; only `false` counts as deactivated, so older accounts need no backfill)
- **Author:** name, bio, isActive
- **Genre:** name (unique), isActive
- **PasswordReset:** userId -> User, tokenHash (SHA-256 of the emailed token, unique), expiresAt (TTL index, 30 min)
- **ReadingEntry:** userId -> User, bookId -> Book, status (`wishlist` | `reading` | `on_hold` | `dropped` | `completed`); unique on (userId, bookId). Removed when its book is deleted.
- **BookRequest:** userId -> User, title, author (text), genre (text), status (`pending` | `added` | `declined`), declineReason (`duplicate` | `other`, only when declined). One row per submission (no merging); author and genre are plain text, a snapshot of what the reader asked for.
- **Book:** title, authors -> [Author] (at least one), genres -> [Genre], description, coverUrl, isbn, publishedYear, isActive

`isActive` (default `false`) is the draft/publish flag on Author, Genre and Book. Readers only see active content: inactive books are hidden (404 for non-admins; admins can preview), inactive authors/genres are left off a book's lists, and a book with no active author is hidden. Reading-list rows for hidden books are kept but not shown or counted. `publicBookFilter()` and `getBook(id, { publicOnly })` in `src/lib/catalog.js` implement this.

Book requests: readers (never guests) submit from `/request-book` with search-first fields (suggestions from active titles, authors and genres, or "use my own text"). A reader may have at most 10 pending requests and cannot repeat their own pending title+author (case-insensitive). Admins triage in `/admin/requests`: Add book (pre-fills `/admin/books/new?title=&author=&genre=`), Mark added, Duplicate or Decline (both set status `declined`), Reopen, Delete. Code: `src/actions/book-requests.js`, `src/lib/book-requests.js`, `src/components/search-picker.jsx`.

Sessions are stateless JWTs, so `readSession()` (src/lib/session.js) also checks the user is still active (cached per request) and returns `null` for deactivated or deleted users. Login, forgot-password and reset-password refuse deactivated accounts. Admins can deactivate/reactivate readers only (`setUserActive` in src/actions/users.js).

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
- `/request-book` : request a book we don't have (`?title=` pre-fills; requires reader session)
- `/dashboard/requests` : the reader's requests and their status (requires reader session)
- `/dashboard/settings` : edit name, change password (requires reader session)
- `/forgot-password`, `/reset-password/[token]` : password recovery (readers only; the link is printed to the server console in development, no mail provider yet)

**Admin** (requires admin session)
- `/admin/login`
- `/admin/books`, `/admin/books/new`, `/admin/books/[id]` (read-only view), `/admin/books/[id]/edit`
- `/admin/authors`, `/admin/authors/new`, `/admin/authors/[id]` (read-only view), `/admin/authors/[id]/edit`
- `/admin/users`, `/admin/users/[id]` (read-only: list of all users and a detail page; no edit/delete)
- `/admin/requests` : book request queue with status tabs (`?status=`)
- `/admin/genres`, `/admin/genres/new`, `/admin/genres/[id]` (read-only view), `/admin/genres/[id]/edit`

## Open technical decisions
- Session mechanism for email/password auth (e.g. signed cookie sessions vs. Auth.js credentials)
- Password hashing library (e.g. bcrypt)
- Validation library (e.g. zod)
- Mutations via server actions vs. route handlers

## Known issues / fix later
- **Reactivated users resume their old session.** Deactivating a user does not invalidate their login cookie; `readSession()` just ignores it while the account is inactive. After reactivation the same cookie works again until it expires (7 days), without a fresh login.
  - Planned fix: add `sessionsValidAfter` (Date) to User, set it to now in `setUserActive` when deactivating, and have `isAllowed()` in src/lib/session.js reject tokens whose `iat` is earlier. Existing users have no field, so no backfill. The same field could also end other sessions after a password change or reset.

## Verification
`npm run lint`, `npm run build`, then manual admin CRUD and public pages in `npm run dev`.

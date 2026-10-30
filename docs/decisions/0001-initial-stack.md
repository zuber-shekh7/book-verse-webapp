# 0001: Initial stack

Date: 2026-10-30
Status: Accepted

## Decisions
- **Next.js full-stack (JS, App Router)** rather than a separate backend: one codebase, simple local development.
- **MongoDB (remote-hosted) + Mongoose:** flexible documents suit a book catalog; the author/genre separation is modeled with references.
- **Email/password auth with an `admin` role:** only curators need accounts in v1; the first admin comes from a seed script, so there is no public admin sign-up.
- **shadcn/ui on Tailwind:** components are copied into the repo and owned by us; good fit for admin forms and tables.
- **Authors and genres are separate collections** so they can be reused and managed independently of books.
- **Cover images are URLs, no uploads** in v1 to avoid storage infrastructure.
- **Local development only** for now; deployment target deferred.

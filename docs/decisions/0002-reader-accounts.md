# 0002: Reader accounts

Date: 2026-11-02
Status: Accepted

## Decisions
- Readers sign up at `/signup` and log in at `/login`; admins keep `/admin/login`. Both use the same `session` cookie and `User` model, distinguished by `role` (`admin` | `reader`).
- The sign-up action sets `role: "reader"` itself and ignores any role in the submitted form. Reader login rejects admin accounts, and admin checks (`requireAdmin`, `src/proxy.js`) require `role === "admin"`, so a reader session cannot reach `/admin`.
- `/dashboard` is protected in the page via `requireReader()`; admins are redirected to the admin panel.

## Consequences
- No rate limiting, email verification or password reset yet. Add these before any deployment.

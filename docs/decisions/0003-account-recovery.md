# 0003: Account settings and password recovery

Date: 2026-11-04
Status: Accepted

## Decisions
- Readers can edit their name, change their password (current password required) and reset a forgotten one. Admins are not covered by self-service reset.
- Reset tokens are 32 random bytes; only their SHA-256 hash is stored, with a 30-minute TTL, and they are single use. The token is checked on submit, not on page render.
- The forgot-password response is identical whether or not the email exists.
- There is no mail provider yet: in development the reset link is printed to the server console; in production nothing is logged and no mail is sent. Replace the logging branch in `requestPasswordReset` with a real sender when one is chosen.

## Consequences
- Sessions are stateless JWTs, so changing or resetting a password does not sign out other devices; an old session stays valid until it expires (7 days). Fixing this needs a server-side session or token-version check.
- Still missing before any deployment: email delivery, email verification, rate limiting on login and reset requests.

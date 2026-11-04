# 0004: Reading list

Date: 2026-11-06
Status: Accepted

## Decisions
- One `ReadingEntry` per (reader, book) with a single `status` enum: wishlist, reading, on_hold, dropped, completed. A unique index enforces one entry per pair; the action upserts and retries on a duplicate-key race.
- Purchase state is deliberately not tracked: "Wishlist" is books the reader wants to read, "Reading" is in progress. Status only for now: no dates, progress, rating or notes.
- The reader id always comes from the session; the client sends only a book id and a status, both validated. Admins do not get a reading list.
- Deleting a book in the admin panel also deletes its reading entries.
- Status keys, labels and icons live in `src/lib/reading-status.js`; the stored keys must match `READING_STATUS_VALUES` in the model.

## Consequences
- The reading-list page is not paginated yet.
- Signed-out visitors are sent to `/login` and are not returned to the book afterwards.

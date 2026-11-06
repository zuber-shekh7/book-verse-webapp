# BookVerse: Product

## Idea
A book **discovery & reviews** platform (Goodreads-style). Curators maintain the catalog by hand; readers browse it publicly.

## Users
- **Readers (public):** browse and view books without an account.
- **Admins / curators:** log in and manage the catalog.

## MVP (v1)
1. **Admin catalog management**
   - Admin login; admin-only routes.
   - CRUD for **books** (title, one or more authors, genres, subtitle, description, cover image URL, ISBN, published year, publisher, page count, language, series and number in series).
   - CRUD for **authors** (name, bio).
   - CRUD for **genres** (name).
   - **Draft / publish:** books, authors and genres have an Active flag (new items start as Draft). Readers only see active content, so nothing goes public until the admin has verified it.
   - **Users** list and detail pages (admins and readers, with role). Admins can deactivate a reader who breaks the rules: they are signed out and cannot log in until reactivated.
2. **Minimal public catalog**
   - Book list page.
   - Book detail page.
   - Both visible without login.
   - Search by title/author on the book list (URL query param).
3. **Reading list (readers)**
   - Signed-in readers add books to a personal list with one status each: Wishlist, Reading, On hold, Dropped, Completed.
   - Added from the book page; status can be changed or removed there or on the list page (`/dashboard/reading-list`, tabs per status); counts on the dashboard.

4. **Book requests (readers)**
   - When a search finds nothing, readers can request the book (title, author, genre), searching our catalog first and entering their own text only when it is not there.
   - Admins review requests in a queue: add the book, mark it added, or decline it (repeat requests are marked Duplicate). Readers see the status under "My requests".

## Later (not in MVP)
- Genre/author filters on the book list (`searchBooks` already accepts `genre`/`author`)
- Ratings and written reviews (+ moderation)
- Reader accounts: sign-up, login, dashboard, profile editing, password change and password reset (dev-console delivery) are done; email delivery, email verification and rate limiting are not

## Out of scope for now
- File uploads (cover image is a URL)
- External book-data import (Open Library, Google Books)
- Deployment (local development only)

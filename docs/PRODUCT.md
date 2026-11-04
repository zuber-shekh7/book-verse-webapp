# BookVerse: Product

## Idea
A book **discovery & reviews** platform (Goodreads-style). Curators maintain the catalog by hand; readers browse it publicly.

## Users
- **Readers (public):** browse and view books without an account.
- **Admins / curators:** log in and manage the catalog.

## MVP (v1)
1. **Admin catalog management**
   - Admin login; admin-only routes.
   - CRUD for **books** (title, one or more authors, genres, description, cover image URL, ISBN, published year).
   - CRUD for **authors** (name, bio).
   - CRUD for **genres** (name).
2. **Minimal public catalog**
   - Book list page.
   - Book detail page.
   - Both visible without login.
   - Search by title/author on the book list (URL query param).

## Later (not in MVP)
- Genre/author filters on the book list (`searchBooks` already accepts `genre`/`author`)
- Ratings and written reviews (+ moderation)
- Reading lists / shelves (want to read, reading, read)
- Reader accounts: sign-up, login and a basic dashboard are done; profile editing, password reset and email verification are not

## Out of scope for now
- File uploads (cover image is a URL)
- External book-data import (Open Library, Google Books)
- Deployment (local development only)

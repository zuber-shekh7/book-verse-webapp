# BookVerse: Product

## Idea
A book **discovery & reviews** platform (Goodreads-style). Curators maintain the catalog by hand; readers browse it publicly.

## Users
- **Readers (public):** browse and view books without an account.
- **Admins / curators:** log in and manage the catalog.

## MVP (v1)
1. **Admin catalog management**
   - Admin login; admin-only routes.
   - CRUD for **books** (title, author, genres, description, cover image URL, ISBN, published year).
   - CRUD for **authors** (name, bio).
   - CRUD for **genres** (name).
2. **Minimal public catalog**
   - Book list page.
   - Book detail page.
   - Both visible without login.

## Later (not in MVP)
- Browse/search with filters by genre/author
- Ratings and written reviews (+ moderation)
- Reading lists / shelves (want to read, reading, read)
- Reader accounts

## Out of scope for now
- File uploads (cover image is a URL)
- External book-data import (Open Library, Google Books)
- Deployment (local development only)

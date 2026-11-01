# BookVerse: Design

Visual and UX reference for the app. Tokens here map onto the shadcn/ui CSS variables in [src/app/globals.css](../src/app/globals.css). Status: **applied** to tokens, fonts, theme toggle, and the public list and detail pages. Remaining items are in [Implementation notes](#10-implementation-notes).

## 1. Principles
1. **Warm and literary.** It should feel like a good bookshop: warm paper tones, a serif voice for titles, a calm burgundy accent.
2. **Covers are the hero.** Give book covers room; keep chrome quiet around them.
3. **Readable first.** Comfortable line lengths, generous line height, strong text contrast.
4. **Admin is efficient.** Same brand, but denser: compact tables and forms, sans-serif throughout, no decoration.
5. **Light and dark are equals.** Both themes are designed, not inverted.

## 2. Color

Defined as oklch and assigned to the existing shadcn variables. Values are starting points; verify contrast (WCAG AA: 4.5:1 body text, 3:1 large text and UI borders) when applying.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--background` | `oklch(0.985 0.006 80)` | `oklch(0.18 0.01 45)` | Page background (warm paper / warm charcoal) |
| `--foreground` | `oklch(0.22 0.015 40)` | `oklch(0.95 0.008 80)` | Body text |
| `--card` / `--popover` | `oklch(0.995 0.004 80)` | `oklch(0.22 0.012 45)` | Cards, menus |
| `--card-foreground` / `--popover-foreground` | same as foreground | same as foreground | Text on cards |
| `--primary` | `oklch(0.40 0.12 18)` | `oklch(0.72 0.12 25)` | Burgundy: primary buttons, links, key accents |
| `--primary-foreground` | `oklch(0.98 0.005 80)` | `oklch(0.18 0.01 45)` | Text on primary |
| `--secondary` | `oklch(0.95 0.012 75)` | `oklch(0.27 0.012 45)` | Secondary buttons, subtle fills |
| `--secondary-foreground` | `oklch(0.28 0.02 40)` | `oklch(0.95 0.008 80)` | Text on secondary |
| `--muted` | `oklch(0.955 0.01 75)` | `oklch(0.27 0.012 45)` | Table stripes, placeholders, skeletons |
| `--muted-foreground` | `oklch(0.50 0.02 50)` | `oklch(0.72 0.015 70)` | Secondary text (authors, years, captions) |
| `--accent` | `oklch(0.93 0.03 45)` | `oklch(0.30 0.03 30)` | Terracotta tint: hover states, selected rows |
| `--accent-foreground` | `oklch(0.30 0.08 25)` | `oklch(0.95 0.008 80)` | Text on accent |
| `--destructive` | `oklch(0.55 0.22 27)` | `oklch(0.70 0.19 22)` | Delete actions, errors |
| `--border` / `--input` | `oklch(0.90 0.015 75)` | `oklch(1 0 0 / 10%)` / `oklch(1 0 0 / 15%)` | Dividers, field borders |
| `--ring` | `oklch(0.55 0.10 20)` | `oklch(0.62 0.10 25)` | Focus ring |

Rules:
- Burgundy is for **one primary action per view** and for links. Do not use it for large fills.
- Burgundy and destructive red are close in hue. Never rely on color alone for destructive actions: use the label ("Delete") and a trash icon, and a confirm step.
- Sidebar and chart variables follow the same palette (`--sidebar*` = card/secondary values; charts unused in MVP, leave defaults).

## 3. Typography

| Role | Font | Notes |
|------|------|-------|
| Headings, book titles | **Lora** (serif) | Public site and page titles |
| Body, UI, forms, admin | **Geist Sans** (already loaded) | Everything else, including all admin headings |
| ISBN, IDs | **Geist Mono** (already loaded) | |

| Style | Size / line height | Weight | Font |
|-------|--------------------|--------|------|
| Display (landing hero) | 3rem / 1.1 (2.25rem on mobile) | 600 | Lora |
| H1 (page title) | 2rem / 1.2 | 600 | Lora (public), Geist (admin) |
| H2 | 1.5rem / 1.3 | 600 | Lora (public), Geist (admin) |
| H3 | 1.125rem / 1.4 | 600 | Geist |
| Body | 1rem / 1.6 | 400 | Geist |
| Small (meta, table cells in admin) | 0.875rem / 1.5 | 400 | Geist |
| Caption | 0.75rem / 1.4 | 500 | Geist |

- Book descriptions: max width ~65ch.
- Book titles on cards: Lora, 2 lines max, truncate with ellipsis.
- Author names and years: `muted-foreground`, Geist Sans.

## 4. Spacing, radius, elevation
- **Spacing:** Tailwind's 4px scale. Use 4/8/12/16/24/32/48/64. Public pages favor 24-48 between sections; admin favors 8-16.
- **Radius:** keep `--radius: 0.625rem`. Covers use `rounded-md`; cards and inputs use `rounded-lg`.
- **Elevation:** flat by default. Cards use a 1px border, no shadow. Only popovers/menus get a soft shadow (`shadow-md`). Book covers get a subtle shadow (`shadow-sm`) so they lift off the page.

## 5. Components

Existing components in [src/components/ui/](../src/components/ui/): button, badge, card, input, label, table, textarea.

| Component | Guidance |
|-----------|----------|
| **Button** | `default` = burgundy, one per view. `secondary`/`outline` for alternatives (Cancel, Back). `ghost` for row actions and icon buttons. `destructive` only for Delete, always with confirm. Default size on public pages, `sm` in admin tables. |
| **Badge** | Genres. Use `secondary` style, pill shape, clickable later for filtering. |
| **Card** | Public: book card = cover (2:3) + Lora title + muted author, no border until hover (border + `accent` tint). Admin: plain bordered container for forms. |
| **Input / Textarea** | Border `--input`, burgundy `--ring` focus. Height 36px in admin, 40px on public/login. |
| **Label** | Above the field, `Small` weight 500. Mark required fields with an asterisk. |
| **Table** | Admin only. Dense rows (~40px), muted header text, hover row `accent`, actions right-aligned as `ghost` buttons. |

Forms: single column, max width ~640px, label above field, helper text in `muted-foreground`, validation error beneath the field in `destructive` with `aria-invalid` set. Submit button at the bottom-left, Cancel as `outline` beside it.

Icons: lucide, 16px in buttons, 20px elsewhere, stroke 1.75.

## 6. Page patterns

### Public book list (`/`)
- Header, then page title (Lora H1), then a **cover grid**.
- Grid columns: 2 (mobile) / 3 (sm) / 4 (lg) / 5 (xl), gap 24px, container max width 1200px.
- Each item: cover at **2:3** ratio, title (Lora, 2 lines), author (muted). Whole card links to the book.
- Missing `coverUrl`: placeholder tile on `muted` with a lucide `BookOpen` icon and the title text.
- Empty catalog: centered message "No books yet" with muted text.

### Book detail (`/books/[id]`)
- Two columns from `md`: cover (max 280px) left, details right. Stacked on mobile.
- Details order: title (Lora H1), authors, genre badges, metadata line (year, ISBN in mono), description (65ch).
- Back link to the list above the title.

### Admin lists (`/admin/books`, `authors`, `genres`)
- Page title + primary "New ..." button on the right.
- Dense table; row actions Edit (ghost) and Delete (ghost, destructive text) at the right.
- Empty state: one line plus the "New ..." button.

### Admin forms (`/new`, `/[id]/edit`)
- Single-column form per section 5, inside a bordered card, page title above.
- Multi-selects (authors, genres) as checkbox lists or badge pickers; at least one author required.

### Login (`/admin/login`)
- Centered card (max 400px) on the page background, BookVerse wordmark in Lora above, email and password fields, one full-width primary button.

## 7. Navigation and layout
- **Public header:** wordmark "BookVerse" (Lora, 600) left, theme toggle right. Sticky not required for MVP. Footer is a single muted line.
- **Admin shell:** top bar with wordmark, nav links (Books, Authors, Genres), current-section highlight (`accent`), theme toggle and Log out on the right. Content max width 1100px.
- **Container:** centered, horizontal padding 16px (mobile) / 24px (md+).
- **Responsive:** design mobile-first; admin tables scroll horizontally on small screens.

## 8. Dark mode
- Class-based: `.dark` on `<html>` (already wired through `@custom-variant dark` in globals.css).
- Toggle in both headers: sun/moon icon button (ghost, `aria-label="Toggle theme"`).
- Persist choice in `localStorage`; default to the system preference on first visit. Set the class before first paint (inline script or `next-themes`) to avoid a flash.
- Dark background is warm charcoal, never pure black. Covers keep a faint border in dark mode so dark covers don't vanish.

## 9. States and accessibility
- **Focus:** visible 3px ring in `--ring` on every interactive element (the shadcn components already do this); never remove outlines.
- **Loading:** reuse the per-segment loading boundaries ([src/components/admin/loading.jsx](../src/components/admin/loading.jsx)); use `muted` skeletons that match final layout (cover tiles on public pages, table rows in admin).
- **Errors:** inline field errors plus a summary message at the top of a failed form; plain-language text, no raw error codes.
- **Empty:** always say what is missing and what to do next.
- **Images:** cover `alt` = "Cover of {title}"; placeholder is decorative with the title as text.
- **Contrast and motion:** meet AA; transitions 150ms ease on color/border/transform only; respect `prefers-reduced-motion`.
- **Keyboard:** all actions reachable by keyboard; delete confirmation dialog traps focus.

## 10. Implementation notes
Items 1-5 are done. Open: 6 (contrast check) and 7.
1. Replace the `:root` and `.dark` values in [src/app/globals.css](../src/app/globals.css) with the tokens in section 2.
2. Load Lora with `next/font/google` in [src/app/layout.js](../src/app/layout.js) (`variable: "--font-lora"`) and add the variable to `<html>`'s className, as Geist is done today. Then in globals.css set `--font-heading: var(--font-lora)` in `@theme inline`. Use `font-heading` on public headings; admin headings stay `font-sans`.
3. Note: `--font-sans: var(--font-sans)` in the current `@theme inline` block refers to itself. Point it at `var(--font-geist-sans)` when touching fonts.
4. Add the theme toggle (and `next-themes` or an equivalent inline script).
5. Update the public list to the cover grid and add the cover placeholder.
6. Re-check contrast of every token pair, tweak values if any fail AA.
7. Record any deviations in [decisions/](decisions/) and keep this file in sync.

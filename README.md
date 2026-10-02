# SOLFRA — Frontend

Company profile, product catalog and inquiry website, plus the admin UI.
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · React Hook Form + Zod.

Theme: **Rosé Pine** (dark, default) with a **Rosé Pine Dawn** light mode and a neon-pink brand gradient.

## Run it

```bash
npm ci
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

| Script | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` / `start` | production build (`output: "standalone"`, ready for a Docker image) |
| `npm run lint` / `typecheck` | CI gates (TechDoc §15.1) |

`.npmrc` sets `ignore-scripts=true` and `save-exact=true`. Every dependency is pinned to a release at least 7 days old (TechDoc §15.3).

## Pages

| Public | Admin (`/admin`, under Cloudflare Access) |
|---|---|
| `/` Home | `/admin/login` |
| `/about` | `/admin` Dashboard |
| `/products` (`?search=` `?category=`) | `/admin/products`, `/new`, `/[id]` |
| `/products/[slug]` | `/admin/categories` (modal create/edit, archive/restore) |
| `/inquiry` (`?product=<slug>` preselects) | `/admin/inquiries` (status + date filters, search) |
| `/inquiry/success` | `/admin/inquiries/[id]` (status changes, notification log) |
| `/contact`, `/privacy` | `/admin/settings` |

## Mock data vs. the real API

All data goes through **`lib/api/public.ts`** and **`lib/api/admin.ts`**. Each function has two paths:

- `NEXT_PUBLIC_USE_MOCK_API=true` (default): reads and writes the in-memory sample data in `lib/mock/data.ts`. Admin changes last until the next full page reload. In mock mode the admin login accepts any email with a password of 4+ characters.
- `NEXT_PUBLIC_USE_MOCK_API=false`: calls the FastAPI REST API at `NEXT_PUBLIC_API_BASE_URL`, using the paths in TechDoc §7. Server components use `API_INTERNAL_URL` when it is set (e.g. `http://api:8000/api` inside Compose).

The fetch client (`lib/api/client.ts`) already handles:
- **Cloudflare Access redirects.** Requests use `redirect: "manual"`, and a redirect is treated as 401, which sends the user back to `/admin/login` (TechDoc §8.1).
- **FastAPI 422 errors.** On the inquiry form, `detail[].loc` entries are mapped back onto the matching form fields.
- **Cookies.** Requests use `credentials: "same-origin"` for the httpOnly session cookie. CSRF tokens are **not** sent yet; add the header in `apiFetch` once the backend's CSRF scheme is decided.

### Contract notes for the backend

The UI follows TechDoc §6–7, plus the additions below. Add them to the backend or remove them from `lib/types.ts`.

| Item | Where | Why |
|---|---|---|
| `products.availability` (`in_stock` / `on_request` / `made_to_order`) | Product | PRD §7.4 "Status produk" on the detail page |
| `products.featured` (bool) | Product | Homepage "Featured Products" |
| `product.category` embedded `{id,name,slug}` | Product responses | Avoids a second lookup per card |
| `categories.product_count` | Category | Shown in filters and admin |
| `inquiries.reference` (e.g. `SLF-260412`) | Inquiry, `POST /api/inquiries` response | Shown to the customer on the success page |
| `inquiries.country` (optional) | InquiryCreate | PRD §8.2 optional "Country/Location" |
| `turnstile_token` | InquiryCreate | TechDoc §11.2 |
| `product_id` nullable ("General inquiry") | InquiryCreate | Contact page inquiries |
| `GET /api/admin/auth/me` | new | Restore the admin session on page load |
| `GET /api/admin/products/{id}` | new | Edit page |
| `POST /api/admin/uploads` → `{ path }` | new | Product, category and logo images |
| `GET` / `PATCH /api/admin/settings` | new | Settings page (PRD §9.6) |

Inquiry status transitions in the UI are `new → contacted | closed`, `contacted → closed`, and `closed → contacted` (reopen). The backend decides; the UI shows a 409 error message if a transition is refused.

## Placeholders to replace

Everything marked **PLACEHOLDER**:
- `lib/mock/data.ts`: company settings, categories, products, sample inquiries. All brand and model names are fictional.
- `components/home/stats.tsx`: company figures. `app/(site)/about/page.tsx`: copy, milestones, industries.
- `public/placeholders/*.svg`: line-art product images. A product with `image: null` falls back to `generic.svg`. Real photos (JPG/PNG/WebP) are shown with `object-cover`.
- `components/brand/logo.tsx` and `app/icon.svg`: placeholder logo mark.
- `app/(site)/privacy/page.tsx`: privacy notice, which needs legal review and a retention period (TechDoc §20).
- Contact page map: a styled placeholder, not an embed.

## Theming

Colors are CSS variables on `:root[data-theme]` in `app/globals.css` and exposed to Tailwind as `bg-base`, `text-ink`, `text-neon`, `border-line`, and so on. Brand utilities: `text-gradient`, `bg-gradient-brand`, `bg-grid`, `glass`, `ring-gradient`. The theme choice is saved in `localStorage` under `solfra-theme`; dark is the default. Motion respects `prefers-reduced-motion`.

## Environment

See `.env.example`: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_USE_MOCK_API`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (without it, a placeholder box is shown and a dummy token is sent), `NEXT_PUBLIC_CF_BEACON_TOKEN`, and optionally `API_INTERNAL_URL` and `NEXT_PUBLIC_SITE_URL`.

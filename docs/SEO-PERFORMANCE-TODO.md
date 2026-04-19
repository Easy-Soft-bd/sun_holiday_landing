# SEO & performance — step-by-step TODO

**Project:** `sunholidaysltd_landing`  
**Goal:** Strong technical SEO and Core Web Vitals; **no “100%” score is guaranteed**—use Lighthouse and Search Console as guides.

**Rule:** Preserve existing UI/design unless a step says otherwise.

---

## P0 — Crawling, broken URLs, and critical content in HTML

- [ ] **P0.1 — Fix `/destinations` (404 today)**

  **AI prompt:**

  > The app links to `/destinations` from Hero, Demo (HolidayCategories), BookingProcess, and not-found pages, but there is no `app/.../destinations` route. Either add a minimal `app/(main)/destinations/page.tsx` that matches existing design (e.g. redirect to `/tours` or a real destinations view) or update all links and `app/sitemap.ts` to the correct canonical path. Do not leave marketing CTAs pointing to 404s.

- [ ] **P0.2 — Complete `app/sitemap.ts`**

  **AI prompt:**

  > Expand `app/sitemap.ts` to include every public `(main)` route: `/tours`, `/blog`, each blog post from `blogData`, `/about`, `/about/teams`, `/contact`, `/visa`, `/tickets`, `/resorts`, `/sailor-moon-resorts`. Add `/tours/[id]` entries from the database (async sitemap) or document a build-time approach. Remove or fix any URL that does not exist. Use `process.env.NEXT_PUBLIC_SITE_URL` or similar for `baseUrl` instead of hardcoding if env is set.

- [ ] **P0.3 — Align `app/robots.ts` with real paths**

  **AI prompt:**

  > Review `app/robots.ts`: it disallows `/private/` but admin lives under `/portal/admin`. Either add `disallow` for `/portal/` (if you want to hide admin from crawlers) or remove misleading rules. Keep `sitemap` URL in sync with production domain.

- [ ] **P0.4 — Server-render tour list for SEO (`/tours`)**

  **AI prompt:**

  > `ToursView` is client-only and loads tours in `useEffect` via `GET /api/tours`, so the initial HTML has little tour content. Refactor so `app/(main)/tours/page.tsx` fetches active tours on the server (Sequelize or cached fetch) and passes data into `ToursView` as props, keeping filters/interactions client-side. Preserve the same UI and filtering behavior after hydration.

---

## P0 — Core Web Vitals (biggest wins)

- [ ] **P0.5 — Remove or shorten `GlobalLoader` delay**

  **AI prompt:**

  > In `src/components/common/GlobalLoader.tsx`, remove the fixed `2500ms` delay after `window` load. Prefer no full-screen blocker, or a short fade (under 200ms) only on first visit if branding is required. Keep `LoadingScreen` visuals if desired but do not block interaction for seconds.

- [ ] **P0.6 — Hero: LCP image + video**

  **AI prompt:**

  > In `src/view/Home/Hero/Hero.tsx`, improve LCP: remove `unoptimized` from the hero `Image` if the source is optimizable, ensure `sizes` and dimensions are correct, and defer hero video (e.g. `preload="none"`, load after `requestIdleCallback` or user interaction, or use a static poster only until play). Do not remove the video entirely unless replacing with an equivalent UX pattern. Keep copy and layout the same.

---

## P1 — Metadata, canonical, social previews

- [ ] **P1.1 — `metadataBase`, canonical, OG, Twitter**

  **AI prompt:**

  > In `app/layout.tsx` metadata, add `metadataBase` from env (e.g. `NEXT_PUBLIC_SITE_URL`), `openGraph.url`, `openGraph.siteName`, `openGraph.images` (default OG image), and `twitter.card` + `twitter.title`/`description`/`images`. Add `alternates.canonical` for the root or use per-route metadata. Do not break existing title/description strings.

- [ ] **P1.2 — Dynamic metadata for home (CMS)**

  **AI prompt:**

  > Add `generateMetadata` in `app/(main)/page.tsx` (or a small helper) that reads `HomePage` / settings from the same source as the page and maps fields to `title`, `description`, and Open Graph where the model provides them, with safe fallbacks to current static strings.

- [ ] **P1.3 — Per-route metadata audit**

  **AI prompt:**

  > Ensure every `(main)` page exports appropriate `metadata` or `generateMetadata` (tour detail and blog already have patterns). Add missing `description` and OG fields where thin. Keep titles consistent with the brand suffix pattern.

---

## P1 — Less JavaScript and fewer duplicate requests

- [ ] **P1.4 — Deduplicate auth: `Nav` vs `TopBanner`**

  **AI prompt:**

  > `Nav.tsx` fetches `/api/auth/me` and `TopBanner` uses RTK `useGetMeQuery`. Consolidate to a single source of truth (e.g. only RTK in layout subtree, or one client provider) so the browser does not duplicate the same request. Preserve admin link visibility and dashboard access behavior.

- [ ] **P1.5 — Scope Redux / Ant Design to where needed**

  **AI prompt:**

  > Evaluate `StoreProvider` and `AntdRegistry` in root `app/layout.tsx`. If Ant Design is only used under `/portal` or a few components, wrap only those segments in `AntdRegistry`. If Redux is only for admin/auth banner, use a nested layout under `app/portal` for `StoreProvider` and a lighter root for marketing pages—without breaking existing imports. Document any component that still needs the root provider.

---

## P2 — Bundles, images, structured data

- [ ] **P2.1 — Slim `IconRenderer`**

  **AI prompt:**

  > `src/components/common/IconRenderer.tsx` imports many `react-icons` namespaces. Replace with explicit per-icon imports from `lucide-react` or only the `react-icons` subpackages actually used in CMS data. Keep the same visual icons for current content.

- [ ] **P2.2 — `priority` on `next/image` audit**

  **AI prompt:**

  > Search for `priority` on `Image` across the repo. Keep `priority` only on the true LCP candidate per route (usually one above-the-fold hero). Remove `priority` from below-the-fold cards (resorts, sailor-moon, visa, blog list) unless measured otherwise.

- [ ] **P2.3 — JSON-LD**

  **AI prompt:**

  > Add JSON-LD script tags (sanitized, valid JSON) for `Organization` and `WebSite` in root layout or home page, using real business name, url, logo, and contact from `GeneralSettings` if available. Optional: `BreadcrumbList` on nested pages.

- [ ] **P2.4 — Remove dead imports**

  **AI prompt:**

  > Remove unused `import * as LucideIcons from "lucide-react"` from `src/Demo.tsx` if still present. Run ESLint unused-import rules on `src/` and fix trivial cases.

---

## P3 — Infra and caching (ties to revalidation doc)

- [ ] **P3.1 — On-demand revalidation**

  **AI prompt:**

  > Follow `docs/ON-DEMAND-REVALIDATION-TODO.md` so CMS and tour updates refresh cached HTML without a full redeploy.

- [ ] **P3.2 — Optional Next config**

  **AI prompt:**

  > Review `next.config.ts` for security/perf headers (long cache for static assets), and ensure `images.remotePatterns` includes every remote image hostname used in DB-driven content.

---

## Verification checklist

- [ ] **V.1 — Lighthouse (mobile)** on `/`, `/tours`, `/tours/[id]`, one blog post: note LCP, CLS, INP/TBT.

- [ ] **V.2 — Rich Results Test / URL Inspection** for homepage and a tour URL after metadata/JSON-LD changes.

- [ ] **V.3 — View page source** on `/tours`: confirm tour titles/links appear without waiting for client JS.

---

## Execution order (suggested)

1. P0.1 → P0.2 → P0.3  
2. P0.5 → P0.6  
3. P0.4  
4. P1.1 → P1.2 → P1.3  
5. P1.4 → P1.5  
6. P2.x and P3.x as capacity allows  

Copy the **AI prompt** under any step when delegating to an automated agent.

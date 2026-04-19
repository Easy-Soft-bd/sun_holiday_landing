# On-demand revalidation rollout — step-by-step TODO

**Project:** `sunholidaysltd_landing` (Next.js App Router + Sequelize/MySQL)  
**Goal:** Serve cached, pre-rendered HTML where possible; when an admin (or API) changes data, invalidate the right cache entries with `revalidateTag` / `revalidatePath` — **without changing UI, copy, or user-facing behavior.**

**Constraints (read before editing):**

- Do **not** change visual design, component structure, or business rules.
- Do **not** remove admin edit flows; preserve `isAdmin()` behavior unless a step explicitly moves auth to the client for static eligibility.
- On-demand revalidation requires a **Node** Next deployment (`next start` or Vercel, etc.). It does **not** work with `output: 'export'` alone.

**Code map (current):**

| Area | How data is loaded today | Mutations (invalidate after) |
|------|---------------------------|------------------------------|
| `(main)/layout.tsx`, `(main)/page.tsx` | `getCachedHomePageData`, `getCachedSettings`, `getCachedAdminStatus` (`React.cache` + DB / cookies) | `POST /api/home-page` |
| Footer / home sections | Same home + settings row | Same + `PUT /api/settings` |
| `/tours` | Client `ToursView` → `GET /api/tours` | `POST/PUT/DELETE /api/tours`, `/api/tours/[id]` |
| `/tours/[id]` | Server `Tour.findByPk` in `page.tsx` + `generateMetadata` | Same tour APIs |
| Uploads | `POST /api/upload` | May affect pages that reference new image URLs |
| Blog, visa, tickets, about, contact, resorts | Mostly static views / local data files | None in API today |

---

## Phase 0 — Baseline

- [ ] **0.1 — Confirm deployment mode**

  **AI prompt:**

  > In the repo root, open `package.json` and `next.config.ts`. Confirm the app is not using `output: 'export'`. If static export is enabled, document that on-demand `revalidateTag` cannot run and the user must switch hosting to a full Next server or remove static export. Do not change config unless the user asked to migrate hosting.

---

## Phase 1 — Shared revalidation contract

- [ ] **1.1 — Add a single source of truth for cache tags**

  **Create:** e.g. `src/lib/revalidate-tags.ts` (or `src/lib/cache-tags.ts`)

  **Export:** string constants such as `TAG_HOME_PAGE`, `TAG_GENERAL_SETTINGS`, `TAG_TOURS_LIST`, and a small helper `tourDetailTag(id: string)` returning a stable tag per tour (e.g. `` `tour-${id}` ``).

  **AI prompt:**

  > Create `src/lib/revalidate-tags.ts` in the Sun Holidays Next.js app. Export readonly string constants for: home page CMS row, general settings row, tours list, and a function `tourDetailTag(id: string)` that returns a deterministic tag for one tour. Add a short comment block at the top explaining these tags are used with `unstable_cache` and `revalidateTag`. Do not import this file from client components.

- [ ] **1.2 — Document tag → route mapping (comment only)**

  **AI prompt:**

  > At the bottom of `src/lib/revalidate-tags.ts`, add a commented list mapping each tag to which user-facing routes should refresh when it is invalidated (e.g. home tag → `/`, settings tag → layout/footer). No runtime code.

---

## Phase 2 — CMS reads: `unstable_cache` + tags

- [ ] **2.1 — Wrap home page DB read**

  **Files:** `src/lib/get-page-data.ts` (and optionally split `src/lib/data/home-page.ts`)

  **AI prompt:**

  > Refactor `getCachedHomePageData` in `src/lib/get-page-data.ts`. Keep the same return type and Sequelize query (`HomePage.findOne()`, plain object or null). Wrap the DB access in `unstable_cache` from `next/cache` with a stable key array (e.g. `['home-page']`) and `tags: [TAG_HOME_PAGE]` from `src/lib/revalidate-tags.ts`. Keep using `cache()` from React only if still needed for per-request deduplication alongside `unstable_cache`, or remove redundant layering if `unstable_cache` alone dedupes sufficiently — do not change what data is returned. Do not call `cookies()` inside this function.

- [ ] **2.2 — Wrap general settings DB read**

  **Files:** `src/lib/get-page-data.ts`

  **AI prompt:**

  > Same as 2.1 but for `getCachedSettings`: wrap `GeneralSettings.findOne()` in `unstable_cache` with tag `TAG_GENERAL_SETTINGS`. Preserve return shape and null handling. No `cookies()` here.

- [ ] **2.3 — Leave admin detection unchanged (for now)**

  **Files:** `src/lib/get-page-data.ts` — `getCachedAdminStatus`

  **AI prompt:**

  > Leave `getCachedAdminStatus` calling `isAdmin()` as today (still uses `cookies()`). Optionally keep it on `cache()` from React for request deduplication. Do not move to `unstable_cache` (admin is per-request). Add a one-line comment that this keeps the `(main)` segment dynamic until a later optional step isolates admin on the client.

---

## Phase 3 — Invalidate when admins write CMS data

- [ ] **3.1 — After home page save**

  **Files:** `app/api/home-page/route.ts`

  **AI prompt:**

  > In `app/api/home-page/route.ts`, after a successful `homePage.save()` (inside the existing POST handler), import `revalidateTag` from `next/cache` and call `revalidateTag(TAG_HOME_PAGE)` using the constant from `src/lib/revalidate-tags.ts`. Also call `revalidatePath('/')` if you want immediate consistency for the root path in dev — prefer tags as primary. Preserve all auth checks, status codes, and JSON body shape. Do not change validation logic.

- [ ] **3.2 — After general settings save**

  **Files:** `app/api/settings/route.ts`

  **AI prompt:**

  > In `app/api/settings/route.ts`, after a successful `settings.update` or `create` in the PUT handler, call `revalidateTag(TAG_GENERAL_SETTINGS)`. If footer or global UI reads settings on every `(main)` page, also `revalidatePath('/', 'layout')` or revalidate the `(main)` layout path segment per Next.js docs — choose the minimal set that refreshes footer without changing API response. Keep GET/PUT behavior and auth identical.

---

## Phase 4 — Tours: cached reads + invalidation on mutations

- [ ] **4.1 — Tag the public tours list API response**

  **Files:** `app/api/tours/route.ts`

  **AI prompt:**

  > Refactor `GET` in `app/api/tours/route.ts` so the `Tour.findAll` result is produced inside `unstable_cache` with key parts like `['api-tours','all']` and tag `TAG_TOURS_LIST`. The exported `GET` handler should await that cached function and still return `NextResponse.json` with the same array shape as today. Keep `authenticate`/`sync` behavior unless it causes cache stampede — if `sync` must run every time, document in a comment; prefer not to change observable JSON. Do not cache POST.

- [ ] **4.2 — Invalidate tours list on create/update/delete**

  **Files:** `app/api/tours/route.ts`, `app/api/tours/[id]/route.ts`

  **AI prompt:**

  > After successful `Tour.create` in POST `/api/tours`, call `revalidateTag(TAG_TOURS_LIST)`. After successful `update` or `destroy` in `/api/tours/[id]`, call `revalidateTag(TAG_TOURS_LIST)` and `revalidateTag(tourDetailTag(id))`. Preserve auth and error handling. Do not change response bodies.

- [ ] **4.3 — Tag single-tour reads used by the tour detail page**

  **Files:** `app/(main)/tours/[id]/page.tsx` (and optionally a small `src/lib/data/tour.ts`)

  **AI prompt:**

  > Extract tour loading for `app/(main)/tours/[id]/page.tsx` into a function that uses `unstable_cache` with key including the tour `id` and tags `[tourDetailTag(id), TAG_TOURS_LIST]` or only `tourDetailTag(id)` if list invalidation is enough — prefer invalidating the detail tag on PUT/DELETE. Use the same Sequelize query as today (`findByPk`). Use this function in both `generateMetadata` and the default export so metadata and page stay consistent. Preserve `notFound()`, error handling, and `tour.toJSON()` passing to `TourDetailsView`. Do not change the view component.

---

## Phase 5 — Uploads and edge cases

- [ ] **5.1 — Revalidate when uploads affect visible CMS**

  **Files:** `app/api/upload/route.ts`

  **AI prompt:**

  > After a successful file write in `POST` `app/api/upload/route.ts`, call `revalidateTag(TAG_HOME_PAGE)` only if that matches how the app uses uploads (hero/images edited via home CMS). If uploads are generic, instead document in code comments which tags to add once you know which sections reference `/uploads/...`. Do not weaken auth or file validation. If unsure, add `revalidateTag(TAG_HOME_PAGE)` and `revalidateTag(TAG_GENERAL_SETTINGS)` behind a short comment that admin may tune this to avoid over-invalidation.

---

## Phase 6 — Optional: maximize static caching (behavior-preserving as much as possible)

> **Note:** Today `(main)/layout.tsx` and `page.tsx` call `getCachedAdminStatus()` → `cookies()`, so Next treats these routes as **dynamic**. Tags still **invalidate** the data cache, but HTML may not be fully static until admin is not read on the server for public pages.

- [ ] **6.1 — (Optional) Server renders `admin={false}`; client elevates for edit UI**

  **Files:** `app/(main)/layout.tsx`, `app/(main)/page.tsx`, and any child that receives `admin` — plus one small client provider or existing `Nav`/auth pattern.

  **AI prompt:**

  > Without changing the visual design of edit buttons or the admin banner: stop calling `getCachedAdminStatus` in `app/(main)/layout.tsx` and `app/(main)/page.tsx`. Pass `admin={false}` from server. Add a client-only wrapper (or reuse existing `/api/auth/me` / Redux patterns) that sets `admin` after mount for components that need it (`Hero`, footer, CTAs, etc.), preserving the same props once hydrated. Ensure no flash of incorrect **public** content (public users should never see admin controls; a brief delay before edit buttons appear for admins may be acceptable — match current security). Then add `export const dynamic = 'force-static'` to `(main)/layout.tsx` or `page.tsx` only if Next allows it without errors. If `force-static` is incompatible with any remaining dynamic API, document and skip.

- [ ] **6.2 — (Optional) `generateStaticParams` for tours**

  **Files:** `app/(main)/tours/[id]/page.tsx`

  **AI prompt:**

  > If Phase 6.1 is done and tour pages should be statically generated at build time, add `generateStaticParams` that loads active tour IDs from the DB (or a cheap query) and returns `{ id }[]`. Keep on-demand updates via `revalidateTag(tourDetailTag(id))` after admin edits. Do not remove dynamic fallback for new tours if Next requires `dynamicParams = true`.

---

## Phase 7 — Verification

- [ ] **7.1 — Manual test checklist**

  **AI prompt:**

  > Add a short section to this doc or to `README` with manual steps: (1) Load `/` twice — second load should be fast. (2) Change home content in admin, save, hard refresh `/` — new content appears without redeploy. (3) Change settings, verify footer. (4) CRUD a tour, verify `/tours` client list and `/tours/[id]` update after refresh. No code changes required if only documenting.

- [ ] **7.2 — Lint and build**

  **AI prompt:**

  > Run `npm run lint` and `npm run build` from the project root. Fix any TypeScript or ESLint issues introduced by `unstable_cache`/`revalidateTag` imports. Do not fix unrelated pre-existing issues unless they block the build.

---

## Quick reference — imports

```ts
import { unstable_cache } from 'next/cache';
import { revalidateTag, revalidatePath } from 'next/cache';
```

---

## Summary order of execution

1. Phase 1 — tags module  
2. Phase 2 — wrap home + settings reads  
3. Phase 3 — revalidate on home + settings APIs  
4. Phase 4 — tours API + tour detail page  
5. Phase 5 — uploads  
6. Phase 6 — optional static + admin client-only  
7. Phase 7 — verify  

Copy the **AI prompt** under any step into your agent when you want that step implemented in isolation.

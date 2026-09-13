# Pisell Global Growth workspace

The integrated application is deployed as the `pisellglobal` Cloudflare Worker. The original exhibition tracker and venue directory are reused in `vendor/`, with shared data supplied by the authenticated Worker API.

## Implemented

- Approved light Pisell homepage, department pulse, Dashboard / Projects / Map and consistent project detail.
- 34 sourced exhibition opportunities with List / Calendar / Map, entry guides, source trail, shared notes, additive imports and export.
- 147 sourced venue records with name/location, stage, type, evidence, brand, opening-date filters, Google place photos, map and calendar.
- Persistent venue exclusions and restoration, including identity keys to prevent renamed reimports.
- Exhibition-to-work-project creation. Levels 1 / 2 / 3 compose the same task template. No booking or external contact is triggered.
- Project creation/editing, task progress, next action, deliverable, outcome and activity history.
- Marketing Readiness library and project attachments, stored privately in R2.
- Server login, password hashing, HttpOnly session cookies, same-origin mutation checks, admin/member/viewer roles, login throttling and revision conflict protection.

## Scope boundaries

Global Alerts presents 15 sourced event signals across a Melbourne-led collection, with additional Australian and Thai records. Create alert explains the GPT collection and import workflow; no research API is connected. The complete venue store has 151 records; the Melbourne search collection has 147. It is a dated research snapshot, not a connected global live feed. V0 venue collection is separate from customer interest. The schema distinguishes companies, venues, opportunities, milestone evidence, orders, payments and handovers; it does not invent V1–V3 qualifications or formal customers.

Existing playground customers are imported from Pisell Cases and linked to ongoing service projects. Shared Commercial tabs record contract details and verified payment receipts; unknown amounts remain unprovided. Partners and other collections provide real empty states until records exist. Broader CRM editing, automated research crawling, the existing quotation system and case-library integration are not activated. The inherited exhibition AI service connection remains configurable but no search endpoint has been supplied. Google images identify listings, not construction progress; attribution remains visible. Imported source records and user notes are shared; third-party connection settings remain browser preferences.

## Develop and deploy

Run from the repository root:

```sh
npm ci
npm run build
npm run db:local
node workbench/scripts/seed.mjs
node workbench/scripts/alerts-seed.mjs
npx wrangler d1 execute DB --local --file workbench/seed.sql
npx wrangler d1 execute DB --local --file workbench/alerts.seed.sql
npm run dev
```

`wrangler.jsonc` is the only deployment configuration. Its custom build command builds both modules even when Cloudflare's connected repository uses the default `npx wrangler deploy` command. Production database migrations and initial research import are deliberate administration steps, not run on every deployment:

```sh
npm run check
npm run db:remote
npx wrangler d1 execute DB --remote --file workbench/seed.sql
npx wrangler d1 execute DB --remote --file workbench/alerts.seed.sql
npm run deploy
```

Research seeding is additive and preserves notes, exclusions and manually created records. Existing curated facts are not silently replaced. Changes to existing factual records need an explicit sourced revision migration. Initial research snapshots are also archived in the private R2 bucket under `research/2026-09-12/`.

The initial owner's credentials are in ignored `access.local.json` on the deployment machine. No passwords, hashes, login sessions, Cloudflare credentials or private notes are committed. The provisioning helper reads the existing Wrangler login and only operates on this named project. Do not commit local access files or browser session artifacts.

## Structure

- `public/`: shared shell, responsive styles and homepage.
- `vendor/`: preserved module implementations with database adapters and embedded layout.
- `worker/`: authenticated API, shared validation and identity logic.
- `migrations/`: versioned relational schema and indexes.
- `data/`: public research seed snapshots, excluded from served assets.
- `scripts/`: deterministic build, additive seed and project provisioning.
- `test/`: model, SQLite and local HTTP checks.

See [Architecture](ARCHITECTURE.md) and [Validation](VALIDATION.md).

## Approaching plans prepared in GPT

Global Alerts and Venue Search share Summary / Evidence / Approaching Plan. Evidence includes dated venue sources and alert sources without duplicating identical claims. Plan preparation remains in GPT; the frontend only reads archived versions, copies a briefing, and opens/downloads PDFs. No generation or outbound contact API is connected.

To archive a plan after the owner discussion:

1. Match the existing `venueId` (shared by venue and alert drawers) or `projectId`; never create a duplicate venue to store a plan.
2. Upload the completed PDF to the authenticated `POST /api/files` as multipart `file`, `category=approach_plan`. For work-project files also include `project_id`. PDFs remain in private R2.
3. `POST /api/approach-plans` with exactly one `venueId` / `projectId`, `version` (positive integer, next unused version), `title`, `summary`, `preparedAt` (`YYYY-MM-DD`), `status` (`draft` or `ready`), `pdfFileId` (from upload) and `content`. Content uses `objective`, `decisionMakers`, `fit`, `outreach`, `steps`, `materials`, `unknowns`; each is text or a list of text. Keep dated actions, assumptions and confirmed decisions explicit.
4. Ready requires a stored PDF. Existing versions cannot be overwritten. Drafts may omit the PDF. `GET /api/approach-plans?venueId=...` or `?projectId=...` lists newest versions first. The `/api/approach-plans/{id}/pdf` route previews inline; adding `?download=1` downloads it.

Use the normal authorized workspace session. Viewer accounts cannot upload/archive. Archiving a plan does not contact anyone, confirm customer interest, advance qualification, or authorise delivery. Completed plans and PDFs are only added after the task discussion supplies them; no sample plans are seeded to production.

## Marketing Library

Assets and Materials share one record layout and central category / language / format / status configuration. `marketing_items` stores metadata and private file references; `marketing_derivations` links a material to existing asset IDs. Types are immutable, links are validated and revision checks reject stale saves. The Overview consumes these same records and thumbnails.

Authenticated uploads use `POST /api/marketing/uploads` with name, contentType and bytes, then sequential 8 MB `PUT /api/marketing/uploads/{id}/parts?part=N` bodies, followed by `POST .../complete`. Completion validates all parts and is retryable; files up to 250 MB are supported. Multipart records leave the legacy SHA-256 field empty rather than claiming a whole-file hash was computed. Original, preview and thumbnail objects are private R2 files; no browser API key or public bucket is required.

`GET /api/marketing/items` lists records. POST creates and PUT `/api/marketing/items/{id}` updates using `revision`, `kind`, `title`, `category`, `language`, `format`, `status`, `version`, `description`, `sourceNote`, `fileId`, optional `previewFileId` / `thumbnailFileId`, and `assetIds`. GET `/file`, `/preview` and `/thumbnail` require authentication. Uploaded images receive lightweight WebP thumbnails. Uploading or marking a material ready does not send it to customers.

Initial production content uses the Playground Solution v07 PNG preview and six source assets. **Do not upload the PSD files**; the editable Photoshop sources remain local at the user's request. The v07 material stays Draft; printing specifications have not been approved.

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

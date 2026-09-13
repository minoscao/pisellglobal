# Integrated workspace validation

12 September 2026. Both upstream tasks were confirmed completed before their final module files were copied into `vendor/`. The original working directories were not modified by integration.

## Scope checked

- Homepage preserves the approved light Pisell orange/white/charcoal direction and original logo. Department work is distinct from research collections and customer milestones.
- Applied `ui-ux-pro-max`: keyboard navigation, visible focus, skip navigation, consistent controls and detail drawers, responsive tables, meaningful loading/error/saved states and reduced motion. MASTER.md governs color, typography and density.
- Shared project view and filters; data-driven project cards/list/details; shared status definitions; no fabricated project, partner, revenue or customer numbers.
- Exhibition list/calendar/map, source references, venue directory and its existing date/stage/brand/evidence filters remain usable inside the workspace.

## Automated checks

- 5 Node checks: stable exhibition identity, template extension, alias/place-id exclusions, invalid workstream/status rejection and safe evidence links.
- 7 SQLite checks: 34 exhibitions / 147 venues, foreign keys, rerun without overwriting manual notes or exclusions, rediscovered record IDs reuse the excluded venue identity, every exhibition/entry-guide source resolves, physical venue state does not create a customer, and stale note updates roll back a batch.
- Local HTTP checks against actual Wrangler D1/R2: authenticated access, protected module assets, secure session cookies, foreign-Origin rejection, source integrity, exclusion/restore, stale note/project conflict rejection, R2 upload/download integrity, download access protection and revoked logout session.
- Build and Wrangler deploy dry run succeed with D1, R2 and static assets bound. GitHub CI repeats syntax/model/database/build/dry-run checks.

## Browser checks

Playwright CLI with real Chromium, local Wrangler:

- Login and homepage load; original logo and world map visually inspected.
- Exhibition keyword search; TAAPE evidence drawer; shared note and Shortlisted status saved successfully.
- Create TAAPE work project with Level 2; exactly 8 template tasks generated; task status and additional task saved.
- Exhibition Google Map loaded with the Bangkok marker; explicit approximate-city label preserved. Calendar and List use the same search selection.
- Leave exhibition module and return: keyword filter preserved.
- Venue name/suburb search and Google place photos loaded. Exclusion was exercised through UI; removal/restore and identity preservation independently verified through actual HTTP/D1.
- Homepage, exhibitions and discovery measured at 375 / 768 / 1024 / 1440 / 1920px, including embedded venue document: no horizontal page overflow after layout settles. Desktop/mobile screenshots captured; 844 × 375 landscape and reduced-motion checked.
- Earlier icon sizing and mobile map-note overlap defects were corrected before delivery.

Validation writes remain in the local database/R2 only. Production starts with the imported research, administrator account and original research archives, with zero invented work projects or customers.

## Limits

Native browser 200% zoom has not been separately certified. Google Maps logged a non-blocking advanced-marker event deprecation warning and slow-network font fallback; maps and photos loaded. External sources remain dated research, and unverified dates/figures retain their original caveats. AI research backend, quotation, case-library connections and outbound contact are not claimed as active.

## Production verification

- Published at https://pisellglobal.minoscao.workers.dev with the D1 and private R2 bindings verified.
- Real production HTTP: unauthenticated research rejected, administrator login successful, bootstrap / 34 exhibitions / 147 venues / empty file library read successfully, logout revoked.
- Chromium authenticated production homepage inspected visually. No synthetic test records were written to production.
- The original standalone Site exclusion table and fingerprint endpoint were checked at migration: both empty. Its data was not deleted or modified. The new workbench maintains its own authoritative exclusions; the older Site is not synchronised.
- GitHub Actions passed the initial integration commit. Direct Cloudflare deployment is verified; connected-repository automatic build triggers could not be inspected with the available OAuth scope.

## 13 September update

- Reused the latest sourced venue/social research and shared trigger, chart and marker modules. MASTER.md governs visual direction; ui-ux-pro-max navigation, focus, responsive density and feedback guidance applied.
- Full desktop navigation labels; same navigation on mobile. Global Alerts has 15 sourced signals, dated updates, Create alert guidance, 35 persisted trigger preferences and revision-protected follow-up notes. No research API or recurring scanner is connected.
- User's latest request supersedes earlier modal behavior: all detail drawers are nonmodal, outside pointer/wheel interactions dismiss them, another record switches selection. Inside controls remain usable. Venue photos have previous/next arrows and map labels appear at zoom 14.
- Desktop venue filters verified on one row; overview, alerts and embedded venue layouts pass overflow checks at 375, 768, 1024, 1440 and 1920px. Mobile navigation verified.
- Real Chromium verified nonmodal details, outside dismissal, map-marker opening, zoomed labels and Google photo previous/next controls. Global alert creation guidance and saved trigger controls verified.
- 5 Node and 9 SQLite checks passed. Local HTTP checks cover authentication, 147-record Melbourne collection, 15 alerts, 35 triggers, stale trigger/review conflicts, excluded alerts, note preservation and R2 upload/download.
- Production migration is additive. Existing venue research was refreshed only for sourced social/revenue fields under revision and exclusion guards. Original import guard accepted 147 records against a fresh hosted ledger. Manual notes and permanent exclusions are preserved; test writes stayed local.

## Global footprint correction

The overview now uses interactive Google Maps with reusable Pisell style configuration. Countries with existing venues, exhibitions or selected projects are shaded orange. Country summaries are read from D1 with permanent exclusions applied; region presence is a separate annotation. A region drawer lists the actual sourced records. Natural Earth country boundaries and attribution are recorded in THIRD-PARTY.md. The shared Google loader is reused by Global Alerts.

Browser checks confirm 17 shaded region features, Thailand’s 3 venues and 2 exhibitions, Singapore’s 3 exhibitions, nonmodal region details, working zoom controls and no mobile horizontal overflow.

## Existing customers and two footprint metrics — 13 September

Imported the 12 playground/kids-cafe profiles from the existing Pisell Cases customer-entry library, using stable source identities. Owner confirmed signed/in-service status in this task; the original active status and the owner confirmation are retained separately from missing signed documents, dates and amounts. Four exact Melbourne venue identities are reused; brand branches are not automatically qualified. No demo POS accounts are imported.

Commercial records reuse companies, opportunities, V3 confirmations, orders and payments. Customer and project Commercial tabs render the same component. Amounts use integer minor units with currency-specific precision. Unknown payment history never implies zero receipts or a calculable outstanding balance. Receipt uniqueness and revision checks prevent duplicate or stale saves. Test receipts and contract amounts were written to local development only.

Footprint now separates existing work projects and active V0–V2 venue leads, excluding exact V3-linked venues and permanent exclusions. Exhibition records do not become customer leads. Darker orange represents more existing projects; lighter orange represents leads only. Known partial Australia/Thailand research is dated and scoped; unresearched regions show Not available, including when they have an existing customer project. Source country outlines are unchanged.

Passed 8 Node and 9 SQLite checks, local HTTP financial precision/stale-save/duplicate-receipt checks, customer reimport preservation, customer/project Commercial navigation, United States unknown values, China existing project plus unknown leads, and 375px customer layout overflow. Shared UI guidance applied: static status badges, explicit empty data, visible field labels, saved/error feedback and keyboard focus. Source profiles and imported commercial metadata stay in authenticated D1 and private R2, not public seed files.

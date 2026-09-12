# Integrated workspace validation

12 September 2026. Both upstream tasks were confirmed completed before their final module files were copied into `vendor/`. The original working directories were not modified by integration.

## Scope checked

- Homepage preserves the approved light Pisell orange/white/charcoal direction and original logo. Department work is distinct from research collections and customer milestones.
- Applied `ui-ux-pro-max`: keyboard navigation, visible focus, skip navigation, consistent controls and detail drawers, responsive tables, meaningful loading/error/saved states and reduced motion. MASTER.md governs color, typography and density.
- Shared project view and filters; data-driven project cards/list/details; shared status definitions; no fabricated project, partner, revenue or customer numbers.
- Exhibition list/calendar/map, source references, venue directory and its existing date/stage/brand/evidence filters remain usable inside the workspace.

## Automated checks

- 5 Node checks: stable exhibition identity, template extension, alias/place-id exclusions, invalid workstream/status rejection and safe evidence links.
- 6 SQLite checks: 34 exhibitions / 147 venues, foreign keys, rerun without overwriting manual notes or exclusions, every exhibition/entry-guide source resolves, physical venue state does not create a customer, and stale note updates roll back a batch.
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

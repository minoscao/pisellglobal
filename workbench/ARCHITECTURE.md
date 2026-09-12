# Storage and ownership

The user's “D1/D2” request is implemented as Cloudflare **D1 + R2**: D1 is the relational database; R2 is object storage. No Cloudflare service named D2 is assumed.

| Record | Authoritative storage | Relationship |
| --- | --- | --- |
| Projects and tasks | D1 `work_projects`, `tasks` | One work container across department workstreams; optional exhibition identity |
| Exhibition research | D1 `exhibitions`, `exhibition_sources` | Stable id plus unique name/country/edition identity; indexed dates and country |
| Venue research | D1 `venues`, `venue_identity_keys`, `venue_sources` | Physical stage independent of qualification; known place id and aliases retained |
| Source records | D1 `sources`, `source_collections` | URL uniqueness; explicit many-to-many evidence references |
| Notes | D1 `record_notes` | Separate from sourced facts; actor, timestamp and optimistic revision |
| Exclusions | D1 `exclusions`, `exclusion_keys` | Recoverable history prevents unwanted reimports |
| Enterprise identity | D1 `companies`, `contacts`, `partners` | Shared company identity, four partner types, three customer types |
| Commercial work | D1 opportunities, milestone confirmations, quote references, orders, payments, handovers | Evidence-backed V1/V2/V3; quote source references; independent software/hardware recipients |
| Uploaded file bytes | Private R2 `pisellglobal-files` | Opaque object keys; never public by default |
| File metadata | D1 `files` | SHA-256, size, MIME type, owner and project link |
| Original seed archives | Private R2 `research/2026-09-12/` | Source snapshots for recovery and comparison, not the editable operational database |
| User access | D1 users and sessions | PBKDF2 password hashes; random session secrets stored only as SHA-256 hashes |

Scalar business fields, indexes, foreign keys and related tables drive operational queries. JSON payloads preserve the original research detail as a source record; they are not used as a substitute for project/task/identity/note relationships. No operational writes use browser storage. The original modules' client preference settings are separate from shared research data.

D1 batches apply imports and related source records atomically. Notes reject stale revisions; concurrent stale writes fail a database constraint rather than replacing another user's note. Project and task updates use revision checks. A successful file upload writes R2 first, then records D1 metadata; if the D1 write fails, the newly uploaded object is removed.

All data APIs, module assets and file downloads require a valid server session. The root sign-in shell contains no research data. Mutations require the same Origin and editing role; sessions expire after 12 hours and are invalidated on logout. Files download as attachments. Passwords and session tokens are never placed in public configuration.

External references: [Cloudflare D1](https://developers.cloudflare.com/d1/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/). Base geography uses the public-domain [Natural Earth 1:110m country boundaries](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson). The homepage marker identifies Australian regional presence, not an office street address or a fabricated project.

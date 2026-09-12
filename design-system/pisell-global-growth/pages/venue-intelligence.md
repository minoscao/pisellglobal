# Venue intelligence — Melbourne inventory

User-authorized implementation, 12 September 2026. Research snapshot, not a simulated live feed.

Use approved Pisell tokens and the existing logo on an orange background. English UI. Primitive views: table, responsive card rendering, shared detail drawer. Search, stage, venue-type and confidence filters share one state and retain URL context.

Fields: identity and aliases; address; physical/project stage; opening-date claim and basis; evidence confidence; assessment; source URLs, access and dates; zone-specific status; unknowns and next step. No invented map coordinates or guessed opening dates.

State collection includes announced, planning, construction, pre-opening, partially open, operating, unresolved, conflicting and closed/paused display states. These describe the venue and do not replace V0–V3 commercial milestones. Show source availability explicitly, including social links whose feeds could not be read.

Partially open venues require zone detail. A court opening never marks the entire playground open. Rebrands preserve the former name on the same location record. Old announcements and unresolved signals remain discoverable.

Source of record: intelligence/venue-opportunities.json. The delivered page is an export of those records. It does not write qualification, contact prospects or connect a live source feed.

## 12 September — requested working views and exclusions

List, Google Map and Opening Calendar share filters and the same venue drawer. Opening is a first-class field with date precision and claim status. Exact reported dates appear on calendar days; month-only, vague windows and operating-by evidence never become invented opening days. All unknown dates remain accessible below the calendar.

Each record includes area and area scope, reported suburb, Pisell market region, brand-network affiliation and photo reference. Market region is a geographic sales grouping, not an LGA. Live Google address details supply council/LGA where available. Preserve photo attribution, loading and failure states. Mall photographs/pins are explicitly labelled and cannot prove the tenant is ready. Google place IDs are matched per location; API photo references are fetched at display time rather than permanently stored.

The authorised owner can delete into a permanent, server-stored exclusion ledger and restore from Excluded. Public visitors remain read-only. All reads and subsequent imports check identity keys; deleting one branch never excludes an entire brand. Follow docs/VENUE-EXCLUSIONS.md.

ui-ux-pro-max guidance applied: visible keyboard focus, labels wrapping in filter groups, predictable shared drawer and shared view context. The initial broad UX search was off-topic and discarded; the targeted navigation/filter search supported keyboard navigation and wrapping controls. Existing Pisell MASTER tokens remain authoritative.

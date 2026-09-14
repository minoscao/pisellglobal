# Global Alerts and Venue Search loading repair

14 September 2026

## Cause

The production release `22733444-1fd3-471d-b049-bae6b4487399` served both page modules, but returned 404 for `research-coverage.js`, `research-coverage.css` and `research-coverage.geojson`. Both pages statically imported the missing shared module, so their JavaScript could not start. The prior exhibition release preparation reused an older asset-name list and did not include these later additions.

This was an incomplete asset release, not a database capacity issue. Authenticated reads returned the exhibition directory and venue/alert data successfully before the repair.

## Repair

- Downloaded the current deployed worker, settings and 92 available assets, checking current workspace and staged additions as well as the latest release set.
- Preserved all 92 files byte for byte and restored only the three missing coverage files from the current approved workspace version.
- Preserved the two unfilled Los Angeles and Melbourne reference outlines, labelled In progress.
- Released with the production-head guard and deployment lock. Result: `1a5e93b7-2cfe-432f-9341-655dc0aee908`.
- No research, customer, exclusion or commercial records were changed by the repair.

## Verification

- Global Alerts rendered 69 alert cards.
- Venue Search rendered 363 non-excluded rows; the raw collection retained 366 records.
- Exhibition list and GTI detail opened; the Exhibitors tab reported 541 participants and displayed their records.
- Browser checks reported no page errors during these flows.
- All 34 shipped JavaScript modules passed dependency resolution.
- Four targeted tests passed, including a reproduction that rejects a missing dependency behind a dynamic page import.

## Release protection

`deploy-reviewed.mjs` now parses and resolves every shipped JavaScript module before publishing, in addition to checking the required assets, feature references, production base and deployment lock. A missing shared import stops release preparation instead of appearing as a blank page in production.

Use the guarded release path for future deployments. Updating a data collection must not reconstruct the site's asset set from a historical filename list.

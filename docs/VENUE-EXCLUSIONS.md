# Permanent venue exclusions

The hosted Site is the source of truth for manual exclusions. Never clear its D1 tables during a research refresh, rebuild or deployment. Deletion retains a private snapshot for owner restoration; it is not browser-local state.

Before merging or exporting future venue discoveries, call `filterImport` from `venue-directory/import-guard.mjs`. It retrieves current exclusion fingerprints from the existing Site, fails closed if unavailable, and returns accepted/skipped records. Exclusion matches use stable record ID, verified Google place ID, or normalised venue name/alias plus street address. Brand-wide homepage links are deliberately not exclusion keys: deleting one branch must not remove other branches.

Match new discoveries to existing identities before calling the guard. Incomplete records or entirely new spellings without an address/place ID cannot be reliably matched; hold suspected duplicates for review instead of auto-importing. Preserve aliases and place IDs when updating or rebranding records.

`/api/data` independently applies the same exclusion keys on every read, so a refreshed dataset or changed record ID cannot resurrect a known matching venue. `/data.json` also uses this protected read path. Raw dataset assets are not served publicly.

Only the Site owner's verified ChatGPT identity may delete or restore. Public visitors can browse; public import fingerprints contain no snapshots or deletion actor information. A restore is explicit. When storage is unavailable, the directory reports failure instead of falling back to an unfiltered list.

# Google Maps configuration

The current map is the Google Maps JavaScript SDK. Its browser key is necessarily supplied to the signed-in browser; Cloudflare Secret storage does not make that runtime browser key invisible. Do not describe this as a server-only secret or mark a historical exposure resolved merely because the storage location changed.

## One configuration source

- Worker secret: `GOOGLE_MAPS_BROWSER_KEY`, stored as a Cloudflare Secret, never a plaintext `vars` value.
- Runtime route: `/venues/maps-config.js`, handled by `workbench/worker/maps-config.mjs` after normal session identification. All signed-in members can use it; no additional business role or approval is required.
- Response: private, no-store, varies by Cookie. Anonymous access returns 401. Missing configuration returns 503 without echoing a value. Static `workbench/vendor/venues/maps-config.js` is an empty placeholder, not a second configuration source.
- Existing venue, exhibition, overview and media consumers retain their shared runtime URL, so reopening the system reads the deployed secret without a new per-user setting.

## Provider restrictions and historical exposure

The browser key must be restricted in Google Cloud to the actual deployed website origins and required Maps/Places APIs. Check observed API use and any other applications sharing the old key before rotating it. Current consumers use Maps JavaScript and Places details/photos. Do not use a private server API key in this browser route.

The old key was committed to the public `minoscao/pisellglobal` repository. Removing it from current files does not erase Git history or invalidate existing copies. Create a suitably restricted replacement in Google Cloud, update the Worker secret, validate all map consumers, then revoke the exposed old key after checking other legitimate consumers. Leave the GitHub alert open until resolution is verified. No replacement or revocation is implied by the current storage migration.

## Deployment and verification

Use the required reviewed deployment guard with a complete latest-production asset snapshot. An ignored temporary JSON file may be passed with `--secrets-file`; other existing secrets are preserved. Never print the file contents, put a key in command arguments, or commit that input. Delete the temporary input after successful upload. Re-run map-config and startup tests, check anonymous rejection and no-store responses, and inspect the real signed-in maps after deployment. A release must contain no Google key literals in its static assets.

References: [Google Maps security guidance](https://developers.google.com/maps/api-security-best-practices), [Cloudflare Worker Secrets](https://developers.cloudflare.com/workers/configuration/secrets/).

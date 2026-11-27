# Round status configuration

Set `firstKickoffAt` and `fullTimeAt` in `public/fixtures.json` using ISO 8601 timestamps with the Ireland offset for the relevant date (Z for UTC in winter, +01:00 in summer).

Example only (not actual fixture dates):

```json
"firstKickoffAt": "2026-12-05T12:30:00+00:00",
"fullTimeAt": "2026-12-08T13:00:00+00:00"
```

`fullTimeAt` must be 13:00 Europe/Dublin on the day after the last scheduled match.

Before firstKickoffAt: UPCOMING; between times: LIVE; after fullTimeAt: FULL TIME. The browser updates the status every 15 seconds without a redeploy.

Until these dates are configured the badge falls back to LIVE, preserving existing behaviour.

The text 'Awaiting kick off.' replaces the specific FPL partial-score error. Other errors (network or manager matching) are unchanged.

No changes were made to authentication, comments, likes, scoring functions or fixture layout.

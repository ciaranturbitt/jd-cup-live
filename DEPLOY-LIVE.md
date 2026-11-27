# Johnny Cash Cup — live deployment checklist

## Verified inputs
- This package is based on the latest test ZIP and compared with the uploaded live backup.
- Root `public/` is the Netlify publish directory; `netlify/functions/` holds the server functions.
- No nested `jd-cup-live/` directory is included.
- Historical rounds use the supplied saved scores.
- Current homepage is the quarter-finals, **GW12 test scoring**. Before the real quarter-finals, change `public/fixtures.json` to GW13 and set actual kickoff/full-time timestamps.
- `public/rounds/quarter-finals/fixtures.json` is also GW13 but has no timestamps. It is not included in the Previous Rounds dropdown while current. Before making it archived, save the final GW13 scores in `historicalScores`, set `archived: true`, and update `public/rounds/index.json` when a new round becomes current.

## Database
- User has already added `public.cup_comments.round_id` with default `quarter-finals`. Do not re-run destructive migrations.
- Existing Netlify live environment variables should remain unchanged: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `CHAT_ADMIN_TOKEN`.
- Server functions validate Google login before posting/liking; readers do not need to sign in.

## Release steps
1. Keep the downloaded live backup ZIP.
2. Upload extracted files and folders at repository root to `ciaranturbitt/jd-cup-live` (do not upload the enclosing folder).
3. Verify Netlify base directory blank, publish `public`, functions `netlify/functions`, latest deploy Published.
4. Test homepage fixtures and GW12 scores, historical rounds, manager links, Google sign-in, posting on homepage and an archived round, likes/replies, and returning to the homepage.
5. If an API call fails, inspect Netlify Functions > chat or scores logs.

## Caveats
- Browser/API integration has not been verified against the production Supabase/FPL services in this package build.
- Historical manager links require the FPL manager lookup service; saved historical scores do not.
- The test project has no Supabase variables; use the existing live project for the end-to-end chat test.

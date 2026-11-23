# Johnny Cash Cup Live — Cup Chat release

This package includes the working GW11 scoreboard, Christmas image, fixtures, existing live scores function, and Cup Chat.

## Deploy to your existing repository

Your GitHub repo has an outer `jd-cup-live` folder. Copy the **contents of this package** into that folder (not into `public` only). Specifically:

- `public/index.html`, `public/fixtures.json`, `public/christmas-cup.png`
- `netlify/functions/chat.mjs` (new)
- `netlify/functions/scores.mjs` (existing)
- `netlify.toml`, `package.json` (existing)

Do not upload `supabase-setup.sql` or this README into `public`. The included `netlify.toml` assumes Netlify base directory `jd-cup-live`, publish directory `public`, and functions directory `netlify/functions`.

## Supabase setup (required before publishing)

1. Create a Supabase project at supabase.com.
2. Open SQL Editor, paste and run `supabase-setup.sql` once.
3. In Netlify Project configuration > Environment variables, create:
   - `SUPABASE_URL`: your Supabase Project URL (`https://...supabase.co`)
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase **service_role** secret (or compatible server secret API key). **Never put this in public files or GitHub.**
   - `CHAT_ADMIN_TOKEN`: a long random secret for admin deletion. Keep it private.
4. Trigger a fresh deploy after adding environment variables.

## Test

- In a private/incognito window, open the site: first-time name selection should appear.
- Choose a league manager and continue; refresh the same browser and verify scores appear immediately.
- Post a comment, reply, and like. Open a second browser to confirm persistence.
- Check existing GW11 scores, manager links, transfer hits, right-aligned mobile names and auto-refresh.
- Confirm an empty/misconfigured database gives a visible chat error without breaking scores.

## Admin deletion

Admin deletion is intentionally backend-only for safety; no public admin password box is included. Call `POST /api/chat` with JSON `{"action":"delete","commentId":123}` and header `x-chat-admin-token: YOUR_SECRET` using a trusted API client. Deleting a top-level comment cascades to its replies and likes. Do not share the secret.

## Limitations

No real authentication: any visitor can select another manager's name. Likes are limited to one per browser ID but can be bypassed by clearing browser storage. Rate limiting is a basic four-posts-per-minute per browser ID, not robust against deliberate abuse. All comments are public to site visitors. Supabase free plans, FPL API availability and Netlify usage limits may change. The manager selector depends on the FPL league standings endpoint; returning visitors with a saved identity can still open the scores if that endpoint is temporarily unavailable.

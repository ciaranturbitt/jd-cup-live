# Johnny Cash Cup — Google sign-in deployment

## Changes
- Four quarter-final fixtures; GW12 scoring for temporary testing, no test labels.
- Existing visual layout and live score function preserved.
- Public fixtures and read-only chat; Google sign-in below fixtures to comment/reply/like.
- Uses Google display names and persistent Supabase sessions.
- Legacy comments and likes remain in database.

## Before deployment
1. In Netlify site settings > Environment variables, add `SUPABASE_ANON_KEY` using the **publishable/anon key** from Supabase > Project Settings > API Keys. Do not use the service-role key here. Existing `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `CHAT_ADMIN_TOKEN` must remain server-side.
2. In Supabase > Authentication > URL Configuration, allow `https://johnnycashcuplive.netlify.app/**` and set Site URL to `https://johnnycashcuplive.netlify.app`.
3. Google provider in Supabase must have Client ID and Client Secret; Google OAuth callback must be the Supabase `/auth/v1/callback` URL.
4. The existing database migration must have created `cup_comments.user_id` and `cup_likes.user_id`, made `cup_comments.manager_id` and `visitor_id` nullable, and made `cup_likes.visitor_id` nullable.
5. Deploy the ZIP contents at repository root (not the ZIP as an extra folder). Netlify publish directory remains `public` and functions directory `netlify/functions`.

## Important
Netlify's chat function uses the service-role key, which bypasses RLS. It verifies the Supabase bearer token against `/auth/v1/user` and checks that Google is a sign-in provider before allowing posts/likes. Read access is public. Admin delete remains token-protected.

## Test
- Incognito: fixtures and comments visible; no manager selection; posting requires Google.
- Google login: return to site, Google name shown, post a message, reply and like.
- Reload: still signed in. Sign out: reading remains possible; posting disabled.
- Test on mobile.

The site requires network access to `esm.sh` for the Supabase JS client; test it in a browser before sharing publicly.

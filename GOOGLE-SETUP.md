# Google login deployment

1. In Supabase SQL Editor run `supabase-google-migration.sql` once. It preserves old comments and likes.
2. In Netlify site configuration > Environment variables, add `SUPABASE_ANON_KEY` (Supabase Project Settings > API Keys > legacy anon/publishable key; use the JWT-format anon key for the Auth endpoint). Keep `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `CHAT_ADMIN_TOKEN` unchanged. Never put the service role key in frontend code.
3. In Supabase Authentication > URL Configuration: Site URL `https://johnnycashcuplive.netlify.app`, redirect allowlist `https://johnnycashcuplive.netlify.app/**`.
4. Deploy this project via your normal GitHub/Netlify process.
5. Test: signed-out visitors see fixtures and comments; Google login redirects back; signed-in user can post, reply, like and sign out; refresh keeps session.
6. Scores currently use GW12 for the four actual GW13 quarter-final matchups. For the real round, change only `public/fixtures.json` gameweek to 13.

Note: Google OAuth External apps in Testing mode only permit Google accounts added as test users. Publish the OAuth app to Production when ready for all visitors; check Google Auth Platform > Audience.

Old comments retain their original manager names. New posts show verified Google display names. Existing anonymous likes are preserved in totals.

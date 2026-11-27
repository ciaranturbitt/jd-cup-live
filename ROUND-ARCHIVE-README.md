# Johnny Cash Cup multi-round preview

This is a **preview build**, not ready for blind production deployment. It keeps the root `public/` and `netlify/functions/` structure. No nested duplicate project.

## What is included
- Homepage retains **GW12 test** scoring and existing layout, with round navigation.
- Archive pages `/rounds/quarter-finals/` (GW13) and `/rounds/round-3/` (GW11).
- Round 3 fixtures are populated from the previously confirmed eight ties.
- Round 1 and Round 2 are listed in the rounds index as unavailable until their complete fixture lists are provided.
- Archived scores are deliberately blank until verified and frozen. No scores invented.
- Round-specific chat; existing messages assigned to `quarter-finals` by migration.

## IMPORTANT deployment order
1. Back up Supabase tables `cup_comments` and `cup_likes`.
2. Review and run `supabase-rounds-migration.sql` in Supabase SQL Editor.
3. Test on a Netlify preview/staging site using the same environment variable names; do not replace production until checked.
4. Check that old quarter-final comments still appear and that replies/likes work; check that Round 3 starts empty.
5. Check the root homepage remains GW12 test scoring and does not show GW13 results as official.

## Final scores
- Historical scores can be derived from FPL entry history for each GW, but final net points and tiebreaks must be checked before freezing.
- To freeze an archived round, populate its `historicalScores` array with pairs `[manager1Net, manager2Net]` in fixture order. Set `archived:true`.
- The live homepage `fixtures.json` stays `archived:false`; when GW13 is officially played, change its gameweek to 13 and update kickoff dates before making it live.
- Do not mark any unfinished or unverified score as final.

## Next iteration
Provide complete Round 1/2 fixtures and any tiebreak decisions. Add final-score extraction and verification tooling, then promote the semi-final fixtures as homepage after GW13 finalisation.

Historical fixture snapshots added: Round 1 (31 ties; bye omitted), Round 2 (16), Round 2 Replay (1), Round 3 (8). Scores are supplied by league administrator and frozen in historicalScores. Quarter-finals remain unfinalised; GW12 is test scoring on homepage. Do not deploy until Supabase migration is reviewed and applied.

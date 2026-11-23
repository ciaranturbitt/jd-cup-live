# JD Cup Live — Johnny Cash League

Mobile-friendly FPL Christmas Cup scoreboard for league **397375**.

## Deploy

1. Unzip and push this folder to a GitHub repository.
2. In Netlify, **Add new project → Import an existing project**, choose the repo.
3. Netlify should detect `netlify.toml`. Publish directory: `public`; functions directory: `netlify/functions`; no build command.
4. Deploy and open the Netlify URL. The serverless function needs internet access to `fantasy.premierleague.com`.

## Update cup round

Edit `public/fixtures.json`: change `round`, `gameweek`, and the pairs in `fixtures`. Save, commit and redeploy. `historicalScores` are **sample GW9 results only**, shown until live data loads; replace/remove them for a new round. For an unmatched manager, add an `overrides` entry such as `"Manager Name": 1234567` using their **FPL entry ID**, not league ID.

## Scoring

For each manager, reads official FPL gameweek picks, live player points and transfer-hit costs. Live gross points are the sum of player live points multiplied by their selection multiplier. Net cup points = gross − transfer cost. The score may change with FPL bonus corrections and autosubs. Chips and unusual cases should be checked against the official FPL gameweek total before confirming winners. Cup tiebreaks are intentionally not automated.

## API and limits

The function fetches the full league standings, one live player points endpoint, and two requests per manager. It caches responses in memory for 45 seconds per warm function instance; Netlify may create multiple instances, so this is **not a global shared cache**. For larger traffic, consider Netlify Blobs/Edge caching or a shared KV cache. The public FPL API is unofficial/undocumented for third-party use and can be unavailable, rate-limited or change without notice. The website refreshes every 60 seconds; this is not a guaranteed live data SLA.

## Local development

`npm install` then `npx netlify dev` (requires Node.js and Netlify CLI). Do not open index.html directly as a file: it needs Netlify Functions.

## Validation

The supplied 16 ties and GW9 sample results are embedded for visual testing. Confirm the current gameweek and all manager mappings before relying on the live scoreboard. GW9 is historical; the FPL API may not serve it as live data in later seasons.

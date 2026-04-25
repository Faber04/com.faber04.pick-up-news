# Project State

## Current Status
- Project initialized with Vite React TypeScript template. ✅ COMPLETED
- Basic project structure created with folders: components, pages, services, types, utils. ✅ COMPLETED
- Documentation folder and initial files set up. ✅ COMPLETED
- Dependencies installed: React, custom RSS parser (browser-compatible with rss2json.com CORS proxy), react-router-dom, Tailwind CSS v3. ✅ COMPLETED
- Tailwind configured and build tested successfully. ✅ COMPLETED
- Git repository initialized and commits made. ✅ COMPLETED
- Core RSS reader functionality implemented. ✅ COMPLETED
- UI components created and integrated. ✅ COMPLETED
- State management with localStorage persistence. ✅ COMPLETED
- Development server running and tested. ✅ COMPLETED
- FTP deployment credentials configured and secured. ✅ COMPLETED
- Application successfully deployed to production at https://www.faber04.com/app/pick-up-news/ ✅ COMPLETED
- Critical bug (removeAllListeners error) resolved with custom browser-compatible RSS parser ✅ COMPLETED
- CORS issues resolved with rss2json.com proxy service ✅ COMPLETED
- HTML rendering in news descriptions fixed ✅ COMPLETED
- Page title updated to "Pick-Up News" ✅ COMPLETED
- Feed sorting with persistent order in localStorage ✅ COMPLETED
- Feed editing with real-time URL validation and save confirmation ✅ COMPLETED
- Feed sorting via drag & drop in Feeds ✅ COMPLETED
- Home "Per Sito" order aligned with Feeds sorting ✅ COMPLETED
- Mobile Feeds layout fixed for action controls placement ✅ COMPLETED
- Desktop Feeds layout keeps action controls right-aligned ✅ COMPLETED
- Touch drag & drop support in Feeds sorting ✅ COMPLETED
- Feed edit now reloads feed and updates "Ultimo aggiornamento" ✅ COMPLETED
- Auto-detection for website/feed URL with JSON Feed priority and RSS/Atom fallback ✅ COMPLETED
- Multi-format feed support (JSON Feed, RSS, Atom) ✅ COMPLETED
- Add Feed failure UX: panel remains open + inline URL error (no modal alert) ✅ COMPLETED
- Duplicate add feedback shown inline in Add Feed form ✅ COMPLETED
- Parallel candidate detection probes via `firstSuccess()` — worst case O(timeout) ✅ COMPLETED
- add-feed error no longer leaks to global banner on Home page (clearError on navigation) ✅ COMPLETED
- Settings page with credits, version, and copyright ✅ COMPLETED
- Mobile navigation now uses a right-side drawer with overlay ✅ COMPLETED
- Article modal metadata wraps better on mobile and uses compact `DD/MM/YY (HH:MM)` date format ✅ COMPLETED
- Mobile drawer layering fixed so the panel renders as a true viewport overlay ✅ COMPLETED

## Objectives
- Implement RSS feed management (add, remove feeds). ✅ COMPLETED
- Create home page with news list (by site or chronological). ✅ COMPLETED
- Implement news detail view. ✅ COMPLETED
- Add responsive design. ✅ COMPLETED
- Integrate RSS parsing. ✅ COMPLETED
- Deploy application to production server. ✅ COMPLETED

## Release History

**v1.0.0** (Commit 70542e5) — Removed api.allorigins.win proxy, simplified CORS chain
**v1.1.1** (Commit 938358d) — URL parsing, UI alignment, XML robustness
**v1.2.0** (Commit UNRELEASED) — Icon alignment, dark mode, color palette restyling
**v1.2.1** (Commit UNRELEASED) — Feed sorting + feed editing
**v1.2.2** (Commit UNRELEASED) — Drag & drop sorting + by-site order alignment
**v1.2.3** (Commit UNRELEASED) — Mobile feed layout fix + touch DnD + edit refresh timestamp
**v1.3.0** (Commit UNRELEASED) — JSON/RSS/Atom auto-detection from website URL + manual fallback
**v1.3.1** (Commit 888c3f8) — Add-flow hardening: anti-duplicate submit + detection UX/performance improvements ✅ COMPLETED
**v1.4.0** (Commit UNRELEASED) — Settings page, credits, mobile modal metadata layout, mobile navigation drawer ✅ COMPLETED
**v1.4.1** (PLANNED) — Mobile drawer cleanup, Settings UX consolidation, Feed menu moved to Settings
**v2.0.0** (PLANNED) — Export/Import feeds
**v3.0.0** (PLANNED) — Replace corsproxy.io with Cloudflare Workers (self-hosted CORS proxy)

## Next Steps (Roadmap)

### v1.0.0 ✅ COMPLETED
1. ✅ Removed 1st level CORS proxy (`api.allorigins.win`) from RSS fetching chain
   - Simplified fallback chain to: corsproxy.io → rss2json.com
   - Updated documentation accordingly

### v1.1.1 ✅ COMPLETED
1. ✅ URL parsing without protocol (e.g., `example.com` → `https://example.com`)
   - Modified validateFeedUrl to accept and normalize URLs
   - Add protocol automatically if missing
2. ✅ UI improvements in Feeds section
   - Removed "Feed RSS (n)" title
   - Aligned "+Add Feed RSS" and "Refresh" buttons
3. ✅ Improved XML parsing robustness
   - Better handling of malformed XML
   - HTML error detection (404 fallback to rss2json)
   - BOM removal and whitespace normalization

### v1.2.0 ✅ COMPLETED
1. ✅ Icon alignment & branding consistency across app
   - Header icon updated and aligned
   - README icon consistency completed
   - PN branding consistency completed
   - Favicon converted into Apple WebApp icon asset
2. ✅ Implemented dark mode / light mode toggle in header
3. ✅ Restyling based on app logo color palette
   - Color scheme derived from PickUpNews mark
   - Applied consistently across UI components

### v1.2.1 ✅ COMPLETED
1. ✅ Feed sorting capability in Feeds section
   - Reordering feeds via arrow buttons
   - Automatic order persistence in localStorage
2. ✅ Feed editing capability
   - Edit mode for feed name and URL
   - Real-time URL validation
   - Save changes with confirmation

### v1.2.2 ✅ COMPLETED
1. ✅ Feed sorting via drag & drop in Feeds section
   - Drag feed cards and drop in desired position
   - Persistent order in localStorage
2. ✅ Home "Per Sito" respects configured feed order
   - Feed groups are rendered in the same order as Feeds configuration

### v1.2.3 ✅ COMPLETED
1. ✅ Mobile layout fix in Feeds page
   - Sorting/action controls moved below metadata and "Ultimo aggiornamento"
   - Desktop keeps controls aligned on the right side
2. ✅ Touch drag & drop support in Feeds
   - Feed reordering works on mobile touch interactions
3. ✅ Feed edit save refresh
   - Edited feed is reloaded after save
   - "Ultimo aggiornamento" is refreshed on successful reload

### v1.3.0 JSON Feed Auto-Detection ✅ COMPLETED
1. ✅ Auto-detect feeds from website URLs
   - ✅ Priority to JSON Feed detection
   - ✅ Fallback to RSS/Atom if JSON is unavailable
   - ✅ Manual URL fallback if auto-detection fails
   - ✅ Support for multiple feed formats (JSON Feed, RSS, Atom)

### v1.3.1 Hardening Add Flow ✅ COMPLETED
1. ✅ Prevent duplicate insertions when user clicks "Aggiungi Feed" multiple times during parsing
2. ✅ Keep Add Feed panel open on add failure and show inline error under URL (no alert)
3. ✅ Improve generic feed detection coverage (HTML candidate discovery + path-segment probing)
4. ✅ Parallelise candidate detection probes — `firstSuccess()` helper runs all candidates concurrently; worst case drops from O(n × timeout) to O(timeout)

### v1.4.0 ✅ COMPLETED
1. ✅ Settings page creation
2. ✅ Credits in the settings page
   - ✅ App created by Faber04 with link to the GitHub profile
   - ✅ Version number
   - ✅ Copyright and year
3. ✅ Mobile layout adjustment
   - ✅ In the selected article modal, metadata (source, date, author) wraps onto multiple lines
   - ✅ Date format updated to `DD/MM/YY (HH:MM)`
4. ✅ Mobile navigation: slide-in menu from the right
   - ✅ On mobile, the nav menu no longer drops down from the top
   - ✅ It opens as a lateral drawer from the right side of the screen
   - ✅ Overlay/backdrop closes the drawer on tap outside

### v1.4.1 (PLANNED) — Mobile & Settings UX cleanup
1. Remove "Tema" (dark/light toggle) from mobile lateral drawer
   - Theme toggle remains accessible elsewhere (e.g. header desktop)
2. Remove "Versione" and "Autore" fields from the "Informazioni app e crediti" panel in Settings
3. Merge the two boxes in Settings into a single "Informazioni app e crediti" panel
   - Move content of the second box into the first box
4. Move the main "Feed" menu item into the Settings page
   - "Feed" is no longer a top-level navigation entry
   - Feed management is accessible from Settings
5. Move dark/light theme toggle to Settings
   - Remove toggle from mobile lateral drawer, desktop header, and any other location
   - Single authoritative toggle lives in the Settings page only

### v2.0.0 (PLANNED)
1. Export feeds to JSON file
   - All feeds exported with title and URL
   - Download as JSON file with timestamp
2. Import feeds from JSON file
   - Load previously exported file
   - Feeds added to end of existing feeds list
   - Duplicate detection by feed URL
   - Feeds with duplicate URL are skipped (not added)
   - "Carica Feed" button in "Gestione Feed RSS" between "Aggiungi Feed" and "Aggiorna"
### v3.0.0 (PLANNED) — Migrate CORS proxy to Cloudflare Workers
1. Replace `corsproxy.io` with a self-hosted Cloudflare Worker
   - `corsproxy.io` free tier is limited to localhost; production requests fail or are blocked
   - Deploy a minimal Cloudflare Worker that proxies RSS/HTML fetch requests and sets CORS headers
   - Update `rss.ts` to call the Worker URL instead of `corsproxy.io`
   - Keep `rss2json.com` as secondary fallback (still free for low-traffic use)
   - Worker script lives in a new `workers/` folder in the repo
   - Worker is deployed on the free Cloudflare Workers plan (100k req/day)
## Completed Features
- Project scaffolding.
- Documentation structure.
- Dependency setup and configuration.
- Build validation.
- Initial Git commits.
- Core RSS functionality.
- Complete UI implementation.
- State management and persistence.
- Comprehensive README documentation.
- FTP deployment credentials setup.

## Known Issues
- ~~Medium Priority: Errore add feed persisteva come banner su Home~~ → Resolved (clearError on page change).
- High Priority: `corsproxy.io` free tier only works on localhost; in production CORS requests may be blocked or rate-limited. Planned fix: migrate to self-hosted Cloudflare Worker (v3.0.0).
- Residual risk: feed auto-detection can still fail on some non-standard sites; user can retry with direct feed URL.

## Dependencies
- React ^18.2.0
- Vite ^4.4.5
- TypeScript ^5.0.2
- Browser-native RSS/Atom parsing + CORS proxies (`corsproxy.io` -> `rss2json.com`)
- react-router-dom ^7.14.1
- Tailwind CSS ^3.4.0
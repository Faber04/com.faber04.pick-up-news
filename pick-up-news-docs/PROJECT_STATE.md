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
- Settings page consolidated into a single info panel with credits and controls ✅ COMPLETED
- Mobile navigation now uses a right-side drawer with overlay ✅ COMPLETED
- Article modal metadata wraps better on mobile and uses compact `DD/MM/YY (HH:MM)` date format ✅ COMPLETED
- Mobile drawer layering fixed so the panel renders as a true viewport overlay ✅ COMPLETED
- Theme toggle moved to Settings only; removed from header and mobile drawer ✅ COMPLETED
- Main "Feeds" top-level menu removed; feed management is now opened from Settings ✅ COMPLETED
- Home empty-state CTA now jumps directly to `Settings > Gestisci Feed` ✅ COMPLETED
- Settings page flattened: no nested cards/boxes, no PickUpNews logo-title-subtitle block ✅ COMPLETED
- Settings top action menu now focuses on `Gestisci Feed` with mobile-first full-width controls ✅ COMPLETED
- Feed management is now a nested Settings subpage with sticky breadcrumb navigation ✅ COMPLETED
- Navigation architecture migrated to scalable breadcrumb stack (`trail`) for future nested sections ✅ COMPLETED
- Theme toggle removed from Settings and moved to main header + mobile hamburger menu ✅ COMPLETED
- Theme menu action now has distinct visual treatment from regular navigation entries ✅ COMPLETED
- By-site accordions now start collapsed by default for better long-list navigation ✅ COMPLETED
- Added by-site global controls (`Espandi tutti`, `Comprimi tutti`) + open/total counter ✅ COMPLETED
- Added localStorage persistence for by-site accordion open/closed state per feed ✅ COMPLETED

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
**v1.4.1** (Commit UNRELEASED) — Mobile drawer cleanup, Settings UX consolidation, Feed menu moved to Settings ✅ COMPLETED
**v1.4.2** (Commit UNRELEASED) — Settings/feed nested navigation with sticky breadcrumb and mobile-first settings flattening ✅ COMPLETED
**v1.4.3** (Commit UNRELEASED) — Theme control moved to main/hamburger menu with dedicated visual style ✅ COMPLETED
**v1.4.4** (Commit UNRELEASED) — By-site accordion UX controls and persistence ✅ COMPLETED
**v1.4.5** (Commit UNRELEASED) — Production React #310 fix in NewsList hook ordering ✅ COMPLETED
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

### v1.4.1 ✅ COMPLETED — Mobile & Settings UX cleanup
1. ✅ Removed "Tema" (dark/light toggle) from mobile lateral drawer
2. ✅ Removed "Versione" and "Autore" fields from the "Informazioni app e crediti" panel in Settings
3. ✅ Merged previous two Settings boxes into a single "Informazioni app e crediti" panel
4. ✅ Moved the main "Feed" entry into Settings
   - ✅ "Feed" is no longer a top-level navigation entry
   - ✅ Feed management is accessible from Settings
5. ✅ Moved dark/light theme toggle to Settings as the single authoritative location
   - ✅ Removed toggle from mobile lateral drawer and desktop header

### v1.4.2 ✅ COMPLETED — Settings nested navigation + breadcrumb
1. ✅ Home empty-state action changed from "Vai a Settings" to "Aggiungi un feed RSS"
   - ✅ Action now opens directly `Settings > Gestisci Feed`
2. ✅ Settings content flattened
   - ✅ Removed nested PickUpNews block and removed logo/title/subtitle section
   - ✅ Removed container-box layout from Settings content area
3. ✅ Settings actions redesigned as top menu entries
   - ✅ Full-width mobile-first buttons at top of Settings
   - ✅ "Apri Gestione Feed" renamed to "Gestisci Feed"
4. ✅ "Gestione Feed" converted into a Settings nested subpage
5. ✅ Added sticky breadcrumb navigation for section/subsection movement
   - ✅ Implemented scalable stack-based navigation (`trail`) to support future deep nesting

### v1.4.3 ✅ COMPLETED — Theme action in main navigation
1. ✅ Removed `Passa a Light/Dark` action from Settings page
2. ✅ Added theme switch action to desktop main navigation
3. ✅ Added theme switch action to mobile hamburger drawer
4. ✅ Applied distinct visual style to theme action (separate from standard nav entries)

### v1.4.4 ✅ COMPLETED — By-site accordion usability
1. ✅ In Home > By Site, all feed accordions start collapsed by default
2. ✅ Added global quick actions: `Espandi tutti` and `Comprimi tutti`
3. ✅ Added live status counter: `X aperti su Y`
4. ✅ Persisted accordion open/closed state in localStorage by feed id

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
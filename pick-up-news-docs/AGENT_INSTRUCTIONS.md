# Agent Instructions for PickUpNews Project

## Project Overview
PickUpNews is a React webapp built with Vite and TypeScript for reading RSS feeds. Users can manually add RSS feeds through a dedicated panel. The home page allows viewing feeds by site or all together chronologically. On the home page, display essential news data: title, description (max 120 characters), date, and feed source. Clicking/tapping on a news item shows the complete news with all available data.

## Workflow per Session
At the end of each development session, the AI must perform the following steps:
1. Build the project (`npm run build`) and test the modified, introduced, or corrected functionalities.
2. Perform edge-to-edge UI testing in the browser to ensure all functionalities work correctly.
3. If there are any technological changes (libraries, frameworks, tools, etc.), update the README.md and AGENT_INSTRUCTIONS.md accordingly.
4. If any feature is added, modified, or removed, update the README.md (sections: Caratteristiche Principali, Come Usare PickUpNews) to reflect the current state of the app.
5. Execute **RCP** (see below).

## RCP — Release Candidate Publish
**Trigger**: execute RCP at the end of every session, OR immediately when the user says "fai una RCP" / "RCP".

**Steps** (always in this order):
1. Update `pick-up-news-docs/DEVELOPMENT_LOG.md` with a session entry summarising changes made.
2. Stage all changes: `git add -A`
3. Commit with a conventional commit message describing the changes.
4. Push to GitHub: `git push`
5. Build and deploy via FTP: `npm run deploy`
6. Clean `/app/pick-up-news/` on FTP by removing files no longer used by the current release (especially old hashed files in `assets/`).

**Notes**:
- Never skip the DEVELOPMENT_LOG update before committing.
- The commit message must follow the format: `type(scope): short description` (e.g. `fix(home): clear error on navigation`, `feat(feeds): add swipe drawer`).
- `npm run deploy` already runs `npm run build` internally — no separate build step needed for RCP.
- During FTP cleanup, keep only files required by the current `dist/` output and `dist/index.html` references.

## Coding Standards
- Use TypeScript for all components and logic.
- Follow React best practices, including hooks and functional components.
- Maintain clean, readable, and well-documented code.
- Use consistent naming conventions (camelCase for variables, PascalCase for components).
- Implement proper error handling and loading states.
- Ensure responsive design for mobile and desktop.

## Project Structure
- `src/components/`: Reusable UI components.
- `src/pages/`: Page components (e.g., Home, NewsDetail).
- `src/services/`: API and RSS parsing services.
- `src/types/`: TypeScript type definitions.
- `src/utils/`: Utility functions.
- `pick-up-news-docs/`: Documentation files.

## Dependencies
- React
- Vite
- TypeScript
- Custom RSS parser using rss2json.com API for CORS handling
- Any additional libraries as needed for UI, routing, etc.

## Session Management
- Update DEVELOPMENT_LOG.md with session summary.
- Log any errors in ERROR_LOG.md with solutions and prevention measures.
- Update PROJECT_STATE.md with current progress and next objectives.
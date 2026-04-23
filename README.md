# <img src="public/pickupnews-mark.svg" width="36" height="36" align="absmiddle" /> PickUpNews

**A web application to read RSS feeds in a single elegant and intuitive interface.**

🌐 **Live Demo**: [www.faber04.com/app/pick-up-news](https://www.faber04.com/app/pick-up-news/)

PickUpNews allows you to easily aggregate and read all your favorite RSS feeds. Manually add your RSS feeds, view news in chronological order or grouped by site, and read full articles with a simple click.

## ✨ Key Features

- **📡 RSS Feed Management**: Easily add and remove RSS feeds manually
- **↕️ Feed Ordering**: Reorder feeds in the Feeds page and keep order persisted in localStorage
- **🖱️ Drag & Drop Ordering**: Reorder feeds by dragging directly in the Feeds page
- **📲 Touch Drag & Drop**: Feed drag & drop sorting also works on mobile touch devices
- **✏️ Feed Editing**: Edit feed name and URL with real-time URL validation and save confirmation
- **🔄 Instant Feed Reload on Edit**: Saving feed edits reloads the feed and updates "Last updated"
- **🧠 Auto Feed Detection**: Enter a website URL and PickUpNews auto-detects JSON Feed first, then RSS/Atom
- **🧩 Multi-Format Support**: Native support for JSON Feed, RSS 2.0, and Atom feeds
- **📅 Chronological View**: See all news sorted by date (most recent first)
- **🏷️ Site View**: Group news by source/site
- **🧭 Consistent Source Order**: In "By Site" mode, Home follows the same order configured in Feeds
- **📱 Responsive Design**: Perfect on desktop, tablet, and mobile
- **💾 Local Persistence**: Your feeds are automatically saved in the browser
- **🔍 Smart Preview**: Descriptions truncated to 120 characters for quick reading
- **📖 Full Reading**: Modal with full article and original link
- **⚡ Performance**: Fast loading thanks to Vite and React optimizations

## 🛠️ Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 4 (fast development and optimized build)
- **Styling**: Tailwind CSS 3 (utility-first CSS framework)
- **RSS Parsing**: Custom XML parser via the browser's native `DOMParser` (supports RSS 2.0 and Atom)
- **Routing**: React Router DOM (for future expansions)
- **State Management**: React Hooks + localStorage
- **Type Checking**: TypeScript 5 (full type safety)

## 🌐 RSS Architecture and CORS Management

RSS feeds are read directly from the browser using a 2-level proxy/fallback chain to maximize availability:

| Level | Service | Method | Item Limit |
|-------|---------|--------|------------|
| 1st (primary) | [corsproxy.io](https://corsproxy.io) | Returns raw XML → parsed with `DOMParser` | All feed items |
| 2nd (final fallback) | [rss2json.com](https://rss2json.com) | Returns pre-parsed JSON | Max 10 items (free tier) |

Each call is protected by a **10-second timeout** using `AbortController`: if a proxy does not respond within the limit, it automatically switches to the next one. Items are always sorted by descending date (most recent first) with cross-browser normalization of the date format.

## 🗓️ Roadmap

### v1.0.0 ✅
- ✅ Removed 1st level CORS management (`api.allorigins.win`)
  - Reduces external dependencies and simplifies the fallback chain
  - Chain: corsproxy.io → rss2json.com

### v1.1.1 ✅
- ✅ URL parsing without protocol (e.g., `example.com` → `https://example.com`)
- ✅ UI improvements in the Feeds section
  - Removed "Feed RSS (n)" title
  - Aligned "+Add" and "Refresh" buttons
- ✅ Robust XML parsing and HTML error detection

### v1.2.0 ✅
- ✅ Icon alignment and branding consistency
  - ✅ Icon alignment in header and README
  - ✅ Visual consistency with PN branding
- ✅ Dark mode / light mode layout
- ✅ Restyling based on logo color scale
  - ✅ Color palette derived from the PickUpNews logo
  - ✅ Consistent application throughout the UI

### v1.2.1 ✅
- ✅ Feed sorting in the Feeds section
  - Reorder feeds via up/down arrow buttons
  - Automatic order saving in localStorage
- ✅ RSS feed editing
  - Edit mode for each feed's name and URL
  - Real-time URL validation
  - Save changes with confirmation

### v1.2.2 ✅
- ✅ Feed sorting via drag & drop in the Feeds section
- ✅ "By Site" order in Home aligned with the feed order configured in Feeds

### v1.2.3 ✅
- ✅ Mobile Feeds layout fix: action controls moved under metadata/"Last updated"
- ✅ Touch drag & drop support for feed ordering on mobile
- ✅ Feed edit save now triggers feed reload and updates "Last updated"

### v1.3.0
- ✅ Auto-detect feeds from website URLs
  - ✅ Priority to JSON Feed detection
  - ✅ Fallback to RSS/Atom when JSON is unavailable
  - ✅ Manual URL fallback if auto-detection does not find a feed
  - ✅ Multi-format detection support (JSON Feed, RSS, Atom)

### v1.3.1
- 🛡️ Feed add flow hardening
  - Prevent duplicate feed insertions caused by repeated clicks during parsing
  - Improve detection timeout/parallelism strategy for better responsiveness
  - Show clearer user feedback when a feed URL is auto-detected

### v1.4.0
- ⚙️ Settings page creation
  - "Carica Feed" button placed in the "Gestione Feed RSS" section between "Aggiungi Feed" and "Aggiorna"
- 🙌 Credits in the settings page
  - App created by Faber04 with link to the GitHub profile
  - Version number
  - Copyright and year
- 📱 Mobile layout adjustment
  - In the selected article modal, metadata (source, date) wraps onto multiple lines
  - Compact date format: `DD/MM/YY (HH:MM)`

### v2.0.0
- � Export feeds to JSON file
  - Download all feeds with title and URL as a JSON file
- 📤 Import feeds from JSON file
  - Load previously exported feeds
  - Feeds added to the end of existing feeds list
  - Duplicate detection by feed URL
  - Feeds with duplicate URL are skipped

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)

## 🚀 Installation and Startup

### 1. Clone the Repository
```bash
git clone https://github.com/Faber04/com.faber04.app.pick-up-news.git
cd com.faber04.app.pick-up-news
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### 3. Build for Production
```bash
npm run build
```

Optimized files will be in the `dist/` folder

### 4. Online Deployment
The application will be available at: `https://www.faber04.com/app/pick-up-news/`

### 5. Autonomous FTP Publish Setup (One Time)
To allow repeatable FTP deployment with a single command:

1. Copy `ftp.env.example` to `INTERNAL/.ftp.env`
2. Fill `FTP_USER`, `FTP_PASS`, `FTP_HOST`, `FTP_BASE`
3. Run:

```bash
npm run deploy
```

Notes:
- `INTERNAL/` is ignored by git, so local credentials are not committed.
- `npm run deploy` performs build + FTP publish.

## 📖 How to Use PickUpNews

### Navigation
The app has two sections accessible from the header:
- **🏠 Home** — the list of news from your feeds
- **📡 Feeds** — RSS feed management (add, reorder, edit, remove)

### Adding an RSS Feed
1. Go to the **Feeds** section (header at the top right)
2. Click on **"+ Add RSS Feed"**
3. Enter the feed name (e.g., "The Guardian")
4. Enter a website URL or feed URL (e.g., `theguardian.com` or `https://www.theguardian.com/uk/rss`)
5. Click **"Add Feed"**
6. PickUpNews tries automatic detection (JSON Feed first, then RSS/Atom)
7. If no feed is detected, PickUpNews uses the URL you entered as manual feed URL

### Viewing News
From the **Home** section, you can choose two viewing modes:
- **Chronological**: all news from all feeds sorted by the most recent
- **By Site**: news grouped by source/site

### Reading Articles
- Click on any news item to open the full detail
- Use the **"Read full article"** button to open the original site

### Removing a Feed
1. Go to the **Feeds** section
2. Click on the 🗑️ icon next to the feed to remove

### Reordering Feeds
1. Go to the **Feeds** section
2. Use **↑** or **↓** next to a feed to move it up or down
3. Or drag a feed using the **⋮⋮** handle and drop it in the desired position
4. The new order is saved automatically

### Feed Order in Home (By Site)
1. Reorder feeds in the **Feeds** section
2. Go back to **Home** and switch to **By Site**
3. Feed groups will follow the same order configured in Feeds

### Editing a Feed
1. Go to the **Feeds** section
2. Click the **✏️** icon next to the feed
3. Update name and/or URL
4. Verify the URL status in real time
5. Click **Salva** and confirm
6. The feed is reloaded automatically and "Last updated" is refreshed

## 📁 Project Structure

```
com.faber04.app.pick-up-news/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable React components
│   │   ├── AddFeedForm.tsx # Form to add feeds
│   │   ├── FeedList.tsx    # List of configured feeds
│   │   ├── NewsList.tsx    # List of news
│   │   ├── ViewControls.tsx # View controls (chronological/by site)
│   │   └── NewsDetailModal.tsx # News detail modal
│   ├── hooks/              # Custom React hooks
│   │   └── useAppState.ts  # App state management hook
│   ├── services/           # Services and APIs
│   │   └── rss.ts          # RSS parsing service
│   ├── types/              # TypeScript definitions
│   │   └── index.ts        # Types for RSS and app state
│   └── utils/              # Helper utilities
├── pick-up-news-docs/      # Project documentation
│   ├── AGENT_INSTRUCTIONS.md
│   ├── DEVELOPMENT_LOG.md
│   ├── ERROR_LOG.md
│   ├── PROJECT_STATE.md
│   └── SESSION_TEMPLATE.md
└── README.md
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code checks
- `npm run publish:ftp` - Publish current `dist/` to FTP (requires `INTERNAL/.ftp.env`)
- `npm run deploy` - Build and publish to FTP

## 🤝 Contributions

This project is developed by @Faber04. Feel free to open issues to report bugs or suggest improvements!

## 📄 License

This project is distributed under the MIT license.

---

**Developed by @Faber04**

# Daily Activity Tracker

A personal activity tracker built with **React 19**, **Vite** and **Tailwind CSS v4**. It's installable as a phone app and deployed to GitHub Pages at <https://chris-x-vill.github.io/bulk-xcodedev/>.

## Features
Five pages, reached from the sidebar on desktop or the tab bar on phones:

- **Dashboard**: KPI cards (Total Time, Daily Average, Streak), progress on your goals, the weekly activity chart (stacked by category, or a trend line against the previous period), time by category, and your most recent logs.
- **Activities**: every log grouped by day, with search, a category filter and add/edit/delete on each entry.
- **Goals**: create, edit and delete goals. A goal counts the time logged in one category (or all activities) against a **daily** target (today) or a **weekly** target (Monday to Sunday), with status (met, on track, behind pace) and recent history.
- **Calendar**: a month view that opens on the current month. Each logged activity shows as a dot in its category color. Tap a day to see, edit or add its logs.
- **Settings**: export and import a JSON backup (Replace or Merge, with Undo), an app-icon section (placeholder for future icons), light/dark/system appearance, and Reset activity data.

Data is saved in the browser's `localStorage` on each device; nothing is uploaded. New installs start with demo entries.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Deploy
`.github/workflows/deploy-tracker.yml` builds the app and publishes it to GitHub Pages on every push to `master` that touches this folder. In the repo settings, Pages must have **Source** set to **GitHub Actions**.

## Structure
```
src/
  App.jsx                  app shell: routing, shared state, dialogs, toast
  views/                   Dashboard, Activities, Goals, CalendarView, Settings
  components/              chart, KPI card, activity row, goal card, modals, navigation
  lib/utils.js             date helpers, aggregation, streak logic
  lib/goals.js             goal progress and status
  lib/backup.js            backup export, validation and merge
  lib/storage.js           localStorage helpers
  lib/seed.js              demo data for new installs
public/                    manifest, icons and service worker for the installed app
```

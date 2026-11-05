# Oliver the Dog

A one-page website about animal love and care, starring Oliver, a 9-year-old Morkie. Built with **React**, **Vite** and **Tailwind CSS**, the same tools as the activity tracker.

Live at **<https://chris-x-vill.github.io/bulk-xcodedev/website/>**. It updates about a minute after a change reaches `master`.

Sections, in order: **Hero**, **About Oliver**, **Caring for your dog**, **A day in Oliver's life** (timeline), **Gallery** (tap to enlarge), **More to come**, and **Say hello**. It also has a phone menu and a light/dark toggle.

---

## Edit the text: `website/src/content.js`

Everything you read on the site comes from this one file:
<https://github.com/Chris-X-Vill/bulk-xcodedev/blob/master/website/src/content.js>

1. Open it on github.com while signed in, and tap the **pencil** (Edit). On a phone it may be under **⋯**.
2. Change the words between the quotes `'...'`, keeping the quotes and commas.
3. Tap **Commit changes…** and commit to `master`.

Tips:
- **Apostrophes:** use the curly one `’` (as in `Oliver’s`), or write `\'`. A plain `'` inside the quotes ends the text early and breaks the site.
- **Add an item** (a care tip, a routine step, a photo): copy a `{ ... },` block and edit the copy. **Remove an item:** delete its block.
- **Hide or reorder sections:** edit `SECTIONS` at the bottom of the file.
- **Menu text:** `menuLabel` sets the menu text for a section. `null` keeps it out of the menu.
- **Care tip icons:** `food`, `water`, `walk`, `groom`, `vet`, `love`, `play`, `home`, `sun`.
- **Before you commit:** if the site stops updating after an edit, the edit probably has a missing quote or comma. Check the **Actions** tab for a red ✗.

## Add Oliver's photos: `website/public/images/`

<https://github.com/Chris-X-Vill/bulk-xcodedev/tree/master/website/public/images>

1. Open that folder and choose **Add file → Upload files**.
2. In `content.js`, change the matching `image:` line, for example `image: 'images/oliver-sofa.jpg'`.
3. Optionally, delete the placeholder `.svg`. Each placeholder shows its own file name.

| Placeholder | Where it shows | Best shape |
|---|---|---|
| `hero.svg` | Top of the page | 4:3 landscape |
| `about.svg` | About Oliver | 4:5 portrait |
| `gallery-1.svg` … `gallery-6.svg` | Gallery | Square |

- Keep photos under about 500 KB; resize to about 1600px wide.
- Names are case-sensitive: `Oliver.JPG` and `oliver.jpg` are different files.
- Fill in `imageAlt` with a short description, for screen readers.

## Colors and fonts

- **Colors:** in `src/index.css`, the `THEME` block. `--accent` is the green and `--sun` the yellow. Each has a light-mode and a dark-mode value.
- **Fonts:** Fredoka for headings and Nunito for text, loaded in `index.html` and named in `src/index.css`.
- **Tab icon:** `public/images/favicon.svg`.

## Build new features

### Add a new section, e.g. "Rescue stories"

1. Create `src/sections/Stories.jsx`. Copy `Care.jsx` or `ComingSoon.jsx` as a starting point, and wrap it in `<Section id="stories" heading="...">`.
2. Add its content to `src/content.js`, e.g. `export const stories = { heading: 'Rescue stories', items: [...] }`, and import it in your section.
3. Register it in `src/App.jsx` inside `REGISTRY`:
   ```js
   stories: { component: Stories, content: stories },
   ```
4. Add `'stories'` to `SECTIONS` in `content.js`. It appears in the menu automatically.

The **More to come** section holds future ideas: senior dog care, adoption stories, healthy treats. When one is ready, build it as its own section and remove it from the list.

### Other ideas
- **Contact form:** GitHub Pages can't receive form submissions on its own, so use a form service such as Formspree.
- **More pages:** add hash routes (`#stories`) the way the tracker does.
- **More icons:** <https://lucide.dev/icons>. Import one in `src/sections/Care.jsx` and add it to `ICONS`.

## Run it on your computer

```bash
cd website
npm install
npm run dev      # open the address it prints, usually http://localhost:5173
npm run build    # production build in dist/
```

## How it's deployed

`.github/workflows/deploy-tracker.yml` builds the tracker and this site on every push to `master` that touches either folder, then publishes them together:

| Address | Folder |
|---|---|
| `/bulk-xcodedev/` | `activity-tracker-dashboard/` |
| `/bulk-xcodedev/website/` | `website/` |

If the `website` folder is ever missing, the tracker still deploys and the website step is skipped.

**The site is public**, so keep private details out of `content.js` and the photos: no home address, phone number or anything that shows where you live.

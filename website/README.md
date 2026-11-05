# Website template

A one-page personal website you can edit and grow. Built with **React**, **Vite** and **Tailwind CSS**, the same tools as the activity tracker.

Once changes are merged into `master`, it's live at **<https://chris-x-vill.github.io/bulk-xcodedev/website/>**.

Sections: **Hero**, **About**, **What I do**, **Projects**, **Gallery** (tap an image to view it larger) and **Contact**. It also has a phone menu and a light/dark toggle.

---

## Change text

All the words live in **`src/content.js`**. Open it, change anything between the quotes `'...'`, and keep the quotes and commas.

- **Add an item** (a project, a gallery photo, a fact): copy one `{ ... },` block and edit the copy.
- **Remove an item:** delete its `{ ... },` block.
- **Hide or reorder sections:** edit the `SECTIONS` list at the bottom of the file.

Editing on github.com works too, even from a phone. Open `website/src/content.js`, tap the pencil, edit, then **Commit changes** to `master`. The site redeploys automatically in about a minute.

## Add or replace images

1. Put the image in **`public/images/`**. JPG, PNG, WebP and SVG all work.
   - On github.com: open `website/public/images`, then **Add file → Upload files**.
2. Point to it in `src/content.js`, for example `image: 'images/my-photo.jpg'`.
3. Optionally, delete the placeholder `.svg` it replaces.

Tips:
- Keep photos under about 500 KB; resize to 1600px wide before uploading.
- File names are case-sensitive: `Photo.JPG` and `photo.jpg` are different files.
- Write a short `imageAlt` describing the picture, for screen readers.

Suggested shapes: hero 4:3, about 4:5 (portrait), projects 3:2, gallery square. Other sizes work too; they're cropped to fit.

## Change colors and fonts

- **Colors:** in `src/index.css`, edit the values in the `THEME` block. `--accent` is the main brand color. Each color has a light value and a dark-mode value.
- **Fonts:** the Google Fonts link is in `index.html`, and the font names are in `src/index.css` (`--font-display` for headings, `--font-sans` for body text).
- **Tab icon:** replace `public/images/favicon.svg`.

## Build new features

### Add a new section

1. Create `src/sections/Testimonials.jsx`, or any other name. Copy `About.jsx` or `Services.jsx` as a starting point, and wrap it in `<Section id="testimonials" heading="...">`.
2. Add its text to `src/content.js`, for example `export const testimonials = { heading: '...', items: [...] }`, and import that in your section.
3. Register it in `src/App.jsx` inside `REGISTRY`:
   ```js
   testimonials: { component: Testimonials, content: testimonials },
   ```
4. Add `'testimonials'` to `SECTIONS` in `content.js` where you want it on the page. It appears in the menu automatically, using its `heading` or `menuLabel`.

### Ideas to build next

- **Contact form:** GitHub Pages can't receive form submissions on its own, so use a form service such as Formspree or Netlify Forms and point the form at it.
- **Blog or extra pages:** add hash routes (`#blog`) the way the tracker does, or move to a router.
- **Icons:** more are available at <https://lucide.dev/icons>. Import one in `src/sections/Services.jsx` and add it to `ICONS`.

## Run it on your computer

```bash
cd website
npm install
npm run dev      # open the address it prints, usually http://localhost:5173
npm run build    # production build in dist/
```

## How it's deployed

`.github/workflows/deploy-tracker.yml` builds both the tracker and this website on every push to `master` that touches either folder, then publishes them together:

| Address | Folder |
|---|---|
| `/bulk-xcodedev/` | `activity-tracker-dashboard/` |
| `/bulk-xcodedev/website/` | `website/` |

**The site is public.** Anything you put in `content.js` or `public/images/` can be seen by anyone, so leave out private details like your home address or phone number.

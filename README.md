# Yoga with Susan Jarvie

Static website for Susan Jarvie's yoga practice — a migration off Weebly.
Plain HTML/CSS/JS with content stored in editable JSON files and a Decap CMS admin panel.

**Live demo (GitHub Pages):** https://press-lab.github.io/susan-jarvie-website/

---

## How it works

- Each page (`index.html`, `about.html`, …) loads a matching JSON file from `data/`.
- `js/content.js` injects that content into elements marked with `data-field` / `data-list`.
- Non-technical edits happen through **`/admin`** (Decap CMS), which writes back to the JSON files in Git.
- All paths are **relative**, so the site works both at a domain root and on a GitHub Pages subpath.

```
├── index.html  about.html  schedule.html  classes-online.html  work-with-me.html  contact.html
├── 404.html · favicon.svg · .nojekyll
├── css/style.css          # palette + type matched to the original site (slate #455968)
├── js/content.js          # JSON → DOM loader, nav, mobile menu
├── data/*.json            # editable page content (one file per page)
└── admin/                 # Decap CMS (index.html + config.yml)
```

## Local preview

Any static server works. For example:

```bash
npx serve .
# or
python -m http.server 3000
```

Then open http://localhost:3000.

## Editing content

- **Quick edits:** change the `data/*.json` files directly.
- **Non-technical edits:** use the `/admin` panel. This requires the GitHub OAuth backend —
  see [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) for full CMS + hosting setup.

## Hosting

- **GitHub Pages** (current demo) — Settings → Pages → Deploy from branch `main` / root.
- **Cloudflare Pages** (recommended for production + working CMS) — see [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md).

## Notes

- The contact form and newsletter need a [Formspree](https://formspree.io) endpoint
  (`YOUR_FORM_ID` placeholder in `data/contact.json` and the forms).
- The `/admin` CMS login only works once the OAuth backend in CLOUDFLARE_SETUP.md is deployed.

# Spice Bag — bio link site

A tiny static site for Instagram bio-link use and as the standalone site at
`spicebagmusic.ie`. No build step, no frameworks — just HTML, CSS and JS.

## What's in here

```
index.html          The page
style.css            Styling (light/dark theme via CSS variables)
script.js             Theme toggle + gig list rendering
gigs.json             Upcoming gigs — edit this to update the site
CNAME                Custom domain config for GitHub Pages
assets/
  logo-dark.png        Logo shown in dark mode (white text)
  logo-light.png        Logo shown in light mode (black text)
  favicon/              Favicon + touch icons, generated from the flame mark
```

## Editing gigs

Open `gigs.json` and edit the array. Each gig looks like this:

```json
{
  "date": "2026-10-24",
  "venue": "Whelan's",
  "city": "Dublin",
  "ticketUrl": "https://www.whelanslive.com"
}
```

- `date` — required, format `YYYY-MM-DD`.
- `venue` — required.
- `city` — optional.
- `ticketUrl` — optional. Leave as `""` or omit it and the row just won't
  have a "Tickets" button.

Notes on behaviour:
- Gigs are sorted automatically by date (soonest first).
- Gigs with a date in the past are filtered out automatically, so you can
  leave old shows in the file if you want a record of them — they just
  won't display.
- If `gigs.json` is `[]` (empty array), or every gig in it is in the past,
  the whole "Gigs" section disappears from the page — no empty heading left
  behind.
- Commit and push the change to `main` and GitHub Pages will redeploy the
  site automatically within a minute or two.

## Hosting on GitHub Pages

1. Push this folder to a GitHub repository (e.g. `spicebagmusic/spicebagmusic.github.io`
   or any repo name — either works with a custom domain).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch",
   branch `main`, folder `/ (root)`.
4. Save. GitHub will publish the site at `https://<username>.github.io/<repo>/`
   within a minute or two.

## Connecting spicebagmusic.ie

The `CNAME` file in this repo already tells GitHub Pages to serve the site
on `spicebagmusic.ie`. You still need to point the domain's DNS at GitHub:

**At your domain registrar (wherever spicebagmusic.ie is registered):**

- Add an **A record** for the apex domain (`spicebagmusic.ie`) pointing to
  each of GitHub's Pages IPs:
  ```
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
  ```
- If you also want `www.spicebagmusic.ie` to work, add a **CNAME record**
  for `www` pointing to `<username>.github.io`.

**Back in the repo:**

- Go to **Settings → Pages → Custom domain**, enter `spicebagmusic.ie`,
  and save (this is already primed by the CNAME file, but GitHub needs you
  to confirm it once in the UI).
- Once DNS has propagated (can take a few minutes to a few hours), tick
  **Enforce HTTPS**.

## Using it as an Instagram bio link

Once the domain is live, set your Instagram bio link to
`https://spicebagmusic.ie`. The page is a single mobile-first column, so it
works well as a link-in-bio landing page as-is.

## Replacing the logo

If you get an updated logo, export two versions the same way as the current
ones:
- `assets/logo-dark.png` — the version shown on the black background
  (light-coloured logo, transparent background).
- `assets/logo-light.png` — the version shown on the white background
  (dark-coloured logo, transparent background).

Keep both as PNGs with a transparent background so they sit flush against
the page background with no visible edge.

## Local preview

Because the page fetches `gigs.json` with `fetch()`, opening `index.html`
directly via `file://` will silently skip the gigs section in most browsers
(fetch is blocked on `file://`). To preview properly, run a tiny local
server from this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

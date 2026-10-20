# Spicebag — bio link site

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
  "date": "2026-10-24 20:30",
  "venue": "Whelan's",
  "city": "Dublin",
  "description": "Acoustic performance at Tetiana Tsarenko's art exhibition opening",
  "ticketUrl": "https://www.whelanslive.com"
}
```

- `date` — required. Either `YYYY-MM-DD` (no time shown) or
  `YYYY-MM-DD HH:MM` (24-hour clock; the time is shown under the date).
- `venue` — required.
- `city` — optional.
- `description` — optional. A short line shown under the venue/city.
- `ticketUrl` — optional. Leave as `""` or omit it and the row just won't
  have a "Tickets" button.

Notes on behaviour:
- Gigs are sorted automatically by date (soonest first).
- Gigs on a past date are filtered out automatically, so you can leave old
  shows in the file if you want a record of them — they just won't display.
  A gig stays visible for the whole of its day, even after its start time.
- Gigs with an invalid `date` (e.g. `2026-02-31` or `2026-10-24 8pm`) are
  skipped.
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
  for `www` pointing to `
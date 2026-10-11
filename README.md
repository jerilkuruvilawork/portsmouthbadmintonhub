# Portsmouth Badminton Hub

Community directory of pay-and-play and social badminton sessions around Portsmouth (~25 miles).

**Live site:** [https://jerilkuruvilawork.github.io/portsmouthbadmintonhub/](https://jerilkuruvilawork.github.io/portsmouthbadmintonhub/)

## Forms

- **Suggest an edit** / **Add a club** — session details (same fields as the listing).
- **Contact / suggest** — general ideas, questions, or site feedback (`#contact`).

All forms email the maintainer via FormSubmit. The inbox is set in `src/config.ts` and is **not shown on the page**.

The first time someone submits, [FormSubmit](https://formsubmit.co) may email you a one-time activation link — click it once.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173/portsmouthbadmintonhub/](http://localhost:5173/portsmouthbadmintonhub/).

## Data

- `src/data/sessions.ts` — times, venues, club contacts
- `src/data/sessionDetails.ts` — area, levels, types, formats

## Visitor count

GitHub Pages does not show how many people visit the site. To get a count:

1. Create a free site at [GoatCounter](https://www.goatcounter.com) (recommended — no cookies, simple dashboard).
2. Copy your **count URL** (looks like `https://something.goatcounter.com/count`).
3. In GitHub: **Settings → Secrets and variables → Actions → Variables** → add  
   `VITE_GOATCOUNTER_ENDPOINT` = that URL.
4. Push to `main` (or re-run the deploy workflow). The next build will include the tracker.

Optional: use `VITE_GA_MEASUREMENT_ID` (GA4 `G-…` ID) instead of or as well as GoatCounter.

Local dev does not send analytics (`initAnalytics` skips when `import.meta.env.DEV`).

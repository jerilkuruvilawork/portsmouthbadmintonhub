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

## Visitor analytics

GitHub Pages does not show visitor stats. The site uses **Google Tag Manager** (`GTM-57TW26Z8` in `index.html`), **GoatCounter**, and optional direct **GA4** (`VITE_GA_MEASUREMENT_ID` — only if you are not already sending GA4 from inside GTM).

Local dev never sends GoatCounter/GA4 from `analytics.ts`; GTM still loads if you test a production build.

### Google Tag Manager

Container **GTM-57TW26Z8** is in `index.html`. Configure GA4 and other tags in the [GTM console](https://tagmanager.google.com/). Filter URL changes push a `page_view` event to `dataLayer` for SPA tracking.

### Google Analytics 4 (optional direct tag)

1. Open [Google Analytics](https://analytics.google.com/) → **Admin** → create an **Account** and **Property** (if needed).
2. Add a **Web** data stream for  
   `https://jerilkuruvilawork.github.io/portsmouthbadmintonhub/`  
   (later you can add your custom domain as another stream or change the URL).
3. Copy the **Measurement ID** (starts with `G-`, e.g. `G-ABC123XYZ`).
4. Add GitHub variable **`VITE_GA_MEASUREMENT_ID`** = that ID.
5. Redeploy. In GA4, open **Reports → Realtime** to confirm visits (can take a few minutes).

Filter changes update the URL (`?day=Saturday&…`); those count as separate page paths in both GA and GoatCounter.

### GoatCounter (optional, privacy-friendly)

1. Create a free site at [GoatCounter](https://www.goatcounter.com).
2. Copy the **count URL** (e.g. `https://yoursite.goatcounter.com/count`).
3. Add GitHub variable **`VITE_GOATCOUNTER_ENDPOINT`** = that URL.
4. Redeploy.

You can set **both** variables to use GA and GoatCounter together.

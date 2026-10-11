/**
 * Optional visitor analytics. Set one of these at build time (see `.env.example`):
 * - VITE_GOATCOUNTER_ENDPOINT — free at https://www.goatcounter.com (recommended)
 * - VITE_GA_MEASUREMENT_ID — Google Analytics 4 (G-XXXXXXXX)
 */

declare global {
  interface Window {
    goatcounter?: { count: (args: { path: string; title?: string; event?: boolean }) => void };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const goatcounterEndpoint = import.meta.env.VITE_GOATCOUNTER_ENDPOINT as string | undefined;
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

function pagePath(): string {
  return `${window.location.pathname}${window.location.search}`;
}

function loadGoatCounter() {
  if (!goatcounterEndpoint?.trim()) return;
  const endpoint = goatcounterEndpoint.trim();
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://gc.zgo.at/count.js";
  script.dataset.goatcounter = endpoint;
  document.head.appendChild(script);
}

function loadGoogleAnalytics() {
  const id = gaMeasurementId?.trim();
  if (!id) return;

  const loader = document.createElement("script");
  loader.async = true;
  loader.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(loader);

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
}

/** Call once when the app loads. Counts one page view (includes filter query string if present). */
export function initAnalytics() {
  if (import.meta.env.DEV) return;

  loadGoatCounter();
  loadGoogleAnalytics();

  // GoatCounter’s script auto-counts the first view; GA needs an explicit config only.
  // If only GoatCounter is used, no extra call is required.
  if (gaMeasurementId?.trim() && !goatcounterEndpoint?.trim()) {
    window.gtag?.("event", "page_view", { page_path: pagePath() });
  }
}

/** Optional: call when the URL changes without a full reload (shared filter links). */
export function trackVirtualPageView() {
  if (import.meta.env.DEV) return;

  const path = pagePath();
  window.goatcounter?.count({ path, title: document.title });
  window.gtag?.("event", "page_view", { page_path: path });
}

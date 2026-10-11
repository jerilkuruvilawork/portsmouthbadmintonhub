import { GA_MEASUREMENT_ID, GOATCOUNTER_ENDPOINT, GTM_CONTAINER_ID } from "./config";

declare global {
  interface Window {
    goatcounter?: { count: (args: { path: string; title?: string; event?: boolean }) => void };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const goatcounterEndpoint = GOATCOUNTER_ENDPOINT;
const gaMeasurementId = GA_MEASUREMENT_ID;

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
  window.gtag("config", id, {
    anonymize_ip: true,
    allow_google_signals: false,
    send_page_view: false,
  });
}

function trackGooglePageView() {
  const id = gaMeasurementId?.trim();
  if (!id || !window.gtag) return;
  window.gtag("event", "page_view", {
    send_to: id,
    page_path: pagePath(),
    page_title: document.title,
  });
}

/** Tell GTM when filter links change the URL without a full reload. */
function trackGtmVirtualPageView() {
  if (!GTM_CONTAINER_ID?.trim()) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: "page_view",
    page_path: pagePath(),
    page_title: document.title,
  });
}

/** Call once when the app loads. Counts one page view (includes filter query string if present). */
export function initAnalytics() {
  if (import.meta.env.DEV) return;

  loadGoatCounter();
  loadGoogleAnalytics();
  trackGooglePageView();
}

/** Optional: call when the URL changes without a full reload (shared filter links). */
export function trackVirtualPageView() {
  if (import.meta.env.DEV) return;

  const path = pagePath();
  window.goatcounter?.count({ path, title: document.title });
  trackGtmVirtualPageView();
  trackGooglePageView();
}

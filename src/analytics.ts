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

/** Filter URL changes — initial page view comes from gtag in index.html. */
function trackGooglePageView() {
  const id = gaMeasurementId?.trim();
  if (!id || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    send_to: id,
    page_path: pagePath(),
    page_title: document.title,
    page_location: window.location.href,
  });
}

function trackGtmVirtualPageView() {
  if (!GTM_CONTAINER_ID?.trim()) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: "page_view",
    page_path: pagePath(),
    page_title: document.title,
  });
}

export function initAnalytics() {
  if (import.meta.env.DEV) return;
  loadGoatCounter();
}

export function trackVirtualPageView() {
  if (import.meta.env.DEV) return;

  const path = pagePath();
  window.goatcounter?.count({ path, title: document.title });
  trackGtmVirtualPageView();
  trackGooglePageView();
}

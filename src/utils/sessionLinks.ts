import type { BadmintonSession } from "../data/sessions";

const MAP_LINK_PATTERN = /maps\.app\.goo\.gl|google\.[a-z.]+\/maps/i;
const VAGUE_LOCATION_PATTERN = /^varies$|\barea\b|^see /i;

export function isMapLink(url: string | undefined): boolean {
  return Boolean(url && MAP_LINK_PATTERN.test(url));
}

/** Google Maps link for the venue, or undefined when the listing has no real location. */
export function mapsUrl(session: Pick<BadmintonSession, "venue" | "address" | "link">) {
  if (isMapLink(session.link)) return session.link;
  if (VAGUE_LOCATION_PATTERN.test(session.venue) || VAGUE_LOCATION_PATTERN.test(session.address)) {
    return undefined;
  }
  const query = `${session.venue}, ${session.address}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

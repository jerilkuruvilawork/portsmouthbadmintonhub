export type HubView = "sessions" | "courts" | "stringers";

export const HUB_VIEW_LABELS: Record<HubView, string> = {
  sessions: "Sessions",
  courts: "Book a court",
  stringers: "Stringers",
};

export function readHubView(search: string): HubView {
  const view = new URLSearchParams(search).get("view");
  if (view === "courts" || view === "stringers") return view;
  return "sessions";
}

/** Keep `view` when session filters update the URL. */
export function mergeHubViewIntoSearch(sessionSearch: string, view: HubView): string {
  const raw = sessionSearch.startsWith("?") ? sessionSearch.slice(1) : sessionSearch;
  const params = new URLSearchParams(raw);
  if (view === "sessions") params.delete("view");
  else params.set("view", view);
  const built = params.toString();
  return built ? `?${built}` : "";
}

export function buildDirectorySearch(
  view: "courts" | "stringers",
  area: string,
  query: string,
): string {
  const params = new URLSearchParams();
  params.set("view", view);
  if (area !== "all") params.set("area", area);
  if (query.trim()) params.set("q", query.trim());
  return `?${params.toString()}`;
}

export function readDirectoryFilters(search: string): { area: string; query: string } {
  const params = new URLSearchParams(search);
  return {
    area: params.get("area") ?? "all",
    query: params.get("q") ?? "",
  };
}

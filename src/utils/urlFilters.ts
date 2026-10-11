import { DAY_ORDER } from "../data/sessions";
import { AREA_ORDER, SESSION_KIND_LABELS, type SessionKind } from "../data/sessionDetails";
import {
  DEFAULT_FILTERS,
  type GroupBy,
  type PlayerLevelFilter,
  type SessionFilters,
  type ShuttleFilter,
} from "./sessionFilters";

const PLAYER_LEVELS: PlayerLevelFilter[] = [
  "beginner",
  "improver-intermediate",
  "advanced",
  "league",
];
const SHUTTLES: ShuttleFilter[] = ["plastic", "feather", "hybrid", "no-strings", "not-stated"];
const FORMATS: SessionFilters["format"][] = ["doubles", "mixed", "singles"];
const KINDS = Object.keys(SESSION_KIND_LABELS) as SessionKind[];

function pick<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

export function readUrlState(search: string): { filters: SessionFilters; groupBy: GroupBy } {
  const params = new URLSearchParams(search);
  return {
    filters: {
      area: pick(params.get("area"), AREA_ORDER, DEFAULT_FILTERS.area),
      playerLevel: pick(params.get("level"), PLAYER_LEVELS, DEFAULT_FILTERS.playerLevel),
      shuttle: pick(params.get("shuttle"), SHUTTLES, DEFAULT_FILTERS.shuttle),
      sessionKind: pick(params.get("type"), KINDS, DEFAULT_FILTERS.sessionKind),
      format: pick(params.get("format"), FORMATS, DEFAULT_FILTERS.format),
      day: pick(params.get("day"), DAY_ORDER, DEFAULT_FILTERS.day),
      query: params.get("q") ?? DEFAULT_FILTERS.query,
    },
    groupBy: params.get("group") === "area" ? "area" : "day",
  };
}

export function buildSearch(filters: SessionFilters, groupBy: GroupBy): string {
  const params = new URLSearchParams();
  if (filters.area !== "all") params.set("area", filters.area);
  if (filters.playerLevel !== "all") params.set("level", filters.playerLevel);
  if (filters.shuttle !== "all") params.set("shuttle", filters.shuttle);
  if (filters.sessionKind !== "all") params.set("type", filters.sessionKind);
  if (filters.format !== "all") params.set("format", filters.format);
  if (filters.day !== "all") params.set("day", filters.day);
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (groupBy === "area") params.set("group", "area");
  const search = params.toString();
  return search ? `?${search}` : "";
}

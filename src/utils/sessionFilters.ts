import type { ShuttleType } from "../data/sessions";
import type {
  Area,
  EnrichedSession,
  PlayFormat,
  PlayerLevel,
  SessionKind,
} from "../data/sessionDetails";

export type PlayerLevelFilter =
  | "all"
  | "beginner"
  | "improver-intermediate"
  | "advanced"
  | "league";

export type ShuttleFilter =
  | "all"
  | "plastic"
  | "feather"
  | "no-strings"
  | "not-stated";

export type GroupBy = "day" | "area";

export type SessionFilters = {
  area: Area | "all";
  playerLevel: PlayerLevelFilter;
  shuttle: ShuttleFilter;
  sessionKind: SessionKind | "all";
  format: PlayFormat | "all";
  day: import("../data/sessions").DayOfWeek | "all";
  query: string;
};

export function playerLevelMatches(
  filter: PlayerLevelFilter,
  session: EnrichedSession,
): boolean {
  if (filter === "all") return true;

  if (filter === "beginner") {
    if (session.excludesBeginners) return false;
    return (
      session.playerLevels.includes("beginner") ||
      session.playerLevels.includes("all-levels") ||
      session.kinds.includes("starter")
    );
  }

  if (filter === "improver-intermediate") {
    if (session.excludesBeginners && session.playerLevels.every((l) => l === "advanced")) {
      return false;
    }
    return session.playerLevels.some((l) =>
      (["improver", "intermediate", "all-levels"] as PlayerLevel[]).includes(l),
    );
  }

  if (filter === "advanced") {
    return session.playerLevels.some((l) =>
      (["advanced", "league"] as PlayerLevel[]).includes(l),
    );
  }

  if (filter === "league") {
    return session.playerLevels.includes("league");
  }

  return true;
}

export function shuttleMatches(filter: ShuttleFilter, shuttle: ShuttleType): boolean {
  if (filter === "all") return true;
  if (filter === "plastic") return shuttle === "plastic";
  if (filter === "feather") return shuttle === "feather";
  if (filter === "no-strings") return shuttle === "no-strings";
  if (filter === "not-stated") return shuttle === "unknown";
  return true;
}

export function filterSessions(
  sessions: EnrichedSession[],
  filters: SessionFilters,
): EnrichedSession[] {
  const q = filters.query.trim().toLowerCase();

  return sessions.filter((session) => {
    if (filters.area !== "all" && session.area !== filters.area) return false;
    if (filters.day !== "all" && !session.days.includes(filters.day)) return false;
    if (!playerLevelMatches(filters.playerLevel, session)) return false;
    if (!shuttleMatches(filters.shuttle, session.shuttle)) return false;
    if (filters.sessionKind !== "all" && !session.kinds.includes(filters.sessionKind)) {
      return false;
    }
    if (filters.format !== "all" && !session.formats.includes(filters.format)) return false;

    if (!q) return true;

    const blob = [
      session.name,
      session.area,
      session.venue,
      session.address,
      session.level,
      session.time,
      session.notes,
      session.shuttleNote,
      session.price,
      session.contact,
      ...session.days,
      ...session.playerLevels,
      ...session.kinds,
      ...session.formats,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return blob.includes(q);
  });
}

export const DEFAULT_FILTERS: SessionFilters = {
  area: "all",
  playerLevel: "all",
  shuttle: "all",
  sessionKind: "all",
  format: "all",
  day: "all",
  query: "",
};

export function countActiveFilters(filters: SessionFilters): number {
  let n = 0;
  if (filters.area !== "all") n++;
  if (filters.playerLevel !== "all") n++;
  if (filters.shuttle !== "all") n++;
  if (filters.sessionKind !== "all") n++;
  if (filters.format !== "all") n++;
  if (filters.day !== "all") n++;
  if (filters.query.trim()) n++;
  return n;
}

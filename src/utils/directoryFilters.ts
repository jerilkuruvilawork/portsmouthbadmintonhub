import type { Area } from "../data/sessionDetails";
import type { BookableCourt } from "../data/courts";
import type { Stringer } from "../data/stringers";

export type DirectoryFilters = {
  area: Area | "all";
  query: string;
};

export function filterCourts(courts: BookableCourt[], filters: DirectoryFilters): BookableCourt[] {
  const q = filters.query.trim().toLowerCase();
  return courts.filter((court) => {
    if (filters.area !== "all" && court.area !== filters.area) return false;
    if (!q) return true;
    const blob = [
      court.name,
      court.venue,
      court.address,
      court.area,
      court.priceNote,
      court.notes,
      court.availabilityNote,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return blob.includes(q);
  });
}

export function filterStringers(stringers: Stringer[], filters: DirectoryFilters): Stringer[] {
  const q = filters.query.trim().toLowerCase();
  return stringers.filter((stringer) => {
    if (filters.area !== "all" && stringer.area !== filters.area) return false;
    if (!q) return true;
    const blob = [
      stringer.name,
      stringer.area,
      stringer.address,
      stringer.areasServedNote,
      stringer.brandsNote,
      stringer.notes,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return blob.includes(q);
  });
}

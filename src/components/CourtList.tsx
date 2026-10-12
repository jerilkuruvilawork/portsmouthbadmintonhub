import { useEffect, useMemo, useState } from "react";
import {
  BOOKING_KIND_LABELS,
  COURT_BOOKING_TYPE_LABELS,
  bookableCourts,
  type BookableCourt,
} from "../data/courts";
import { badmintonSessions } from "../data/sessions";
import { AREA_ORDER } from "../data/sessionDetails";
import { buildDirectorySearch, readDirectoryFilters } from "../utils/hubView";
import { filterCourts, type DirectoryFilters } from "../utils/directoryFilters";
import { mapsUrl } from "../utils/sessionLinks";
import { trackVirtualPageView } from "../analytics";

function sessionName(id: string): string {
  return badmintonSessions.find((s) => s.id === id)?.name ?? id;
}

function CourtCard({ court }: { court: BookableCourt }) {
  const mapLink = mapsUrl({ venue: court.venue, address: court.address, link: undefined });
  const bookLink = court.bookingUrl ?? court.link;

  return (
    <article className="session-card">
      <header className="session-card__header">
        <h3>{court.name}</h3>
        <span className="area-badge">{court.area}</span>
      </header>
      <div className="session-card__tags">
        <span className="tag tag--kind">{BOOKING_KIND_LABELS[court.bookingKind]}</span>
        <span className="tag tag--format">{COURT_BOOKING_TYPE_LABELS[court.bookingType]}</span>
        {court.courtsCount != null && (
          <span className="tag tag--level">{court.courtsCount} courts</span>
        )}
      </div>
      <p className="session-card__venue">
        {court.venue}
        <br />
        {court.address}
      </p>
      {court.priceNote && (
        <p className="session-card__shuttle-note">
          <strong>Price:</strong> {court.priceNote}
        </p>
      )}
      {court.availabilityNote && <p className="session-card__notes">{court.availabilityNote}</p>}
      {court.notes && <p className="session-card__notes">{court.notes}</p>}
      {(court.phone || court.email) && (
        <p className="session-card__contact">
          {court.phone && (
            <a href={`tel:${court.phone.replace(/\s/g, "")}`}>{court.phone}</a>
          )}
          {court.email && <a href={`mailto:${court.email}`}>{court.email}</a>}
        </p>
      )}
      {court.relatedSessionIds && court.relatedSessionIds.length > 0 && (
        <p className="session-card__notes">
          <strong>Club sessions here:</strong>{" "}
          {court.relatedSessionIds.map((id, i) => (
            <span key={id}>
              {i > 0 ? ", " : ""}
              <a href={`?view=sessions&q=${encodeURIComponent(sessionName(id))}`}>
                {sessionName(id)}
              </a>
            </span>
          ))}
        </p>
      )}
      {(bookLink || mapLink) && (
        <p className="session-card__links">
          {bookLink && (
            <a className="session-card__book" href={bookLink} target="_blank" rel="noopener noreferrer">
              {court.bookingType === "enquiry" ? "Enquire" : "Book"}
            </a>
          )}
          {mapLink && (
            <a href={mapLink} target="_blank" rel="noopener noreferrer">
              Open in Maps
            </a>
          )}
          {court.link && court.bookingUrl && court.link !== court.bookingUrl && (
            <a href={court.link} target="_blank" rel="noopener noreferrer">
              More info
            </a>
          )}
        </p>
      )}
      <p className="session-card__meta-note">Verified {court.lastVerified}</p>
    </article>
  );
}

export default function CourtList() {
  const [filters, setFilters] = useState<DirectoryFilters>(() => {
    const { area, query } = readDirectoryFilters(window.location.search);
    const areaOk = AREA_ORDER.includes(area as (typeof AREA_ORDER)[number])
      ? (area as DirectoryFilters["area"])
      : "all";
    return { area: areaOk, query };
  });

  const currentSearch = buildDirectorySearch("courts", filters.area, filters.query);

  useEffect(() => {
    if (currentSearch !== window.location.search) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${currentSearch}${window.location.hash}`,
      );
      trackVirtualPageView();
    }
  }, [currentSearch]);

  const filtered = useMemo(() => filterCourts(bookableCourts, filters), [filters]);

  const grouped = useMemo(() => {
    const map = new Map<(typeof AREA_ORDER)[number], BookableCourt[]>();
    for (const area of AREA_ORDER) map.set(area, []);
    for (const court of filtered) {
      map.get(court.area)?.push(court);
    }
    return AREA_ORDER.map((area) => ({
      key: area,
      label: area,
      courts: map.get(area) ?? [],
    })).filter((g) => g.courts.length > 0);
  }, [filtered]);

  return (
    <>
      <section className="filters" aria-label="Filter courts">
        <div className="filters__grid">
          <label>
            Area
            <select
              value={filters.area}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  area: e.target.value as DirectoryFilters["area"],
                }))
              }
            >
              <option value="all">All areas</option>
              {AREA_ORDER.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </label>
          <label className="filters__search">
            Search
            <input
              type="search"
              value={filters.query}
              onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
              placeholder="Venue, town, postcode…"
            />
          </label>
        </div>
      </section>

      <p className="results-count">
        {filtered.length} venue{filtered.length === 1 ? "" : "s"} · Prices and slots change — confirm
        on the provider site before you travel.
      </p>

      {grouped.length === 0 ? (
        <p className="empty">No courts match your filters.</p>
      ) : (
        grouped.map(({ key, label, courts }) => (
          <section key={key} className="day-group">
            <h2>{label}</h2>
            <div className="session-grid">
              {courts.map((court) => (
                <CourtCard key={court.id} court={court} />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}

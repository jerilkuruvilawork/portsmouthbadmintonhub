import { useEffect, useMemo, useState } from "react";
import { COACH_SERVICE_LABELS, coaches, type Coach } from "../data/coaches";
import { badmintonSessions } from "../data/sessions";
import { AREA_ORDER } from "../data/sessionDetails";
import { buildDirectorySearch, readDirectoryFilters } from "../utils/hubView";
import { filterCoaches, type DirectoryFilters } from "../utils/directoryFilters";
import { mapsUrl } from "../utils/sessionLinks";
import { trackVirtualPageView } from "../analytics";
import { useFeedback } from "./FeedbackSection";

function sessionName(id: string): string {
  return badmintonSessions.find((s) => s.id === id)?.name ?? id;
}

function CoachCard({
  coach,
  onSuggest,
}: {
  coach: Coach;
  onSuggest: (coach: Coach) => void;
}) {
  const mapLink =
    coach.address &&
    mapsUrl({ venue: coach.name, address: coach.address, link: undefined });
  const bookLink = coach.bookingUrl ?? coach.link;

  return (
    <article className="session-card">
      <header className="session-card__header">
        <h3>{coach.name}</h3>
        <span className="area-badge">{coach.area}</span>
      </header>
      {coach.contact && coach.contact !== coach.name && (
        <p className="session-card__shuttle-note">
          <strong>Coach:</strong> {coach.contact}
        </p>
      )}
      <div className="session-card__tags">
        <span className="tag tag--kind">{COACH_SERVICE_LABELS[coach.serviceType]}</span>
      </div>
      <p className="session-card__shuttle-note">
        <strong>Levels:</strong> {coach.levelsNote}
      </p>
      {coach.audienceNote && (
        <p className="session-card__notes">
          <strong>Who it&apos;s for:</strong> {coach.audienceNote}
        </p>
      )}
      {coach.areasServedNote && (
        <p className="session-card__notes">
          <strong>Area covered:</strong> {coach.areasServedNote}
        </p>
      )}
      {coach.venueNote && (
        <p className="session-card__venue">
          <strong>Venues</strong>
          <br />
          {coach.venueNote}
        </p>
      )}
      {coach.address && (
        <p className="session-card__venue">
          {coach.address}
        </p>
      )}
      {coach.priceNote && (
        <p className="session-card__shuttle-note">
          <strong>Price guide:</strong> {coach.priceNote}
        </p>
      )}
      {coach.notes && <p className="session-card__notes">{coach.notes}</p>}
      {(coach.phone || coach.email) && (
        <p className="session-card__contact">
          {coach.phone && (
            <a href={`tel:${coach.phone.replace(/\s/g, "")}`}>{coach.phone}</a>
          )}
          {coach.email && <a href={`mailto:${coach.email}`}>{coach.email}</a>}
        </p>
      )}
      {coach.relatedSessionIds && coach.relatedSessionIds.length > 0 && (
        <p className="session-card__notes">
          <strong>Related sessions on the hub:</strong>{" "}
          {coach.relatedSessionIds.map((id, i) => (
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
          {coach.bookingUrl && (
            <a
              className="session-card__book"
              href={coach.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book
            </a>
          )}
          {coach.link && (
            <a href={coach.link} target="_blank" rel="noopener noreferrer">
              {coach.bookingUrl ? "Website" : "More info"}
            </a>
          )}
          {mapLink && (
            <a href={mapLink} target="_blank" rel="noopener noreferrer">
              Open in Maps
            </a>
          )}
        </p>
      )}
      <p className="session-card__meta-note">Verified {coach.lastVerified}</p>
      <button type="button" className="btn btn--ghost btn--sm" onClick={() => onSuggest(coach)}>
        Suggest an edit
      </button>
    </article>
  );
}

export default function CoachList() {
  const { openCoachForm } = useFeedback();
  const [filters, setFilters] = useState<DirectoryFilters>(() => {
    const { area, query } = readDirectoryFilters(window.location.search);
    const areaOk = AREA_ORDER.includes(area as (typeof AREA_ORDER)[number])
      ? (area as DirectoryFilters["area"])
      : "all";
    return { area: areaOk, query };
  });

  const currentSearch = buildDirectorySearch("coaches", filters.area, filters.query);

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

  const filtered = useMemo(() => filterCoaches(coaches, filters), [filters]);

  const grouped = useMemo(() => {
    const map = new Map<(typeof AREA_ORDER)[number], Coach[]>();
    for (const area of AREA_ORDER) map.set(area, []);
    for (const coach of filtered) {
      map.get(coach.area)?.push(coach);
    }
    return AREA_ORDER.map((area) => ({
      key: area,
      label: area,
      items: map.get(area) ?? [],
    })).filter((g) => g.items.length > 0);
  }, [filtered]);

  return (
    <>
      <section className="filters" aria-label="Filter coaches">
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
              placeholder="Name, club, venue…"
            />
          </label>
        </div>
      </section>

      <p className="results-count">
        {filtered.length} coach{filtered.length === 1 ? "" : "es / programmes"} ·{" "}
        <a
          href="#feedback"
          onClick={(event) => {
            event.preventDefault();
            openCoachForm("add");
          }}
        >
          Add a coach
        </a>
        {" · "}
        Confirm prices and availability before you book.
      </p>

      {grouped.length === 0 ? (
        <p className="empty">No coaches match your filters.</p>
      ) : (
        grouped.map(({ key, label, items }) => (
          <section key={key} className="day-group">
            <h2>{label}</h2>
            <div className="session-grid">
              {items.map((coach) => (
                <CoachCard
                  key={coach.id}
                  coach={coach}
                  onSuggest={(c) => openCoachForm("edit", c)}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}

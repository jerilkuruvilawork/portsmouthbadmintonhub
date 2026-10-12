import { useEffect, useMemo, useState } from "react";
import { STRINGER_SERVICE_LABELS, stringers, type Stringer } from "../data/stringers";
import { AREA_ORDER } from "../data/sessionDetails";
import { buildDirectorySearch, readDirectoryFilters } from "../utils/hubView";
import { filterStringers, type DirectoryFilters } from "../utils/directoryFilters";
import { mapsUrl } from "../utils/sessionLinks";
import { trackVirtualPageView } from "../analytics";
import { useFeedback } from "./FeedbackSection";

function StringerCard({
  stringer,
  onSuggest,
}: {
  stringer: Stringer;
  onSuggest: (stringer: Stringer) => void;
}) {
  const mapLink =
    stringer.address &&
    mapsUrl({ venue: stringer.name, address: stringer.address, link: undefined });

  return (
    <article className="session-card">
      <header className="session-card__header">
        <h3>{stringer.name}</h3>
        <span className="area-badge">{stringer.area}</span>
      </header>
      <div className="session-card__tags">
        <span className="tag tag--kind">{STRINGER_SERVICE_LABELS[stringer.serviceType]}</span>
      </div>
      {stringer.areasServedNote && (
        <p className="session-card__shuttle-note">
          <strong>Covers:</strong> {stringer.areasServedNote}
        </p>
      )}
      {stringer.address && (
        <p className="session-card__venue">
          {stringer.serviceType === "postal" ? "Mail-in" : stringer.name}
          <br />
          {stringer.address}
        </p>
      )}
      {stringer.brandsNote && (
        <p className="session-card__notes">
          <strong>Strings:</strong> {stringer.brandsNote}
        </p>
      )}
      {stringer.priceNote && (
        <p className="session-card__shuttle-note">
          <strong>Price guide:</strong> {stringer.priceNote}
        </p>
      )}
      {stringer.turnaroundNote && <p className="session-card__notes">{stringer.turnaroundNote}</p>}
      {stringer.notes && <p className="session-card__notes">{stringer.notes}</p>}
      {(stringer.phone || stringer.email) && (
        <p className="session-card__contact">
          {stringer.phone && (
            <a href={`tel:${stringer.phone.replace(/\s/g, "")}`}>{stringer.phone}</a>
          )}
          {stringer.email && <a href={`mailto:${stringer.email}`}>{stringer.email}</a>}
        </p>
      )}
      {(stringer.link || mapLink) && (
        <p className="session-card__links">
          {stringer.link && (
            <a className="session-card__book" href={stringer.link} target="_blank" rel="noopener noreferrer">
              Website
            </a>
          )}
          {mapLink && (
            <a href={mapLink} target="_blank" rel="noopener noreferrer">
              Open in Maps
            </a>
          )}
        </p>
      )}
      <p className="session-card__meta-note">Verified {stringer.lastVerified}</p>
      <button type="button" className="btn btn--ghost btn--sm" onClick={() => onSuggest(stringer)}>
        Suggest an edit
      </button>
    </article>
  );
}

export default function StringerList() {
  const { openStringerForm } = useFeedback();
  const [filters, setFilters] = useState<DirectoryFilters>(() => {
    const { area, query } = readDirectoryFilters(window.location.search);
    const areaOk = AREA_ORDER.includes(area as (typeof AREA_ORDER)[number])
      ? (area as DirectoryFilters["area"])
      : "all";
    return { area: areaOk, query };
  });

  const currentSearch = buildDirectorySearch("stringers", filters.area, filters.query);

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

  const filtered = useMemo(() => filterStringers(stringers, filters), [filters]);

  const grouped = useMemo(() => {
    const map = new Map<(typeof AREA_ORDER)[number], Stringer[]>();
    for (const area of AREA_ORDER) map.set(area, []);
    for (const stringer of filtered) {
      map.get(stringer.area)?.push(stringer);
    }
    return AREA_ORDER.map((area) => ({
      key: area,
      label: area,
      items: map.get(area) ?? [],
    })).filter((g) => g.items.length > 0);
  }, [filtered]);

  return (
    <>
      <section className="filters" aria-label="Filter stringers">
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
              placeholder="Name, postcode, mobile…"
            />
          </label>
        </div>
      </section>

      <p className="results-count">
        {filtered.length} stringer{filtered.length === 1 ? "" : "s"} ·{" "}
        <a
          href="#feedback"
          onClick={(event) => {
            event.preventDefault();
            openStringerForm("add");
          }}
        >
          Add a stringer
        </a>
        {" · "}
        Confirm prices and turnaround before you send a racket.
      </p>

      {grouped.length === 0 ? (
        <p className="empty">No stringers match your filters.</p>
      ) : (
        grouped.map(({ key, label, items }) => (
          <section key={key} className="day-group">
            <h2>{label}</h2>
            <div className="session-grid">
              {items.map((stringer) => (
                <StringerCard
                  key={stringer.id}
                  stringer={stringer}
                  onSuggest={(s) => openStringerForm("edit", s)}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}

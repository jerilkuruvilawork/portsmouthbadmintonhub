import { useMemo, useState } from "react";
import { DAY_ORDER, SHUTTLE_LABELS } from "../data/sessions";
import {
  AREA_ORDER,
  getEnrichedSessions,
  PLAYER_LEVEL_LABELS,
  PLAY_FORMAT_LABELS,
  SESSION_KIND_LABELS,
  type EnrichedSession,
  type SessionKind,
} from "../data/sessionDetails";
import SuggestChangeForm from "./SuggestChangeForm";
import {
  countActiveFilters,
  DEFAULT_FILTERS,
  filterSessions,
  type GroupBy,
  type SessionFilters,
} from "../utils/sessionFilters";

function SessionCard({
  session,
  onSuggest,
}: {
  session: EnrichedSession;
  onSuggest: (session: EnrichedSession) => void;
}) {
  return (
    <article className={`session-card${session.unconfirmed ? " session-card--warn" : ""}`}>
      <header className="session-card__header">
        <h3>{session.name}</h3>
        <span className="area-badge">{session.area}</span>
      </header>
      <div className="session-card__tags">
        <span className={`shuttle-badge shuttle-badge--${session.shuttle}`}>
          {SHUTTLE_LABELS[session.shuttle]}
        </span>
        {session.playerLevels.map((level) => (
          <span key={level} className="tag tag--level">
            {PLAYER_LEVEL_LABELS[level]}
          </span>
        ))}
        {session.kinds.map((kind) => (
          <span key={kind} className="tag tag--kind">
            {SESSION_KIND_LABELS[kind]}
          </span>
        ))}
        {session.formats.map((format) => (
          <span key={format} className="tag tag--format">
            {PLAY_FORMAT_LABELS[format]}
          </span>
        ))}
      </div>
      <p className="session-card__time">{session.time}</p>
      <p className="session-card__venue">
        {session.venue}
        <br />
        {session.address}
      </p>
      <dl className="session-card__meta">
        <div>
          <dt>Level (club says)</dt>
          <dd>{session.level}</dd>
        </div>
        {session.price && (
          <div>
            <dt>Price</dt>
            <dd>{session.price}</dd>
          </div>
        )}
      </dl>
      {session.shuttleNote && <p className="session-card__shuttle-note">{session.shuttleNote}</p>}
      {session.excludesBeginners && (
        <p className="session-card__warn">Not aimed at beginners — check before you go.</p>
      )}
      {(session.contact || session.phone || session.email) && (
        <p className="session-card__contact">
          {session.contact && <span>{session.contact} </span>}
          {session.phone && (
            <a href={`tel:${session.phone.replace(/\s/g, "")}`}>{session.phone}</a>
          )}
          {session.email && <a href={`mailto:${session.email}`}>{session.email}</a>}
        </p>
      )}
      {session.link && (
        <p>
          <a href={session.link} target="_blank" rel="noopener noreferrer">
            More info
          </a>
        </p>
      )}
      {session.notes && <p className="session-card__notes">{session.notes}</p>}
      <button type="button" className="btn btn--ghost btn--sm" onClick={() => onSuggest(session)}>
        Suggest an edit
      </button>
    </article>
  );
}

export default function SessionList() {
  const sessions = useMemo(() => getEnrichedSessions(), []);
  const [filters, setFilters] = useState<SessionFilters>(DEFAULT_FILTERS);
  const [groupBy, setGroupBy] = useState<GroupBy>("day");
  const [editing, setEditing] = useState<EnrichedSession | undefined>();
  const [formMode, setFormMode] = useState<"closed" | "add" | "edit">("closed");

  const filtered = useMemo(() => filterSessions(sessions, filters), [sessions, filters]);

  const groupedByDay = useMemo(() => {
    const map = new Map<(typeof DAY_ORDER)[number], EnrichedSession[]>();
    for (const day of DAY_ORDER) map.set(day, []);
    for (const session of filtered) {
      const days =
        filters.day === "all" ? session.days : session.days.filter((day) => day === filters.day);
      for (const day of days) {
        map.get(day)?.push(session);
      }
    }
    return DAY_ORDER.map((day) => ({ key: day, label: day, sessions: map.get(day) ?? [] })).filter(
      (g) => g.sessions.length > 0,
    );
  }, [filtered, filters.day]);

  const groupedByArea = useMemo(() => {
    const map = new Map<(typeof AREA_ORDER)[number], EnrichedSession[]>();
    for (const area of AREA_ORDER) map.set(area, []);
    for (const session of filtered) {
      map.get(session.area)?.push(session);
    }
    return AREA_ORDER.map((area) => ({
      key: area,
      label: area,
      sessions: map.get(area) ?? [],
    })).filter((g) => g.sessions.length > 0);
  }, [filtered]);

  const groups = groupBy === "day" ? groupedByDay : groupedByArea;
  const activeFilterCount = countActiveFilters(filters);

  function patchFilters(partial: Partial<SessionFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  function openForm(mode: "add" | "edit", session?: EnrichedSession) {
    setFormMode(mode);
    setEditing(session);
    requestAnimationFrame(() => {
      document.getElementById("feedback")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  return (
    <>
      <section className="filters" aria-label="Filter sessions">
        <div className="filters__grid">
          <label>
            Area
            <select
              value={filters.area}
              onChange={(e) =>
                patchFilters({ area: e.target.value as SessionFilters["area"] })
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

          <label>
            Player level
            <select
              value={filters.playerLevel}
              onChange={(e) =>
                patchFilters({
                  playerLevel: e.target.value as SessionFilters["playerLevel"],
                })
              }
            >
              <option value="all">Any level</option>
              <option value="beginner">Beginner</option>
              <option value="improver-intermediate">Improver / intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="league">League / strong club</option>
            </select>
          </label>

          <label>
            Shuttle type
            <select
              value={filters.shuttle}
              onChange={(e) =>
                patchFilters({ shuttle: e.target.value as SessionFilters["shuttle"] })
              }
            >
              <option value="all">Any shuttle type</option>
              <option value="plastic">Plastic (confirmed)</option>
              <option value="no-strings">No Strings (usually plastic)</option>
              <option value="feather">Feather (confirmed)</option>
              <option value="not-stated">Type not listed — ask club</option>
            </select>
          </label>

          <label>
            Session type
            <select
              value={filters.sessionKind}
              onChange={(e) =>
                patchFilters({
                  sessionKind: e.target.value as SessionKind | "all",
                })
              }
            >
              <option value="all">Any type</option>
              {(Object.keys(SESSION_KIND_LABELS) as SessionKind[]).map((kind) => (
                <option key={kind} value={kind}>
                  {SESSION_KIND_LABELS[kind]}
                </option>
              ))}
            </select>
          </label>

          <label>
            Format
            <select
              value={filters.format}
              onChange={(e) =>
                patchFilters({ format: e.target.value as SessionFilters["format"] })
              }
            >
              <option value="all">Any format</option>
              <option value="doubles">Doubles</option>
              <option value="mixed">Mixed doubles</option>
              <option value="singles">Singles</option>
            </select>
          </label>

          <label>
            Day
            <select
              value={filters.day}
              onChange={(e) =>
                patchFilters({ day: e.target.value as SessionFilters["day"] })
              }
            >
              <option value="all">Any day</option>
              {DAY_ORDER.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label className="filters__search">
            Search
            <input
              type="search"
              value={filters.query}
              onChange={(e) => patchFilters({ query: e.target.value })}
              placeholder="Club, venue, postcode…"
            />
          </label>
        </div>

        <div className="filters__toolbar">
          <label className="filters__group">
            Group by
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as GroupBy)}>
              <option value="day">Day of week</option>
              <option value="area">Area / town</option>
            </select>
          </label>
          {activeFilterCount > 0 && (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              Clear filters ({activeFilterCount})
            </button>
          )}
        </div>
      </section>

      <p className="results-count">
        {filtered.length} session{filtered.length === 1 ? "" : "s"} ·{" "}
        <a
          href="#feedback"
          onClick={(event) => {
            event.preventDefault();
            openForm("add");
          }}
        >
          Add a club
        </a>
      </p>

      {groups.length === 0 ? (
        <p className="empty">No sessions match your filters. Try clearing one or two filters.</p>
      ) : (
        groups.map(({ key, label, sessions: groupSessions }) => (
          <section key={key} className="day-group">
            <h2>{label}</h2>
            <div className="session-grid">
              {groupSessions.map((session) => (
                <SessionCard
                  key={`${key}-${session.id}`}
                  session={session}
                  onSuggest={(session) => openForm("edit", session)}
                />
              ))}
            </div>
          </section>
        ))
      )}

      <section id="feedback" className="feedback">
        {formMode === "closed" ? (
          <div className="feedback__prompt">
            <button type="button" className="btn btn--accent btn--lg" onClick={() => openForm("add")}>
              Add a club
            </button>
            <p>
              To correct a listing, use Suggest an edit on that session. The form opens with its
              details filled in.
            </p>
          </div>
        ) : (
          <SuggestChangeForm
            key={formMode === "edit" ? editing?.id : "new"}
            mode={formMode}
            session={formMode === "edit" ? editing : undefined}
            onCancel={() => {
              setFormMode("closed");
              setEditing(undefined);
            }}
          />
        )}
      </section>
    </>
  );
}

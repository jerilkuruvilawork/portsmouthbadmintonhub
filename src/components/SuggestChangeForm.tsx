import { useState, type FormEvent } from "react";
import { DAY_ORDER, SHUTTLE_LABELS, type DayOfWeek, type ShuttleType } from "../data/sessions";
import {
  AREA_ORDER,
  PLAYER_LEVEL_LABELS,
  PLAY_FORMAT_LABELS,
  SESSION_KIND_LABELS,
  type Area,
  type EnrichedSession,
  type PlayFormat,
  type PlayerLevel,
  type SessionKind,
} from "../data/sessionDetails";
import { submitCorrection } from "../utils/submitCorrection";

type Mode = "add" | "edit";

type Props = {
  mode: Mode;
  session?: EnrichedSession;
  onCancel: () => void;
};

type Status = "idle" | "sending" | "success" | "error";

type FormValues = {
  name: string;
  days: DayOfWeek[];
  time: string;
  venue: string;
  address: string;
  area: Area | "";
  level: string;
  playerLevels: PlayerLevel[];
  kinds: SessionKind[];
  formats: PlayFormat[];
  price: string;
  shuttle: ShuttleType | "";
  shuttleNote: string;
  contact: string;
  phone: string;
  email: string;
  link: string;
  notes: string;
  excludesBeginners: boolean;
  comment: string;
  reporterEmail: string;
};

const SHUTTLE_OPTIONS: ShuttleType[] = ["plastic", "feather", "no-strings", "unknown"];

function emptyValues(): FormValues {
  return {
    name: "",
    days: [],
    time: "",
    venue: "",
    address: "",
    area: "",
    level: "",
    playerLevels: [],
    kinds: [],
    formats: [],
    price: "",
    shuttle: "",
    shuttleNote: "",
    contact: "",
    phone: "",
    email: "",
    link: "",
    notes: "",
    excludesBeginners: false,
    comment: "",
    reporterEmail: "",
  };
}

function valuesFromSession(session: EnrichedSession): FormValues {
  return {
    name: session.name,
    days: [...session.days],
    time: session.time,
    venue: session.venue,
    address: session.address,
    area: session.area,
    level: session.level,
    playerLevels: [...session.playerLevels],
    kinds: [...session.kinds],
    formats: [...session.formats],
    price: session.price ?? "",
    shuttle: session.shuttle,
    shuttleNote: session.shuttleNote ?? "",
    contact: session.contact ?? "",
    phone: session.phone ?? "",
    email: session.email ?? "",
    link: session.link ?? "",
    notes: session.notes ?? "",
    excludesBeginners: Boolean(session.excludesBeginners),
    comment: "",
    reporterEmail: "",
  };
}

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  selected,
  onToggle,
  disabled,
  className,
}: {
  legend: string;
  name: string;
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (value: T) => void;
  disabled: boolean;
  className?: string;
}) {
  return (
    <fieldset className={`feedback-form__choices${className ? ` ${className}` : ""}`} disabled={disabled}>
      <legend>{legend}</legend>
      <div className="feedback-form__checks">
        {options.map((option) => (
          <label key={option.value} className="feedback-form__check">
            <input
              type="checkbox"
              name={name}
              checked={selected.includes(option.value)}
              onChange={() => onToggle(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function SuggestChangeForm({ mode, session, onCancel }: Props) {
  const [values, setValues] = useState<FormValues>(() =>
    mode === "edit" && session ? valuesFromSession(session) : emptyValues(),
  );
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function patch(partial: Partial<FormValues>) {
    setValues((current) => ({ ...current, ...partial }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (values.days.length === 0) {
      setStatus("error");
      setErrorMessage("Choose at least one day.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    const days = DAY_ORDER.filter((day) => values.days.includes(day));
    const result = await submitCorrection({
      mode,
      clubName: values.name.trim(),
      sessionId: session?.id,
      reporterEmail: values.reporterEmail,
      fields: [
        { label: "Club", value: values.name },
        { label: "Days", value: days.join(", ") },
        { label: "Time", value: values.time },
        { label: "Venue", value: values.venue },
        { label: "Address", value: values.address },
        { label: "Area", value: values.area },
        { label: "Level (club says)", value: values.level },
        {
          label: "Player levels",
          value: values.playerLevels.map((level) => PLAYER_LEVEL_LABELS[level]).join(", "),
        },
        {
          label: "Session type",
          value: values.kinds.map((kind) => SESSION_KIND_LABELS[kind]).join(", "),
        },
        {
          label: "Format",
          value: values.formats.map((format) => PLAY_FORMAT_LABELS[format]).join(", "),
        },
        { label: "Price", value: values.price },
        {
          label: "Shuttle",
          value: values.shuttle ? SHUTTLE_LABELS[values.shuttle] : "",
        },
        { label: "Shuttle note", value: values.shuttleNote },
        { label: "Not for beginners", value: values.excludesBeginners ? "Yes" : "No" },
        { label: "Contact", value: values.contact },
        { label: "Phone", value: values.phone },
        { label: "Club email", value: values.email },
        { label: "Link", value: values.link },
        { label: "Notes", value: values.notes },
        { label: "Reporter note", value: values.comment },
      ],
    });

    if (result.ok) {
      setStatus("success");
      return;
    }

    setStatus("error");
    setErrorMessage(result.error);
  }

  if (status === "success") {
    return (
      <div className="feedback-form feedback-form--success" role="status">
        <h2>Thanks — we got your {mode === "edit" ? "edit" : "new session"}</h2>
        <p>We’ll review it and update the site when we can.</p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onCancel}>
          Close
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h2>{mode === "edit" ? "Suggest an edit" : "Add a club"}</h2>
      <p className="feedback-form__intro">
        {mode === "edit"
          ? "The current listing is filled in below. Change whatever is wrong, then send it."
          : "Fill in the session details. Your message goes to the site maintainer only."}
      </p>

      <div className="feedback-form__grid">
        <label className="feedback-form__field feedback-form__span">
          Club name
          <input
            required
            value={values.name}
            onChange={(event) => patch({ name: event.target.value })}
            disabled={sending}
          />
        </label>

        <ChoiceGroup
          legend="Days"
          name="days"
          className="feedback-form__span"
          options={DAY_ORDER.map((day) => ({ value: day, label: day }))}
          selected={values.days}
          onToggle={(day) => patch({ days: toggleValue(values.days, day) })}
          disabled={sending}
        />

        <label className="feedback-form__field">
          Time
          <input
            required
            value={values.time}
            onChange={(event) => patch({ time: event.target.value })}
            placeholder="8:00 PM – 10:00 PM"
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field">
          Area
          <select
            required
            value={values.area}
            onChange={(event) => patch({ area: event.target.value as Area | "" })}
            disabled={sending}
          >
            <option value="">Select an area</option>
            {AREA_ORDER.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>

        <label className="feedback-form__field">
          Venue
          <input
            required
            value={values.venue}
            onChange={(event) => patch({ venue: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field">
          Address
          <input
            value={values.address}
            onChange={(event) => patch({ address: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field">
          Shuttle type
          <select
            required
            value={values.shuttle}
            onChange={(event) => patch({ shuttle: event.target.value as ShuttleType | "" })}
            disabled={sending}
          >
            <option value="">Select shuttle type</option>
            {SHUTTLE_OPTIONS.map((shuttle) => (
              <option key={shuttle} value={shuttle}>
                {SHUTTLE_LABELS[shuttle]}
              </option>
            ))}
          </select>
        </label>

        <label className="feedback-form__field">
          Shuttle note
          <input
            value={values.shuttleNote}
            onChange={(event) => patch({ shuttleNote: event.target.value })}
            placeholder="e.g. Yonex Mavis 300"
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field">
          Price
          <input
            value={values.price}
            onChange={(event) => patch({ price: event.target.value })}
            placeholder="e.g. £6"
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field">
          Level (as the club describes it)
          <input
            value={values.level}
            onChange={(event) => patch({ level: event.target.value })}
            placeholder="e.g. Improvers to experienced"
            disabled={sending}
          />
        </label>
      </div>

      <ChoiceGroup
        legend="Player level"
        name="player-level"
        options={(Object.keys(PLAYER_LEVEL_LABELS) as PlayerLevel[]).map((level) => ({
          value: level,
          label: PLAYER_LEVEL_LABELS[level],
        }))}
        selected={values.playerLevels}
        onToggle={(level) => patch({ playerLevels: toggleValue(values.playerLevels, level) })}
        disabled={sending}
      />

      <ChoiceGroup
        legend="Session type"
        name="session-type"
        options={(Object.keys(SESSION_KIND_LABELS) as SessionKind[]).map((kind) => ({
          value: kind,
          label: SESSION_KIND_LABELS[kind],
        }))}
        selected={values.kinds}
        onToggle={(kind) => patch({ kinds: toggleValue(values.kinds, kind) })}
        disabled={sending}
      />

      <ChoiceGroup
        legend="Format"
        name="format"
        options={(Object.keys(PLAY_FORMAT_LABELS) as PlayFormat[]).map((format) => ({
          value: format,
          label: PLAY_FORMAT_LABELS[format],
        }))}
        selected={values.formats}
        onToggle={(format) => patch({ formats: toggleValue(values.formats, format) })}
        disabled={sending}
      />

      <label className="feedback-form__check feedback-form__check--solo">
        <input
          type="checkbox"
          checked={values.excludesBeginners}
          onChange={(event) => patch({ excludesBeginners: event.target.checked })}
          disabled={sending}
        />
        Not aimed at beginners
      </label>

      <div className="feedback-form__grid">
        <label className="feedback-form__field">
          Contact name
          <input
            value={values.contact}
            onChange={(event) => patch({ contact: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field">
          Phone
          <input
            type="tel"
            value={values.phone}
            onChange={(event) => patch({ phone: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field">
          Club email
          <input
            type="email"
            value={values.email}
            onChange={(event) => patch({ email: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field">
          More info link
          <input
            type="url"
            value={values.link}
            onChange={(event) => patch({ link: event.target.value })}
            placeholder="https://"
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field feedback-form__span">
          Notes
          <textarea
            rows={3}
            value={values.notes}
            onChange={(event) => patch({ notes: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field feedback-form__span">
          {mode === "edit" ? "What should change?" : "Anything else?"}
          <textarea
            rows={3}
            value={values.comment}
            onChange={(event) => patch({ comment: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field feedback-form__span">
          Your email (optional, if you want a reply)
          <input
            type="email"
            value={values.reporterEmail}
            onChange={(event) => patch({ reporterEmail: event.target.value })}
            placeholder="you@example.com"
            disabled={sending}
          />
        </label>
      </div>

      {status === "error" && (
        <p className="feedback-form__error" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="feedback-form__actions">
        <button type="submit" className="btn btn--primary" disabled={sending}>
          {sending ? "Sending…" : mode === "edit" ? "Send edit" : "Send new session"}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={sending}>
          Cancel
        </button>
      </div>
    </form>
  );
}

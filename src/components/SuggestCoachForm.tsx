import { useState, type FormEvent } from "react";
import { COACH_SERVICE_LABELS, type Coach, type CoachServiceType } from "../data/coaches";
import { AREA_ORDER, type Area } from "../data/sessionDetails";
import { submitDirectoryCorrection } from "../utils/submitCorrection";

type Mode = "add" | "edit";

type Props = {
  mode: Mode;
  coach?: Coach;
  onCancel: () => void;
};

type Status = "idle" | "sending" | "success" | "error";

type FormValues = {
  name: string;
  contact: string;
  area: Area | "";
  areasServedNote: string;
  serviceType: CoachServiceType | "";
  levelsNote: string;
  audienceNote: string;
  venueNote: string;
  address: string;
  phone: string;
  email: string;
  link: string;
  bookingUrl: string;
  priceNote: string;
  relatedSessionIds: string;
  notes: string;
  comment: string;
  reporterEmail: string;
};

const SERVICE_TYPES: CoachServiceType[] = ["private", "academy", "club-coach", "school", "online"];

function emptyValues(): FormValues {
  return {
    name: "",
    contact: "",
    area: "",
    areasServedNote: "",
    serviceType: "",
    levelsNote: "",
    audienceNote: "",
    venueNote: "",
    address: "",
    phone: "",
    email: "",
    link: "",
    bookingUrl: "",
    priceNote: "",
    relatedSessionIds: "",
    notes: "",
    comment: "",
    reporterEmail: "",
  };
}

function valuesFromCoach(coach: Coach): FormValues {
  return {
    name: coach.name,
    contact: coach.contact ?? "",
    area: coach.area,
    areasServedNote: coach.areasServedNote ?? "",
    serviceType: coach.serviceType,
    levelsNote: coach.levelsNote,
    audienceNote: coach.audienceNote ?? "",
    venueNote: coach.venueNote ?? "",
    address: coach.address ?? "",
    phone: coach.phone ?? "",
    email: coach.email ?? "",
    link: coach.link ?? "",
    bookingUrl: coach.bookingUrl ?? "",
    priceNote: coach.priceNote ?? "",
    relatedSessionIds: coach.relatedSessionIds?.join(", ") ?? "",
    notes: coach.notes ?? "",
    comment: "",
    reporterEmail: "",
  };
}

export default function SuggestCoachForm({ mode, coach, onCancel }: Props) {
  const [values, setValues] = useState<FormValues>(() =>
    mode === "edit" && coach ? valuesFromCoach(coach) : emptyValues(),
  );
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function patch(partial: Partial<FormValues>) {
    setValues((current) => ({ ...current, ...partial }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const result = await submitDirectoryCorrection({
      mode,
      entity: "coach",
      listingName: values.name.trim(),
      listingId: coach?.id,
      reporterEmail: values.reporterEmail,
      fields: [
        { label: "Name (person or organisation)", value: values.name },
        { label: "Contact person", value: values.contact },
        { label: "Primary area", value: values.area },
        { label: "Areas served", value: values.areasServedNote },
        {
          label: "Service type",
          value: values.serviceType ? COACH_SERVICE_LABELS[values.serviceType] : "",
        },
        { label: "Levels", value: values.levelsNote },
        { label: "Who it's for", value: values.audienceNote },
        { label: "Venues", value: values.venueNote },
        { label: "Address", value: values.address },
        { label: "Phone", value: values.phone },
        { label: "Email", value: values.email },
        { label: "Website", value: values.link },
        { label: "Booking URL", value: values.bookingUrl },
        { label: "Price note", value: values.priceNote },
        { label: "Related session ids", value: values.relatedSessionIds },
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
        <h2>Thanks — we got your {mode === "edit" ? "coach edit" : "new coach"}</h2>
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
      <h2>{mode === "edit" ? "Suggest a coach edit" : "Add a coach"}</h2>
      <p className="feedback-form__intro">
        {mode === "edit"
          ? "The current listing is filled in below. Change whatever is wrong, then send it."
          : "List a coach or coaching programme (person or organisation). Your message goes to the maintainer only."}
      </p>

      <div className="feedback-form__grid">
        <label className="feedback-form__field feedback-form__span">
          Name (person or organisation)
          <input
            required
            value={values.name}
            onChange={(event) => patch({ name: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field">
          Contact person (if different)
          <input
            value={values.contact}
            onChange={(event) => patch({ contact: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field">
          Primary area
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
          Service type
          <select
            required
            value={values.serviceType}
            onChange={(event) =>
              patch({ serviceType: event.target.value as CoachServiceType | "" })
            }
            disabled={sending}
          >
            <option value="">Select type</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {COACH_SERVICE_LABELS[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="feedback-form__field feedback-form__span">
          Levels (plain language)
          <input
            required
            value={values.levelsNote}
            onChange={(event) => patch({ levelsNote: event.target.value })}
            placeholder="e.g. Beginners to intermediate"
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field feedback-form__span">
          Areas served
          <input
            value={values.areasServedNote}
            onChange={(event) => patch({ areasServedNote: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field feedback-form__span">
          Who it&apos;s for
          <input
            value={values.audienceNote}
            onChange={(event) => patch({ audienceNote: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field feedback-form__span">
          Venues
          <textarea
            rows={2}
            value={values.venueNote}
            onChange={(event) => patch({ venueNote: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field feedback-form__span">
          Address (if public)
          <input
            value={values.address}
            onChange={(event) => patch({ address: event.target.value })}
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
          Email
          <input
            type="email"
            value={values.email}
            onChange={(event) => patch({ email: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field">
          Website
          <input
            type="url"
            value={values.link}
            onChange={(event) => patch({ link: event.target.value })}
            placeholder="https://"
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field">
          Booking URL
          <input
            type="url"
            value={values.bookingUrl}
            onChange={(event) => patch({ bookingUrl: event.target.value })}
            placeholder="https://"
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field feedback-form__span">
          Price note
          <input
            value={values.priceNote}
            onChange={(event) => patch({ priceNote: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field feedback-form__span">
          Related session ids (hub)
          <input
            value={values.relatedSessionIds}
            onChange={(event) => patch({ relatedSessionIds: event.target.value })}
            placeholder="pba-priory, charter-no-strings"
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
          {sending ? "Sending…" : mode === "edit" ? "Send coach edit" : "Send new coach"}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={sending}>
          Cancel
        </button>
      </div>
    </form>
  );
}

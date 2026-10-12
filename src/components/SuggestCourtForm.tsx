import { useState, type FormEvent } from "react";
import {
  BOOKING_KIND_LABELS,
  COURT_BOOKING_TYPE_LABELS,
  type BookableCourt,
  type BookingKind,
  type CourtBookingType,
} from "../data/courts";
import { AREA_ORDER, type Area } from "../data/sessionDetails";
import { submitDirectoryCorrection } from "../utils/submitCorrection";

type Mode = "add" | "edit";

type Props = {
  mode: Mode;
  court?: BookableCourt;
  onCancel: () => void;
};

type Status = "idle" | "sending" | "success" | "error";

type FormValues = {
  name: string;
  venue: string;
  address: string;
  area: Area | "";
  bookingKind: BookingKind | "";
  bookingType: CourtBookingType | "";
  bookingUrl: string;
  link: string;
  phone: string;
  email: string;
  courtsCount: string;
  priceNote: string;
  availabilityNote: string;
  notes: string;
  relatedSessionIds: string;
  comment: string;
  reporterEmail: string;
};

function emptyValues(): FormValues {
  return {
    name: "",
    venue: "",
    address: "",
    area: "",
    bookingKind: "court-hire",
    bookingType: "",
    bookingUrl: "",
    link: "",
    phone: "",
    email: "",
    courtsCount: "",
    priceNote: "",
    availabilityNote: "",
    notes: "",
    relatedSessionIds: "",
    comment: "",
    reporterEmail: "",
  };
}

function valuesFromCourt(court: BookableCourt): FormValues {
  return {
    name: court.name,
    venue: court.venue,
    address: court.address,
    area: court.area,
    bookingKind: court.bookingKind,
    bookingType: court.bookingType,
    bookingUrl: court.bookingUrl ?? "",
    link: court.link ?? "",
    phone: court.phone ?? "",
    email: court.email ?? "",
    courtsCount: court.courtsCount != null ? String(court.courtsCount) : "",
    priceNote: court.priceNote ?? "",
    availabilityNote: court.availabilityNote ?? "",
    notes: court.notes ?? "",
    relatedSessionIds: court.relatedSessionIds?.join(", ") ?? "",
    comment: "",
    reporterEmail: "",
  };
}

const BOOKING_KINDS: BookingKind[] = ["court-hire", "session-only"];
const BOOKING_TYPES: CourtBookingType[] = ["app", "website", "schoolhire", "enquiry"];

export default function SuggestCourtForm({ mode, court, onCancel }: Props) {
  const [values, setValues] = useState<FormValues>(() =>
    mode === "edit" && court ? valuesFromCourt(court) : emptyValues(),
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
      entity: "court",
      listingName: values.name.trim(),
      listingId: court?.id,
      reporterEmail: values.reporterEmail,
      fields: [
        { label: "Listing name", value: values.name },
        { label: "Venue", value: values.venue },
        { label: "Address", value: values.address },
        { label: "Area", value: values.area },
        {
          label: "Listing type",
          value: values.bookingKind ? BOOKING_KIND_LABELS[values.bookingKind] : "",
        },
        {
          label: "How to book",
          value: values.bookingType ? COURT_BOOKING_TYPE_LABELS[values.bookingType] : "",
        },
        { label: "Booking URL", value: values.bookingUrl },
        { label: "More info link", value: values.link },
        { label: "Phone", value: values.phone },
        { label: "Email", value: values.email },
        { label: "Number of courts", value: values.courtsCount },
        { label: "Price note", value: values.priceNote },
        { label: "Availability note", value: values.availabilityNote },
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
        <h2>Thanks — we got your {mode === "edit" ? "court edit" : "new court"}</h2>
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
      <h2>{mode === "edit" ? "Suggest a court edit" : "Add a bookable court"}</h2>
      <p className="feedback-form__intro">
        {mode === "edit"
          ? "The current court listing is filled in below. Change whatever is wrong, then send it."
          : "Tell us about a venue where people can hire a badminton court. Your message goes to the maintainer only."}
      </p>

      <div className="feedback-form__grid">
        <label className="feedback-form__field feedback-form__span">
          Listing name
          <input
            required
            value={values.name}
            onChange={(event) => patch({ name: event.target.value })}
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
          Listing type
          <select
            required
            value={values.bookingKind}
            onChange={(event) => patch({ bookingKind: event.target.value as BookingKind | "" })}
            disabled={sending}
          >
            <option value="">Select type</option>
            {BOOKING_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {BOOKING_KIND_LABELS[kind]}
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
            required
            value={values.address}
            onChange={(event) => patch({ address: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field">
          How to book
          <select
            required
            value={values.bookingType}
            onChange={(event) => patch({ bookingType: event.target.value as CourtBookingType | "" })}
            disabled={sending}
          >
            <option value="">Select booking method</option>
            {BOOKING_TYPES.map((type) => (
              <option key={type} value={type}>
                {COURT_BOOKING_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="feedback-form__field">
          Number of courts
          <input
            inputMode="numeric"
            value={values.courtsCount}
            onChange={(event) => patch({ courtsCount: event.target.value })}
            placeholder="e.g. 4"
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

        <label className="feedback-form__field feedback-form__span">
          Price note
          <input
            value={values.priceNote}
            onChange={(event) => patch({ priceNote: event.target.value })}
            placeholder="From £7/hr — confirm on site"
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field feedback-form__span">
          Availability / booking note
          <textarea
            rows={2}
            value={values.availabilityNote}
            onChange={(event) => patch({ availabilityNote: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field feedback-form__span">
          Related session ids (hub)
          <input
            value={values.relatedSessionIds}
            onChange={(event) => patch({ relatedSessionIds: event.target.value })}
            placeholder="gosport-no-strings, toffs"
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
          {sending ? "Sending…" : mode === "edit" ? "Send court edit" : "Send new court"}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={sending}>
          Cancel
        </button>
      </div>
    </form>
  );
}

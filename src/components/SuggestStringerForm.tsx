import { useState, type FormEvent } from "react";
import { STRINGER_SERVICE_LABELS, type Stringer, type StringerServiceType } from "../data/stringers";
import { AREA_ORDER, type Area } from "../data/sessionDetails";
import { submitDirectoryCorrection } from "../utils/submitCorrection";

type Mode = "add" | "edit";

type Props = {
  mode: Mode;
  stringer?: Stringer;
  onCancel: () => void;
};

type Status = "idle" | "sending" | "success" | "error";

type FormValues = {
  name: string;
  area: Area | "";
  areasServedNote: string;
  serviceType: StringerServiceType | "";
  address: string;
  contact: string;
  phone: string;
  email: string;
  link: string;
  brandsNote: string;
  turnaroundNote: string;
  priceNote: string;
  notes: string;
  comment: string;
  reporterEmail: string;
};

function emptyValues(): FormValues {
  return {
    name: "",
    area: "",
    areasServedNote: "",
    serviceType: "",
    address: "",
    contact: "",
    phone: "",
    email: "",
    link: "",
    brandsNote: "",
    turnaroundNote: "",
    priceNote: "",
    notes: "",
    comment: "",
    reporterEmail: "",
  };
}

function valuesFromStringer(stringer: Stringer): FormValues {
  return {
    name: stringer.name,
    area: stringer.area,
    areasServedNote: stringer.areasServedNote ?? "",
    serviceType: stringer.serviceType,
    address: stringer.address ?? "",
    contact: stringer.contact ?? "",
    phone: stringer.phone ?? "",
    email: stringer.email ?? "",
    link: stringer.link ?? "",
    brandsNote: stringer.brandsNote ?? "",
    turnaroundNote: stringer.turnaroundNote ?? "",
    priceNote: stringer.priceNote ?? "",
    notes: stringer.notes ?? "",
    comment: "",
    reporterEmail: "",
  };
}

const SERVICE_TYPES: StringerServiceType[] = ["shop", "mobile", "postal"];

export default function SuggestStringerForm({ mode, stringer, onCancel }: Props) {
  const [values, setValues] = useState<FormValues>(() =>
    mode === "edit" && stringer ? valuesFromStringer(stringer) : emptyValues(),
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
      entity: "stringer",
      listingName: values.name.trim(),
      listingId: stringer?.id,
      reporterEmail: values.reporterEmail,
      fields: [
        { label: "Name", value: values.name },
        { label: "Primary area", value: values.area },
        { label: "Areas served", value: values.areasServedNote },
        {
          label: "Service type",
          value: values.serviceType ? STRINGER_SERVICE_LABELS[values.serviceType] : "",
        },
        { label: "Address", value: values.address },
        { label: "Contact name", value: values.contact },
        { label: "Phone", value: values.phone },
        { label: "Email", value: values.email },
        { label: "Website", value: values.link },
        { label: "Strings / brands", value: values.brandsNote },
        { label: "Turnaround", value: values.turnaroundNote },
        { label: "Price note", value: values.priceNote },
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
        <h2>Thanks — we got your {mode === "edit" ? "stringer edit" : "new stringer"}</h2>
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
      <h2>{mode === "edit" ? "Suggest a stringer edit" : "Add a stringer"}</h2>
      <p className="feedback-form__intro">
        {mode === "edit"
          ? "The current stringer listing is filled in below. Change whatever is wrong, then send it."
          : "Share a local racket stringing service. Your message goes to the maintainer only."}
      </p>

      <div className="feedback-form__grid">
        <label className="feedback-form__field feedback-form__span">
          Name
          <input
            required
            value={values.name}
            onChange={(event) => patch({ name: event.target.value })}
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
              patch({ serviceType: event.target.value as StringerServiceType | "" })
            }
            disabled={sending}
          >
            <option value="">Select type</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {STRINGER_SERVICE_LABELS[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="feedback-form__field feedback-form__span">
          Areas served
          <input
            value={values.areasServedNote}
            onChange={(event) => patch({ areasServedNote: event.target.value })}
            placeholder="PO1–PO8, collect & deliver"
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field feedback-form__span">
          Address
          <input
            value={values.address}
            onChange={(event) => patch({ address: event.target.value })}
            disabled={sending}
          />
        </label>

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

        <label className="feedback-form__field feedback-form__span">
          Strings / brands
          <input
            value={values.brandsNote}
            onChange={(event) => patch({ brandsNote: event.target.value })}
            disabled={sending}
          />
        </label>

        <label className="feedback-form__field feedback-form__span">
          Turnaround
          <input
            value={values.turnaroundNote}
            onChange={(event) => patch({ turnaroundNote: event.target.value })}
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
          {sending ? "Sending…" : mode === "edit" ? "Send stringer edit" : "Send new stringer"}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={sending}>
          Cancel
        </button>
      </div>
    </form>
  );
}

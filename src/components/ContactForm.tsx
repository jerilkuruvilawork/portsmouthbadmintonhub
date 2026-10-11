import { useState, type FormEvent } from "react";
import {
  CONTACT_TOPIC_LABELS,
  submitContact,
  type ContactTopic,
} from "../utils/submitContact";

type Props = {
  onCancel: () => void;
};

type Status = "idle" | "sending" | "success" | "error";

const TOPICS = Object.keys(CONTACT_TOPIC_LABELS) as ContactTopic[];

export default function ContactForm({ onCancel }: Props) {
  const [topic, setTopic] = useState<ContactTopic>("suggestion");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;

    setStatus("sending");
    setErrorMessage("");

    const result = await submitContact({
      topic,
      message,
      name,
      reporterEmail,
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
        <h2>Thanks — message sent</h2>
        <p>We’ll read it when we can. If you left an email, we can reply there.</p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onCancel}>
          Close
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h2>Contact / suggest something</h2>
      <p className="feedback-form__intro">
        Ideas for the hub, questions, or anything that is not adding or editing a specific session.
        Your message goes to the site maintainer only — not shown on the page.
      </p>

      <label className="feedback-form__field">
        What is it about?
        <select
          value={topic}
          onChange={(event) => setTopic(event.target.value as ContactTopic)}
          disabled={sending}
        >
          {TOPICS.map((value) => (
            <option key={value} value={value}>
              {CONTACT_TOPIC_LABELS[value]}
            </option>
          ))}
        </select>
      </label>

      <label className="feedback-form__field">
        Message
        <textarea
          required
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Your suggestion or question…"
          disabled={sending}
        />
      </label>

      <label className="feedback-form__field">
        Your name (optional)
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          disabled={sending}
        />
      </label>

      <label className="feedback-form__field">
        Your email (optional — only if you want a reply)
        <input
          type="email"
          value={reporterEmail}
          onChange={(event) => setReporterEmail(event.target.value)}
          autoComplete="email"
          disabled={sending}
        />
      </label>

      {status === "error" && <p className="feedback-form__error">{errorMessage}</p>}

      <div className="feedback-form__actions">
        <button type="submit" className="btn btn--primary" disabled={sending}>
          {sending ? "Sending…" : "Send message"}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={sending}>
          Cancel
        </button>
      </div>
    </form>
  );
}

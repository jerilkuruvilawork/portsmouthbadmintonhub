import { MAINTAINER_EMAIL } from "../config";

export type ContactTopic =
  | "suggestion"
  | "question"
  | "site-problem"
  | "listing-other"
  | "other";

export const CONTACT_TOPIC_LABELS: Record<ContactTopic, string> = {
  suggestion: "Suggestion for the site",
  question: "Question",
  "site-problem": "Problem with the site",
  "listing-other": "Something not about a single session",
  other: "Other",
};

export type ContactPayload = {
  topic: ContactTopic;
  message: string;
  name?: string;
  reporterEmail?: string;
};

export async function submitContact(
  payload: ContactPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const topicLabel = CONTACT_TOPIC_LABELS[payload.topic];
  const subject = `Portsmouth Badminton Hub: ${topicLabel}`;

  const body = [
    topicLabel,
    "",
    payload.name?.trim() ? `From: ${payload.name.trim()}` : "From: (not given)",
    "",
    payload.message.trim(),
  ].join("\n");

  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(MAINTAINER_EMAIL)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: subject,
          message: body,
          email: payload.reporterEmail?.trim() || "anonymous@example.com",
          _replyto: payload.reporterEmail?.trim() || undefined,
          _captcha: "false",
        }),
      },
    );

    const data = (await response.json()) as { success?: string; message?: string };

    if (!response.ok) {
      return {
        ok: false,
        error: data.message ?? "Something went wrong. Please try again later.",
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Check your connection and try again." };
  }
}

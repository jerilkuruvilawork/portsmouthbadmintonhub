import { MAINTAINER_EMAIL } from "../config";

export type CorrectionField = {
  label: string;
  value: string;
};

export type CorrectionPayload = {
  mode: "add" | "edit";
  clubName: string;
  sessionId?: string;
  reporterEmail?: string;
  fields: CorrectionField[];
};

async function sendMaintainerEmail(
  subject: string,
  body: string,
  reporterEmail?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
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
          email: reporterEmail?.trim() || "anonymous@example.com",
          _replyto: reporterEmail?.trim() || undefined,
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

export async function submitCorrection(
  payload: CorrectionPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const action = payload.mode === "edit" ? "Edit session" : "Add session";
  const subject = `Portsmouth Badminton Hub: ${action} — ${payload.clubName || "unnamed"}`;

  const body = [
    action,
    payload.sessionId ? `Existing id: ${payload.sessionId}` : "New session",
    "",
    ...payload.fields.map((field) => `${field.label}: ${field.value.trim() || "—"}`),
  ].join("\n");

  return sendMaintainerEmail(subject, body, payload.reporterEmail);
}

export type DirectoryEntity = "court" | "stringer" | "coach";

export type DirectoryCorrectionPayload = {
  mode: "add" | "edit";
  entity: DirectoryEntity;
  listingName: string;
  listingId?: string;
  reporterEmail?: string;
  fields: CorrectionField[];
};

export async function submitDirectoryCorrection(
  payload: DirectoryCorrectionPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const noun =
    payload.entity === "court" ? "court" : payload.entity === "coach" ? "coach" : "stringer";
  const action = payload.mode === "edit" ? `Edit ${noun}` : `Add ${noun}`;
  const subject = `Portsmouth Badminton Hub: ${action} — ${payload.listingName || "unnamed"}`;

  const body = [
    action,
    payload.listingId ? `Existing id: ${payload.listingId}` : `New ${noun}`,
    "",
    ...payload.fields.map((field) => `${field.label}: ${field.value.trim() || "—"}`),
  ].join("\n");

  return sendMaintainerEmail(subject, body, payload.reporterEmail);
}

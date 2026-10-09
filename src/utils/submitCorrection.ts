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

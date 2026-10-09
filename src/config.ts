/** GitHub Pages project site base (repo name). Use `/` for custom domain or local dev. */
export const SITE_BASE =
  import.meta.env.VITE_SITE_BASE ?? "/portsmouthbadmintonhub/";

export const SITE_NAME = "Portsmouth Badminton Hub";
export const SITE_TAGLINE =
  "Pay-and-play & social badminton within ~25 miles of Portsmouth";

/**
 * Inbox for correction forms. Used only server-side by FormSubmit — never shown in the UI.
 * Override locally with VITE_MAINTAINER_EMAIL in `.env` if needed.
 */
export const MAINTAINER_EMAIL =
  import.meta.env.VITE_MAINTAINER_EMAIL ?? "jeril.kuruvila@gmail.com";

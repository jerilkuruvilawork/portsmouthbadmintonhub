import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { BookableCourt } from "../data/courts";
import type { EnrichedSession } from "../data/sessionDetails";
import type { Coach } from "../data/coaches";
import type { Stringer } from "../data/stringers";
import ContactForm from "./ContactForm";
import SuggestChangeForm from "./SuggestChangeForm";
import SuggestCoachForm from "./SuggestCoachForm";
import SuggestCourtForm from "./SuggestCourtForm";
import SuggestStringerForm from "./SuggestStringerForm";

type ActiveForm =
  | { kind: "closed" }
  | { kind: "contact" }
  | { kind: "session"; mode: "add" | "edit"; session?: EnrichedSession }
  | { kind: "court"; mode: "add" | "edit"; court?: BookableCourt }
  | { kind: "stringer"; mode: "add" | "edit"; stringer?: Stringer }
  | { kind: "coach"; mode: "add" | "edit"; coach?: Coach };

type FeedbackContextValue = {
  /** @deprecated use openSessionForm */
  openForm: (mode: "add" | "edit" | "contact", session?: EnrichedSession) => void;
  openSessionForm: (mode: "add" | "edit", session?: EnrichedSession) => void;
  openCourtForm: (mode: "add" | "edit", court?: BookableCourt) => void;
  openStringerForm: (mode: "add" | "edit", stringer?: Stringer) => void;
  openCoachForm: (mode: "add" | "edit", coach?: Coach) => void;
  openContact: () => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider");
  return ctx;
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveForm>({ kind: "closed" });

  useEffect(() => {
    if (window.location.hash === "#contact") {
      setActive({ kind: "contact" });
    }
  }, []);

  function scrollToFeedback() {
    requestAnimationFrame(() => {
      document.getElementById("feedback")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  function openSessionForm(mode: "add" | "edit", session?: EnrichedSession) {
    setActive({ kind: "session", mode, session });
    scrollToFeedback();
  }

  function openCourtForm(mode: "add" | "edit", court?: BookableCourt) {
    setActive({ kind: "court", mode, court });
    scrollToFeedback();
  }

  function openStringerForm(mode: "add" | "edit", stringer?: Stringer) {
    setActive({ kind: "stringer", mode, stringer });
    scrollToFeedback();
  }

  function openCoachForm(mode: "add" | "edit", coach?: Coach) {
    setActive({ kind: "coach", mode, coach });
    scrollToFeedback();
  }

  function openContact() {
    setActive({ kind: "contact" });
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#contact`,
    );
    scrollToFeedback();
  }

  function openForm(mode: "add" | "edit" | "contact", session?: EnrichedSession) {
    if (mode === "contact") openContact();
    else openSessionForm(mode, session);
  }

  function closeForm() {
    setActive({ kind: "closed" });
  }

  return (
    <FeedbackContext.Provider
      value={{
        openForm,
        openSessionForm,
        openCourtForm,
        openStringerForm,
        openCoachForm,
        openContact,
      }}
    >
      {children}
      <FeedbackPanel active={active} onClose={closeForm} />
    </FeedbackContext.Provider>
  );
}

function FeedbackPanel({ active, onClose }: { active: ActiveForm; onClose: () => void }) {
  const { openSessionForm, openCourtForm, openStringerForm, openCoachForm, openContact } =
    useFeedback();

  return (
    <section id="feedback" className="feedback">
      {active.kind === "closed" ? (
        <div className="feedback__prompt">
          <div className="feedback__actions">
            <button type="button" className="btn btn--accent btn--lg" onClick={() => openSessionForm("add")}>
              Add a club
            </button>
            <button type="button" className="btn btn--accent btn--lg" onClick={() => openCourtForm("add")}>
              Add a court
            </button>
            <button type="button" className="btn btn--accent btn--lg" onClick={() => openStringerForm("add")}>
              Add a stringer
            </button>
            <button type="button" className="btn btn--accent btn--lg" onClick={() => openCoachForm("add")}>
              Add a coach
            </button>
            <button type="button" className="btn btn--ghost btn--lg" onClick={() => openContact()}>
              Contact / suggest
            </button>
          </div>
          <p>
            To fix a listing, use <strong>Suggest an edit</strong> on that card. The form opens with
            its details filled in.
          </p>
        </div>
      ) : active.kind === "contact" ? (
        <ContactForm
          onCancel={() => {
            onClose();
            if (window.location.hash === "#contact") {
              window.history.replaceState(
                null,
                "",
                `${window.location.pathname}${window.location.search}`,
              );
            }
          }}
        />
      ) : active.kind === "session" ? (
        <SuggestChangeForm
          key={active.mode === "edit" ? active.session?.id : "new-session"}
          mode={active.mode}
          session={active.mode === "edit" ? active.session : undefined}
          onCancel={onClose}
        />
      ) : active.kind === "court" ? (
        <SuggestCourtForm
          key={active.mode === "edit" ? active.court?.id : "new-court"}
          mode={active.mode}
          court={active.mode === "edit" ? active.court : undefined}
          onCancel={onClose}
        />
      ) : active.kind === "stringer" ? (
        <SuggestStringerForm
          key={active.mode === "edit" ? active.stringer?.id : "new-stringer"}
          mode={active.mode}
          stringer={active.mode === "edit" ? active.stringer : undefined}
          onCancel={onClose}
        />
      ) : (
        <SuggestCoachForm
          key={active.mode === "edit" ? active.coach?.id : "new-coach"}
          mode={active.mode}
          coach={active.mode === "edit" ? active.coach : undefined}
          onCancel={onClose}
        />
      )}
    </section>
  );
}

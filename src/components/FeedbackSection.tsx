import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { EnrichedSession } from "../data/sessionDetails";
import ContactForm from "./ContactForm";
import SuggestChangeForm from "./SuggestChangeForm";

type FormMode = "closed" | "add" | "edit" | "contact";

type FeedbackContextValue = {
  openForm: (mode: "add" | "edit" | "contact", session?: EnrichedSession) => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider");
  return ctx;
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [editing, setEditing] = useState<EnrichedSession | undefined>();
  const [formMode, setFormMode] = useState<FormMode>("closed");

  useEffect(() => {
    if (window.location.hash === "#contact") {
      setFormMode("contact");
      setEditing(undefined);
    }
  }, []);

  function openForm(mode: "add" | "edit" | "contact", session?: EnrichedSession) {
    setFormMode(mode);
    setEditing(session);
    if (mode === "contact") {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}#contact`,
      );
    }
    requestAnimationFrame(() => {
      document.getElementById("feedback")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  return (
    <FeedbackContext.Provider value={{ openForm }}>
      {children}
      <FeedbackPanel
        formMode={formMode}
        editing={editing}
        onClose={() => {
          setFormMode("closed");
          setEditing(undefined);
        }}
        onOpen={openForm}
      />
    </FeedbackContext.Provider>
  );
}

function FeedbackPanel({
  formMode,
  editing,
  onClose,
  onOpen,
}: {
  formMode: FormMode;
  editing: EnrichedSession | undefined;
  onClose: () => void;
  onOpen: (mode: "add" | "edit" | "contact", session?: EnrichedSession) => void;
}) {
  return (
    <section id="feedback" className="feedback">
      {formMode === "closed" ? (
        <div className="feedback__prompt">
          <div className="feedback__actions">
            <button type="button" className="btn btn--accent btn--lg" onClick={() => onOpen("add")}>
              Add a club
            </button>
            <button type="button" className="btn btn--ghost btn--lg" onClick={() => onOpen("contact")}>
              Contact / suggest
            </button>
          </div>
          <p>
            To correct a session, use Suggest an edit on that listing. For courts, stringers, or
            general ideas, use Contact / suggest and say what to add or change.
          </p>
        </div>
      ) : formMode === "contact" ? (
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
      ) : (
        <SuggestChangeForm
          key={formMode === "edit" ? editing?.id : "new"}
          mode={formMode}
          session={formMode === "edit" ? editing : undefined}
          onCancel={onClose}
        />
      )}
    </section>
  );
}

import SessionList from "./components/SessionList";
import { PAYPAL_DONATE_URL, SITE_NAME, SITE_TAGLINE } from "./config";

export default function App() {
  return (
    <div className="layout">
      <header className="hero">
        <div className="hero__badge" aria-hidden>
          🏸
        </div>
        <h1>{SITE_NAME}</h1>
        <p className="hero__tagline">{SITE_TAGLINE}</p>
        <p className="hero__note">
          Filter by area, player level, shuttle type (plastic / feather / hybrid / No Strings),
          session type, and format. Filtered results have their own link you can share. If shuttle type is not listed for a session, contact the club before
          you travel — times and prices change too.
        </p>
        <p className="hero__contact">
          Wrong info? Use Suggest an edit on a session — the form opens with that listing filled in.
          To add a club or send any other message, use{" "}
          <a href="#feedback">the forms at the bottom</a> or{" "}
          <a href="#contact">contact / suggest</a>.
        </p>
      </header>

      <main>
        <SessionList />
      </main>

      <footer className="site-footer">
        <p className="site-footer__support">
          If this list helped you find a game,{" "}
          <a
            className="site-footer__coffee-link"
            href={PAYPAL_DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            buy me a coffee with PayPal
          </a>
          .
        </p>
        <p>
          {SITE_NAME} — community-maintained, not affiliated with any single club. For the
          official club list, see the{" "}
          <a href="http://www.phba.org.uk/Clubs/" target="_blank" rel="noopener noreferrer">
            Portsmouth &amp; Hampshire Badminton Association club directory
          </a>
          {" "}
          and{" "}
          <a href="http://www.phba.org.uk/No_Strings/" target="_blank" rel="noopener noreferrer">
            No Strings sessions
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

import SessionList from "./components/SessionList";
import { SITE_NAME, SITE_TAGLINE } from "./config";

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
          Filter by area, player level, shuttle type (plastic / feather / No Strings), session
          type, and format. If shuttle type is not listed for a session, contact the club before
          you travel — times and prices change too.
        </p>
        <p className="hero__contact">
          Wrong info? Use Suggest an edit on a session — the form opens with that listing filled in.
          To add a club, use <a href="#feedback">the form at the bottom of the page</a>.
        </p>
      </header>

      <main>
        <SessionList />
      </main>

      <footer className="site-footer">
        <p>
          {SITE_NAME} — community-maintained, not affiliated with any single club.
        </p>
      </footer>
    </div>
  );
}

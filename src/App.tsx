import { useEffect, useState } from "react";
import CoachList from "./components/CoachList";
import CourtList from "./components/CourtList";
import { FeedbackProvider } from "./components/FeedbackSection";
import HubTabs from "./components/HubTabs";
import SessionList from "./components/SessionList";
import StringerList from "./components/StringerList";
import { trackVirtualPageView } from "./analytics";
import { PAYPAL_DONATE_URL, SITE_NAME, SITE_TAGLINE } from "./config";
import { buildDirectorySearch, readDirectoryFilters, readHubView, type HubView } from "./utils/hubView";

export default function App() {
  const [view, setView] = useState<HubView>(() => readHubView(window.location.search));

  useEffect(() => {
    const syncView = () => setView(readHubView(window.location.search));
    window.addEventListener("popstate", syncView);
    return () => window.removeEventListener("popstate", syncView);
  }, []);

  function changeView(next: HubView) {
    setView(next);
    if (next === "sessions") {
      const params = new URLSearchParams(window.location.search);
      params.delete("view");
      const built = params.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${built ? `?${built}` : ""}${window.location.hash}`,
      );
    } else {
      const { area, query } = readDirectoryFilters(window.location.search);
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${buildDirectorySearch(next, area, query)}${window.location.hash}`,
      );
    }
    trackVirtualPageView();
  }

  return (
    <div className="layout">
      <header className="hero">
        <div className="hero__badge" aria-hidden>
          🏸
        </div>
        <h1>{SITE_NAME}</h1>
        <p className="hero__tagline">{SITE_TAGLINE}</p>
        <p className="hero__note">
          Use the tabs for <strong>sessions</strong>, <strong>coaches</strong>,{" "}
          <strong>bookable courts</strong>, or <strong>stringers</strong>. Filter by area and share
          the URL. Shuttle type, prices, and court slots change — confirm with the venue or coach
          before you travel.
        </p>
        <p className="hero__contact">
          Wrong info? Use Suggest an edit on the card. To add a club, coach, court, or stringer, use the
          buttons at the bottom or{" "}
          <a href="#feedback">the forms at the bottom</a> or{" "}
          <a href="#contact">contact / suggest</a>.
        </p>
      </header>

      <FeedbackProvider>
        <main>
          <HubTabs view={view} onChange={changeView} />
          {view === "sessions" && <SessionList />}
          {view === "coaches" && <CoachList />}
          {view === "courts" && <CourtList />}
          {view === "stringers" && <StringerList />}
        </main>
      </FeedbackProvider>

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

import { HUB_VIEW_LABELS, type HubView } from "../utils/hubView";

type Props = {
  view: HubView;
  onChange: (view: HubView) => void;
};

export default function HubTabs({ view, onChange }: Props) {
  const tabs: HubView[] = ["sessions", "courts", "stringers"];

  return (
    <nav className="hub-tabs" aria-label="Directory sections">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={`hub-tabs__btn${view === tab ? " hub-tabs__btn--active" : ""}`}
          aria-current={view === tab ? "page" : undefined}
          onClick={() => onChange(tab)}
        >
          {HUB_VIEW_LABELS[tab]}
        </button>
      ))}
    </nav>
  );
}

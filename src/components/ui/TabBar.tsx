export interface TabDef {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: TabDef[];
  active: string;
  onChange: (id: string) => void;
  ariaLabel: string;
}

export function TabBar({ tabs, active, onChange, ariaLabel }: TabBarProps) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex flex-wrap gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          type="button"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={`min-h-[44px] rounded-full px-4 py-1.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            active === tab.id
              ? 'bg-accent text-white shadow-soft'
              : 'bg-surface text-ink-soft hover:text-ink'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

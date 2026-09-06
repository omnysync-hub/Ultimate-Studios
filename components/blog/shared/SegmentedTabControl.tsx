type TabOption<T extends string> = {
  id: T;
  label: string;
};

type Props<T extends string> = {
  options: TabOption<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
};

export function SegmentedTabControl<T extends string>({
  options,
  activeTab,
  onChange,
  className = ""
}: Props<T>) {
  return (
    <div
      className={`inline-flex items-center p-1 rounded-pill bg-surface-2 border border-border-subtle ${className}`}
      role="tablist"
    >
      {options.map((option) => {
        const isActive = activeTab === option.id;
        return (
          <button
            key={option.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.id)}
            style={
              isActive
                ? {
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-text-on)"
                  }
                : undefined
            }
            className={`px-4 py-1.5 rounded-pill text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              isActive ? "shadow-sm" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

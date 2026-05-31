import { useTheme, type Theme } from "./ThemeProvider";

const options: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "Auto" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // TODO: There is some issue with this component on hydration. Address it.
  return (
    <div
      className="flex rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] p-0.5"
      role="group"
      aria-label="Color theme"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setTheme(opt.value)}
          aria-pressed={theme === opt.value}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
            theme === opt.value
              ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

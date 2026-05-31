const features = [
  {
    title: "Expert technicians",
    description: "Specialists in gel, extensions, and hand-painted art.",
  },
  {
    title: "Premium products",
    description: "Professional-grade formulas for lasting, healthy results.",
  },
  {
    title: "Easy online booking",
    description: "Reserve your slot in minutes with real-time availability.",
  },
  {
    title: "Inclusive experience",
    description: "Accessible studio designed with WCAG best practices.",
  },
] as const;

export function FeaturesRow() {
  return (
    <section aria-labelledby="features-heading" className="border-y border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 id="features-heading" className="sr-only">
          Why book with us
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <li key={f.title}>
              <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{f.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

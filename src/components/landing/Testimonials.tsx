const testimonials = [
  {
    quote:
      "The nail art was exactly what I wanted — delicate, detailed, and lasted three weeks.",
    author: "Anna K.",
  },
  {
    quote:
      "Booking online was effortless. The studio feels luxurious and welcoming.",
    author: "Maria S.",
  },
  {
    quote:
      "Best gel manicure I've had in Kyiv. Technicians really listen to your preferences.",
    author: "Olena V.",
  },
] as const;

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2
          id="testimonials-heading"
          className="font-serif text-3xl font-semibold text-[var(--text-primary)]"
        >
          What clients say
        </h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.author}>
              <blockquote className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-6">
                <p className="text-sm text-[var(--text-muted)]">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-sm font-semibold text-[var(--text-primary)]">
                  — {t.author}
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

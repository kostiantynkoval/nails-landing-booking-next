type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="font-serif text-4xl font-semibold text-[var(--text-primary)]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-[var(--text-muted)]">{description}</p>
        )}
      </div>
    </header>
  );
}

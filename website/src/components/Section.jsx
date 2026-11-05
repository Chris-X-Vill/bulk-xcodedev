/** Shared wrapper for a page section: anchor id, spacing, heading and optional intro. */
export default function Section({ id, heading, intro, children, className = '' }) {
  return (
    <section id={id} className={`scroll-mt-20 py-16 sm:py-24 ${className}`} aria-labelledby={heading ? `${id}-heading` : undefined}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {heading && (
          <header className="mb-10 max-w-2xl">
            <h2 id={`${id}-heading`} className="text-3xl font-bold tracking-tight sm:text-4xl">
              {heading}
            </h2>
            {intro && <p className="mt-3 text-lg text-ink-2">{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}

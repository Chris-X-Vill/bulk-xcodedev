import { ArrowRight } from 'lucide-react'
import { hero } from '../content'

export default function Hero() {
  return (
    <section id="hero" className="scroll-mt-20 pt-10 pb-16 sm:pt-16 sm:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          {hero.eyebrow && (
            <p className="mb-4 inline-flex rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">{hero.eyebrow}</p>
          )}
          <h1 className="text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl">{hero.heading}</h1>
          <p className="mt-5 max-w-xl text-lg text-ink-2">{hero.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {hero.primaryButton?.label && (
              <a
                href={hero.primaryButton.href}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-accent-ink transition hover:opacity-90"
              >
                {hero.primaryButton.label} <ArrowRight size={18} />
              </a>
            )}
            {hero.secondaryButton?.label && (
              <a
                href={hero.secondaryButton.href}
                className="inline-flex items-center rounded-xl border border-line bg-surface px-5 py-3 font-semibold text-ink transition hover:bg-surface-2"
              >
                {hero.secondaryButton.label}
              </a>
            )}
          </div>
        </div>
        {hero.image && (
          <img
            src={hero.image}
            alt={hero.imageAlt ?? ''}
            width="1200"
            height="900"
            className="aspect-[4/3] w-full max-w-full rounded-3xl border border-line object-cover shadow-xl shadow-black/5"
          />
        )}
      </div>
    </section>
  )
}

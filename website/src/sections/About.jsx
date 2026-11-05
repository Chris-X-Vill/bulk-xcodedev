import Section from '../components/Section'
import { about } from '../content'

export default function About() {
  return (
    <Section id="about">
      <div className="grid items-center gap-10 md:grid-cols-[2fr_3fr] md:gap-14">
        {about.image && (
          <img
            src={about.image}
            alt={about.imageAlt ?? ''}
            width="800"
            height="1000"
            loading="lazy"
            className="aspect-[4/5] w-full max-w-sm rounded-3xl border border-line object-cover md:max-w-full"
          />
        )}
        <div>
          <h2 id="about-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            {about.heading}
          </h2>
          <div className="mt-5 max-w-prose space-y-4 text-lg text-ink-2">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {about.facts?.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-3">
              {about.facts.map((f) => (
                <div key={f.label} className="rounded-2xl border border-line bg-surface p-4">
                  <dt className="text-xs font-semibold tracking-wide text-ink-3 uppercase">{f.label}</dt>
                  <dd className="mt-1 font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </Section>
  )
}

import { Sparkles } from 'lucide-react'
import Section from '../components/Section'
import { comingSoon } from '../content'

export default function ComingSoon() {
  return (
    <Section id="comingSoon" heading={comingSoon.heading} intro={comingSoon.intro} className="bg-surface">
      <ul className="grid gap-4 md:grid-cols-3">
        {comingSoon.items.map((item) => (
          <li key={item.title} className="rounded-3xl border-2 border-dashed border-line p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sun/25 px-2.5 py-1 text-xs font-bold text-ink">
              <Sparkles size={13} /> Coming soon
            </span>
            <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
            <p className="mt-1 text-ink-2">{item.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

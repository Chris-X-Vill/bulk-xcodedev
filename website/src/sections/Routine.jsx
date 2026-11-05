import Section from '../components/Section'
import { routine } from '../content'

export default function Routine() {
  return (
    <Section id="routine" heading={routine.heading} intro={routine.intro}>
      <ol className="relative max-w-2xl space-y-6 border-l-2 border-dashed border-line pl-8">
        {routine.items.map((step) => (
          <li key={`${step.time}-${step.title}`} className="relative">
            <span className="absolute top-1 -left-[41px] h-4 w-4 rounded-full border-4 border-bg bg-sun ring-2 ring-sun" aria-hidden />
            <p className="font-display text-sm font-semibold text-accent tabular-nums">{step.time}</p>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            {step.text && <p className="text-ink-2">{step.text}</p>}
          </li>
        ))}
      </ol>
    </Section>
  )
}

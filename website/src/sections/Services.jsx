import { BarChart3, Camera, Code2, Lightbulb, PenTool, Rocket, Smartphone, Users } from 'lucide-react'
import Section from '../components/Section'
import { services } from '../content'

// Names you can use for `icon` in content.js. Add more from https://lucide.dev/icons by importing them above.
const ICONS = { code: Code2, design: PenTool, idea: Lightbulb, launch: Rocket, camera: Camera, people: Users, chart: BarChart3, phone: Smartphone }

export default function Services() {
  return (
    <Section id="services" heading={services.heading} intro={services.intro} className="bg-surface">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.items.map((s) => {
          const Icon = ICONS[s.icon] ?? Lightbulb
          return (
            <article key={s.title} className="rounded-2xl border border-line bg-bg p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-ink-2">{s.text}</p>
            </article>
          )
        })}
      </div>
    </Section>
  )
}

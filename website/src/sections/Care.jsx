import { Bath, Bone, Droplets, Footprints, Heart, Home, Stethoscope, Sun, ToyBrick } from 'lucide-react'
import Section from '../components/Section'
import { care } from '../content'

// Names you can use for `icon` in content.js. Add more from https://lucide.dev/icons by importing them above.
const ICONS = { food: Bone, water: Droplets, walk: Footprints, groom: Bath, vet: Stethoscope, love: Heart, play: ToyBrick, home: Home, sun: Sun }

export default function Care() {
  return (
    <Section id="care" heading={care.heading} intro={care.intro} className="bg-surface">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {care.items.map((item) => {
          const Icon = ICONS[item.icon] ?? Heart
          return (
            <article key={item.title} className="rounded-3xl border border-line bg-bg p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-ink-2">{item.text}</p>
            </article>
          )
        })}
      </div>
    </Section>
  )
}

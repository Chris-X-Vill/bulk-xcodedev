import { ArrowUpRight } from 'lucide-react'
import Section from '../components/Section'
import { projects } from '../content'

const isExternal = (href) => /^https?:\/\//.test(href)

export default function Projects() {
  return (
    <Section id="projects" heading={projects.heading} intro={projects.intro}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.items.map((p) => (
          <article key={p.title} className="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface">
            {p.image && <img src={p.image} alt="" width="1200" height="800" loading="lazy" className="aspect-[3/2] w-full object-cover" />}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="mt-2 flex-1 text-ink-2">{p.description}</p>
              {p.tags?.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
                  {p.tags.map((t) => (
                    <li key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink-2">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              {p.link && (
                <a
                  href={p.link}
                  {...(isExternal(p.link) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="mt-5 inline-flex items-center gap-1 self-start font-semibold text-accent hover:underline"
                >
                  {p.linkLabel || 'View project'} <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

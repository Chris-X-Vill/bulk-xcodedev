import { useState } from 'react'
import { Check, Copy, Mail } from 'lucide-react'
import Section from '../components/Section'
import { contact, site } from '../content'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked: the address is still selectable on the page */
    }
  }

  return (
    <Section id="contact">
      <div className="rounded-3xl bg-accent px-6 py-12 text-accent-ink sm:px-12 sm:py-16">
        <h2 id="contact-heading" className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          {contact.heading}
        </h2>
        <p className="mt-3 max-w-xl text-lg opacity-85">{contact.text}</p>
        {site.email && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 rounded-xl bg-accent-ink px-5 py-3 font-semibold text-accent transition hover:opacity-90">
            <Mail size={18} /> {site.email}
          </a>
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-xl border border-current/30 px-4 py-3 font-semibold transition hover:bg-black/10"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Copied' : 'Copy email'}
          </button>
        </div>
        )}
        {contact.links?.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {contact.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="font-semibold underline-offset-4 hover:underline">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  )
}

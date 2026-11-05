import { useEffect, useState } from 'react'
import Header from './components/Header'
import { SECTIONS, about, contact, footer, gallery, projects, services, site } from './content'
import About from './sections/About'
import Contact from './sections/Contact'
import Gallery from './sections/Gallery'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import Services from './sections/Services'

// Every section the page knows about. To add one, create it in src/sections/ and register it here.
const REGISTRY = {
  hero: { component: Hero, content: null },
  about: { component: About, content: about },
  services: { component: Services, content: services },
  projects: { component: Projects, content: projects },
  gallery: { component: Gallery, content: gallery },
  contact: { component: Contact, content: contact },
}

// Menu text: a section's menuLabel if set in content.js, otherwise its heading. Sections without content stay out of the menu.
const menuLabel = (id) => REGISTRY[id].content && (REGISTRY[id].content.menuLabel ?? REGISTRY[id].content.heading)

const THEME_KEY = 'website:theme'

function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY)
      if (saved) return saved === 'dark'
    } catch {
      /* storage unavailable */
    }
    return Boolean(window.matchMedia?.('(prefers-color-scheme: dark)').matches)
  })
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])
  const toggle = () =>
    setDark((d) => {
      try {
        localStorage.setItem(THEME_KEY, d ? 'light' : 'dark')
      } catch {
        /* storage unavailable */
      }
      return !d
    })
  return [dark, toggle]
}

export default function App() {
  const [dark, toggleTheme] = useTheme()
  const sections = SECTIONS.filter((id) => REGISTRY[id])
  const links = sections.filter(menuLabel).map((id) => ({ href: `#${id}`, label: menuLabel(id) }))

  useEffect(() => {
    document.title = site.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', site.description)
  }, [])

  return (
    <div id="top" className="min-h-screen">
      <a href="#main" className="sr-only rounded-lg bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50">
        Skip to content
      </a>
      <Header name={site.name} links={links} dark={dark} onToggleTheme={toggleTheme} />
      <main id="main">
        {sections.map((id) => {
          const Component = REGISTRY[id].component
          return <Component key={id} />
        })}
      </main>
      <footer className="border-t border-line pb-[env(safe-area-inset-bottom,0px)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-ink-3 sm:px-6">
          <p>
            © {new Date().getFullYear()} {footer.text}
          </p>
          <a href={`mailto:${site.email}`} className="hover:text-ink">
            {site.email}
          </a>
        </div>
      </footer>
    </div>
  )
}

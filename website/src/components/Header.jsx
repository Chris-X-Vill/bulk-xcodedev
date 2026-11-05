import { useEffect, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'

export default function Header({ name, links, dark, onToggleTheme }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 pt-[env(safe-area-inset-top,0px)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="font-display text-lg font-bold tracking-tight">
          {name}
        </a>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-2 transition hover:bg-surface-2 hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleTheme}
            className="rounded-lg p-2 text-ink-2 transition hover:bg-surface-2 hover:text-ink"
            aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg p-2 text-ink-2 transition hover:bg-surface-2 hover:text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Main" className="animate-fade-in border-t border-line px-4 pb-4 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base font-medium text-ink transition hover:bg-surface-2">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

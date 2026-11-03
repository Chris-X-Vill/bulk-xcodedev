import { Activity, CalendarDays, LayoutDashboard, Settings, Target } from 'lucide-react'

export const ROUTES = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'activities', label: 'Activities', icon: Activity },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ route }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
      <div className="flex items-center gap-2.5 px-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-btn text-btn-ink">
          <Activity size={17} strokeWidth={2.5} />
        </span>
        <span className="text-[15px] font-semibold tracking-tight">Dayflow</span>
      </div>
      <nav className="mt-8 space-y-1" aria-label="Main">
        {ROUTES.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={route === id ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              route === id ? 'bg-surface-2 text-ink' : 'text-ink-3 hover:bg-surface-2 hover:text-ink'
            }`}
          >
            <Icon size={17} />
            {label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

/** Tab bar for phones and tablets, where the sidebar is hidden. */
export function BottomNav({ route }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 px-[max(8px,env(safe-area-inset-left,0px))]">
        {ROUTES.map(({ id, label, icon: Icon }) => {
          const active = route === id
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition ${active ? 'text-ink' : 'text-ink-3'}`}
              >
                <span className={`grid h-7 w-12 place-items-center rounded-full transition ${active ? 'bg-surface-2' : ''}`}>
                  <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                </span>
                {label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Gauge,
  LayoutDashboard,
  LineChart,
  Moon,
  Plus,
  Settings,
  Sun,
  Target,
} from 'lucide-react'
import ActivityChart from './components/ActivityChart'
import KpiCard, { Delta } from './components/KpiCard'
import LogModal from './components/LogModal'
import LogTable from './components/LogTable'
import { makeSeed } from './lib/seed'
import {
  CATEGORIES,
  addDays,
  buildWeek,
  computeStreak,
  fmtDay,
  fmtDuration,
  longestStreak,
  toKey,
  uid,
} from './lib/utils'

const STORAGE_KEY = 'activity-tracker:logs'
const THEME_KEY = 'activity-tracker:theme'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback()
  } catch {
    return fallback()
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — keep working in memory */
  }
}

function useTheme() {
  const [theme, setTheme] = useState(() =>
    load(THEME_KEY, () => (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')),
  )
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    save(THEME_KEY, theme)
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Activity, label: 'Activities' },
  { icon: Target, label: 'Goals' },
  { icon: CalendarDays, label: 'Calendar' },
  { icon: Settings, label: 'Settings' },
]

export default function App() {
  const [logs, setLogs] = useState(() => load(STORAGE_KEY, () => makeSeed()))
  const [theme, toggleTheme] = useTheme()
  const [weekOffset, setWeekOffset] = useState(0)
  const [chartMode, setChartMode] = useState('bar')
  const [modal, setModal] = useState({ open: false, entry: null })
  const [toast, setToast] = useState(null)

  useEffect(() => save(STORAGE_KEY, logs), [logs])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  const today = useMemo(() => new Date(), [])
  // Rolling 7-day windows ending today, so comparisons are always like-for-like (never a partial week).
  const weekEnd = addDays(today, weekOffset * 7)
  const weekStart = addDays(weekEnd, -6)
  const days = useMemo(() => buildWeek(logs, weekStart), [logs, weekStart.getTime()]) // eslint-disable-line react-hooks/exhaustive-deps
  const prevDays = useMemo(() => buildWeek(logs, addDays(weekStart, -7)), [logs, weekStart.getTime()]) // eslint-disable-line react-hooks/exhaustive-deps

  const elapsed = 7
  const total = days.reduce((s, d) => s + d.total, 0)
  const prevTotal = prevDays.reduce((s, d) => s + d.total, 0)
  const avg = total / elapsed
  const prevAvg = prevTotal / elapsed
  const streak = computeStreak(logs, today)
  const best = longestStreak(logs)
  const activeKeys = new Set(logs.map((l) => l.date))
  const last14 = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13))

  const byCategory = CATEGORIES.map((c) => ({
    ...c,
    minutes: days.reduce((s, d) => s + d.byCat[c.id], 0),
  })).sort((a, b) => b.minutes - a.minutes)

  const openAdd = () => setModal({ open: true, entry: null })
  const openEdit = (entry) => setModal({ open: true, entry })
  const closeModal = useCallback(() => setModal({ open: false, entry: null }), [])

  const handleSave = (entry) => {
    setLogs((prev) =>
      entry.id ? prev.map((l) => (l.id === entry.id ? entry : l)) : [...prev, { ...entry, id: uid() }],
    )
    setToast({ message: entry.id ? 'Log updated' : 'Log added' })
    closeModal()
  }

  const handleDelete = (entry) => {
    setLogs((prev) => prev.filter((l) => l.id !== entry.id))
    setToast({ message: `Deleted “${entry.title}”`, undo: entry })
  }

  const undoDelete = () => {
    if (toast?.undo) setLogs((prev) => [...prev, toast.undo])
    setToast(null)
  }

  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
        <div className="flex items-center gap-2.5 px-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-btn text-btn-ink">
            <Activity size={17} strokeWidth={2.5} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Dayflow</span>
        </div>
        <nav className="mt-8 space-y-1">
          {NAV.map(({ icon: Icon, label, active }) => (
            <a
              key={label}
              href="#"
              onClick={(e) => e.preventDefault()}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? 'bg-surface-2 text-ink' : 'text-ink-3 hover:bg-surface-2 hover:text-ink'
              }`}
            >
              <Icon size={17} />
              {label}
            </a>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-line bg-surface-2 p-4">
          <p className="text-sm font-semibold">Weekly goal</p>
          <p className="mt-0.5 text-xs text-ink-3">
            {fmtDuration(total)} of 20h
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-s1" style={{ width: `${Math.min(100, (total / 1200) * 100)}%` }} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1280px] space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-ink-3">{greeting}</p>
              <h1 className="text-2xl font-semibold tracking-tight">Daily Activity Tracker</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-line bg-surface">
                <button
                  onClick={() => setWeekOffset((w) => w - 1)}
                  className="p-2 text-ink-2 transition hover:text-ink"
                  aria-label="Previous 7 days"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="min-w-36 text-center text-sm font-medium tabular">
                  {weekOffset === 0 ? 'Last 7 days' : `${fmtDay(weekStart)} – ${fmtDay(weekEnd)}`}
                </span>
                <button
                  onClick={() => setWeekOffset((w) => Math.min(0, w + 1))}
                  disabled={weekOffset === 0}
                  className="p-2 text-ink-2 transition hover:text-ink disabled:opacity-30"
                  aria-label="Next 7 days"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <button
                onClick={toggleTheme}
                className="rounded-lg border border-line bg-surface p-2 text-ink-2 transition hover:text-ink"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 rounded-lg bg-btn px-3.5 py-2 text-sm font-semibold text-btn-ink transition hover:opacity-90"
              >
                <Plus size={16} strokeWidth={2.5} />
                Add Log
              </button>
            </div>
          </header>

          {/* KPIs */}
          <div className="grid gap-4 md:grid-cols-3">
            <KpiCard
              icon={Clock}
              label="Total Time"
              value={fmtDuration(total)}
              footer={<Delta value={prevTotal ? (total - prevTotal) / prevTotal : null} />}
            />
            <KpiCard
              icon={Gauge}
              label="Daily Average"
              value={fmtDuration(avg)}
              unit="/ day"
              footer={<Delta value={prevAvg ? (avg - prevAvg) / prevAvg : null} />}
            />
            <KpiCard
              icon={Flame}
              label="Streak"
              value={streak}
              unit={streak === 1 ? 'day' : 'days'}
              footer={<span className="text-xs text-ink-3">Longest streak: {best} days</span>}
            >
              <div className="mt-4 flex gap-1" aria-label="Active days over the last two weeks">
                {last14.map((d) => {
                  const on = activeKeys.has(toKey(d))
                  return (
                    <span
                      key={toKey(d)}
                      title={`${fmtDay(d)}${on ? ' · active' : ' · no activity'}`}
                      className={`h-2 flex-1 rounded-full ${on ? 'bg-s2' : 'bg-line'}`}
                    />
                  )
                })}
              </div>
            </KpiCard>
          </div>

          {/* Chart + breakdown */}
          <div className="grid gap-4 xl:grid-cols-3">
            <section className="rounded-2xl border border-line bg-surface p-5 xl:col-span-2">
              <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">Weekly activity</h2>
                  <p className="text-sm text-ink-3">
                    {fmtDay(weekStart)} – {fmtDay(weekEnd)} · time logged per day
                  </p>
                </div>
                <div className="flex rounded-lg border border-line p-0.5" role="tablist" aria-label="Chart type">
                  {[
                    { id: 'bar', icon: BarChart3, label: 'By category' },
                    { id: 'line', icon: LineChart, label: 'Trend' },
                  ].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={chartMode === id}
                      onClick={() => setChartMode(id)}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                        chartMode === id ? 'bg-surface-2 text-ink' : 'text-ink-3 hover:text-ink'
                      }`}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </div>
              </header>

              {/* Legend */}
              <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
                {chartMode === 'bar' ? (
                  CATEGORIES.map((c) => (
                    <span key={c.id} className="flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-sm ${c.dot}`} />
                      {c.label}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="flex items-center gap-1.5">
                      <span className="h-0.5 w-4 rounded bg-s1" />
                      Selected period
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 border-t-2 border-dashed border-ink-3" />
                      Previous 7 days
                    </span>
                  </>
                )}
              </div>
              <ActivityChart days={days} prevDays={prevDays} mode={chartMode} />
            </section>

            <section className="flex flex-col rounded-2xl border border-line bg-surface p-5">
              <h2 className="text-base font-semibold">Time by category</h2>
              <p className="text-sm text-ink-3">Share of {fmtDuration(total)} in this period</p>
              <ul className="mt-6 space-y-5">
                {byCategory.map((c) => {
                  const share = total ? c.minutes / total : 0
                  return (
                    <li key={c.id}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium">
                          <span className={`h-2.5 w-2.5 rounded-sm ${c.dot}`} />
                          {c.label}
                        </span>
                        <span className="text-ink-2 tabular">
                          {fmtDuration(c.minutes)}
                          <span className="ml-2 inline-block w-9 text-right text-ink-3">{Math.round(share * 100)}%</span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-2">
                        <div className={`h-full rounded-full ${c.dot}`} style={{ width: `${share * 100}%` }} />
                      </div>
                    </li>
                  )
                })}
              </ul>
              <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                <div className="rounded-xl bg-surface-2 p-3">
                  <p className="text-xs text-ink-3">Entries</p>
                  <p className="mt-1 text-lg font-semibold tabular">
                    {logs.filter((l) => l.date >= toKey(weekStart) && l.date <= toKey(weekEnd)).length}
                  </p>
                </div>
                <div className="rounded-xl bg-surface-2 p-3">
                  <p className="text-xs text-ink-3">Active days</p>
                  <p className="mt-1 text-lg font-semibold tabular">
                    {days.filter((d) => d.total > 0).length}
                    <span className="text-sm font-normal text-ink-3"> / {elapsed}</span>
                  </p>
                </div>
              </div>
            </section>
          </div>

          <LogTable logs={logs} onEdit={openEdit} onDelete={handleDelete} />
        </div>
      </main>

      <LogModal open={modal.open} entry={modal.entry} onClose={closeModal} onSave={handleSave} />

      {toast && (
        <div className="animate-pop-in fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl bg-btn px-4 py-3 text-sm text-btn-ink shadow-xl">
          {toast.message}
          {toast.undo && (
            <button onClick={undoDelete} className="font-semibold underline underline-offset-2">
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  )
}

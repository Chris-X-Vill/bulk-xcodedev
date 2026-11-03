import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import ActivityRow from '../components/ActivityRow'
import { CATEGORIES, compareLogs, fmtDuration, fmtFull, fmtMonth, fmtWeekday, fromKey, groupByDate, monthGrid, toKey } from '../lib/utils'

const CAT_ORDER = Object.fromEntries(CATEGORIES.map((c, i) => [c.id, i]))
const DOT = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.dot]))

export default function CalendarView({ logs, today, onAdd, onEdit, onDelete }) {
  const todayKey = toKey(today)
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(todayKey)

  const byDate = useMemo(() => {
    const map = groupByDate(logs)
    for (const items of map.values()) items.sort((a, b) => CAT_ORDER[a.category] - CAT_ORDER[b.category] || b.minutes - a.minutes)
    return map
  }, [logs])

  const grid = monthGrid(month)
  const monthIdx = month.getMonth()
  const monthLogs = grid.filter((d) => d.getMonth() === monthIdx).flatMap((d) => byDate.get(toKey(d)) ?? [])
  const activeDays = new Set(monthLogs.map((l) => l.date)).size
  const selectedLogs = [...(byDate.get(selected) ?? [])].sort(compareLogs)
  const selectedDate = fromKey(selected)
  const isCurrentMonth = month.getFullYear() === today.getFullYear() && monthIdx === today.getMonth()

  const shiftMonth = (n) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1))
  const goToday = () => {
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelected(todayKey)
  }
  const pick = (d) => {
    setSelected(toKey(d))
    if (d.getMonth() !== monthIdx) setMonth(new Date(d.getFullYear(), d.getMonth(), 1))
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight" aria-live="polite">
              {fmtMonth(month)}
            </h2>
            <p className="text-sm text-ink-3 tabular">
              {activeDays} active {activeDays === 1 ? 'day' : 'days'} · {fmtDuration(monthLogs.reduce((s, l) => s + l.minutes, 0))} logged
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={goToday}
              disabled={isCurrentMonth && selected === todayKey}
              className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-surface-2 disabled:opacity-40"
            >
              Today
            </button>
            <button onClick={() => shiftMonth(-1)} className="rounded-lg p-2 text-ink-2 transition hover:bg-surface-2 hover:text-ink" aria-label="Previous month">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => shiftMonth(1)} className="rounded-lg p-2 text-ink-2 transition hover:bg-surface-2 hover:text-ink" aria-label="Next month">
              <ChevronRight size={18} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-7 gap-1" role="grid" aria-label={fmtMonth(month)}>
          {grid.slice(0, 7).map((d) => (
            <div key={`h${d.getDay()}`} className="pb-1 text-center text-[11px] font-medium text-ink-3" role="columnheader">
              {fmtWeekday(d)}
            </div>
          ))}
          {grid.map((d) => {
            const key = toKey(d)
            const items = byDate.get(key) ?? []
            const inMonth = d.getMonth() === monthIdx
            const isToday = key === todayKey
            const isSelected = key === selected
            const minutes = items.reduce((s, l) => s + l.minutes, 0)
            const label = `${fmtFull(d)}: ${items.length ? `${items.length} ${items.length === 1 ? 'activity' : 'activities'}, ${fmtDuration(minutes)}` : 'no activities'}`
            return (
              <button
                key={key}
                role="gridcell"
                aria-selected={isSelected}
                aria-label={label}
                onClick={() => pick(d)}
                className={`flex min-h-14 flex-col items-center gap-1 rounded-xl border p-1.5 text-left transition sm:min-h-24 sm:items-stretch sm:p-2 ${
                  isSelected ? 'border-ink bg-surface-2' : 'border-transparent hover:bg-surface-2'
                } ${inMonth ? '' : 'opacity-40'}`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-medium tabular ${
                    isToday ? 'bg-btn font-semibold text-btn-ink' : 'text-ink'
                  }`}
                >
                  {d.getDate()}
                </span>
                {items.length > 0 && (
                  <span className="flex flex-wrap justify-center gap-0.5 sm:justify-start sm:gap-1" aria-hidden>
                    {items.slice(0, 4).map((l) => (
                      <span key={l.id} className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${DOT[l.category]}`} />
                    ))}
                    {items.length > 4 && <span className="text-[9px] leading-none font-semibold text-ink-3">+{items.length - 4}</span>}
                  </span>
                )}
                {minutes > 0 && <span className="mt-auto hidden text-[11px] text-ink-3 tabular sm:block">{fmtDuration(minutes)}</span>}
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3 text-xs text-ink-2">
          {CATEGORIES.map((c) => (
            <span key={c.id} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${c.dot}`} />
              {c.label}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface" aria-labelledby="day-title">
        <header className="flex items-start justify-between gap-3 border-b border-line px-4 py-4 sm:px-5">
          <div>
            <h2 id="day-title" className="text-base font-semibold">
              {selected === todayKey ? 'Today' : fmtFull(selectedDate)}
            </h2>
            <p className="text-sm text-ink-3 tabular">
              {selected === todayKey && `${fmtFull(selectedDate)} · `}
              {selectedLogs.length ? `${selectedLogs.length} ${selectedLogs.length === 1 ? 'activity' : 'activities'} · ${fmtDuration(selectedLogs.reduce((s, l) => s + l.minutes, 0))}` : 'No activities'}
            </p>
          </div>
          {selected <= todayKey && (
            <button
              onClick={() => onAdd(selected)}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-sm font-medium text-ink transition hover:bg-surface-2"
              aria-label={`Add a log for ${fmtFull(selectedDate)}`}
            >
              <Plus size={15} /> Add
            </button>
          )}
        </header>
        {selectedLogs.length ? (
          <ul className="divide-y divide-line">
            {selectedLogs.map((log) => (
              <ActivityRow key={log.id} log={log} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </ul>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-ink-3">{selected > todayKey ? 'This day hasn’t happened yet.' : 'Nothing logged on this day.'}</p>
        )}
      </section>
    </div>
  )
}

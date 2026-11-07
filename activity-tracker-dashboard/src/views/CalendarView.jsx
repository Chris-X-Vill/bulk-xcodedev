import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import ActivityRow from '../components/ActivityRow'
import {
  CATEGORIES,
  addDays,
  compareLogs,
  fmtDuration,
  fmtFull,
  fmtMonth,
  fmtWeekday,
  fromKey,
  groupByDate,
  monthGrid,
  startOfWeek,
  toKey,
} from '../lib/utils'

const CAT_ORDER = Object.fromEntries(CATEGORIES.map((c, i) => [c.id, i]))
const DOT = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.dot]))
const firstOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1)

/**
 * Calendar with two views:
 * - month: the month grid, a dot per activity in its category color;
 * - day:   opened by tapping a day — that day's totals, category breakdown and every log, full width.
 */
export default function CalendarView({ logs, today, onAdd, onEdit, onDelete }) {
  const todayKey = toKey(today)
  const [view, setView] = useState('month')
  const [month, setMonth] = useState(() => firstOfMonth(today))
  const [selected, setSelected] = useState(todayKey)

  const byDate = useMemo(() => {
    const map = groupByDate(logs)
    for (const items of map.values()) items.sort((a, b) => CAT_ORDER[a.category] - CAT_ORDER[b.category] || b.minutes - a.minutes)
    return map
  }, [logs])

  const selectDay = (d) => {
    setSelected(toKey(d))
    setMonth(firstOfMonth(d))
  }
  const openDay = (d) => {
    selectDay(d)
    setView('day')
    window.scrollTo({ top: 0 })
  }
  const goToday = () => selectDay(today)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-surface p-1" role="tablist" aria-label="Calendar view">
          {[
            { id: 'month', label: 'Month' },
            { id: 'day', label: 'Day' },
          ].map((v) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={view === v.id}
              onClick={() => setView(v.id)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${view === v.id ? 'bg-surface-2 text-ink' : 'text-ink-3 hover:text-ink'}`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
          {CATEGORIES.map((c) => (
            <span key={c.id} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${c.dot}`} />
              {c.label}
            </span>
          ))}
        </div>
      </div>

      {view === 'month' ? (
        <MonthView
          month={month}
          byDate={byDate}
          today={today}
          selected={selected}
          onShiftMonth={(n) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1))}
          onToday={() => setMonth(firstOfMonth(today))}
          onOpenDay={openDay}
        />
      ) : (
        <DayView
          date={fromKey(selected)}
          byDate={byDate}
          today={today}
          onSelect={selectDay}
          onToday={goToday}
          onBack={() => setView('month')}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}

function MonthView({ month, byDate, today, selected, onShiftMonth, onToday, onOpenDay }) {
  const todayKey = toKey(today)
  const grid = monthGrid(month)
  const monthIdx = month.getMonth()
  const monthLogs = grid.filter((d) => d.getMonth() === monthIdx).flatMap((d) => byDate.get(toKey(d)) ?? [])
  const activeDays = new Set(monthLogs.map((l) => l.date)).size
  const isCurrentMonth = month.getFullYear() === today.getFullYear() && monthIdx === today.getMonth()

  return (
    <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight" aria-live="polite">
            {fmtMonth(month)}
          </h2>
          <p className="text-sm text-ink-3 tabular">
            {activeDays} active {activeDays === 1 ? 'day' : 'days'} · {fmtDuration(monthLogs.reduce((s, l) => s + l.minutes, 0))} logged · tap a day to open it
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToday}
            disabled={isCurrentMonth}
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-surface-2 disabled:opacity-40"
          >
            Today
          </button>
          <button onClick={() => onShiftMonth(-1)} className="rounded-lg p-2 text-ink-2 transition hover:bg-surface-2 hover:text-ink" aria-label="Previous month">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => onShiftMonth(1)} className="rounded-lg p-2 text-ink-2 transition hover:bg-surface-2 hover:text-ink" aria-label="Next month">
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
          const minutes = items.reduce((s, l) => s + l.minutes, 0)
          const label = `Open ${fmtFull(d)}: ${items.length ? `${items.length} ${items.length === 1 ? 'activity' : 'activities'}, ${fmtDuration(minutes)}` : 'no activities'}`
          return (
            <button
              key={key}
              role="gridcell"
              aria-label={label}
              onClick={() => onOpenDay(d)}
              className={`flex min-h-14 flex-col items-center gap-1 rounded-xl border p-1.5 text-left transition sm:min-h-24 sm:items-stretch sm:p-2 ${
                key === selected ? 'border-line-strong' : 'border-transparent'
              } hover:border-ink hover:bg-surface-2 ${inMonth ? '' : 'opacity-40'}`}
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-medium tabular ${isToday ? 'bg-btn font-semibold text-btn-ink' : 'text-ink'}`}
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
    </section>
  )
}

function DayView({ date, byDate, today, onSelect, onToday, onBack, onAdd, onEdit, onDelete }) {
  const key = toKey(date)
  const todayKey = toKey(today)
  const logs = [...(byDate.get(key) ?? [])].sort(compareLogs)
  const total = logs.reduce((s, l) => s + l.minutes, 0)
  const byCategory = CATEGORIES.map((c) => ({ ...c, minutes: logs.filter((l) => l.category === c.id).reduce((s, l) => s + l.minutes, 0) })).filter(
    (c) => c.minutes > 0,
  )
  const week = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(date), i))
  const isFuture = key > todayKey

  // Arrow keys move between days while the day view is open (ignored while typing in a field or a dialog is open).
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, select, [role="dialog"], [role="alertdialog"]')) return
      if (document.querySelector('[aria-modal="true"]')) return
      if (e.key === 'ArrowLeft') onSelect(addDays(date, -1))
      if (e.key === 'ArrowRight') onSelect(addDays(date, 1))
      if (e.key === 'Escape') onBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [date, onSelect, onBack])

  return (
    <section className="rounded-2xl border border-line bg-surface" aria-labelledby="day-view-title">
      <header className="space-y-4 border-b border-line p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 rounded-lg py-1 pr-2 text-sm font-medium text-ink-2 transition hover:text-ink">
            <ArrowLeft size={16} /> {fmtMonth(date)}
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={onToday}
              disabled={key === todayKey}
              className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-surface-2 disabled:opacity-40"
            >
              Today
            </button>
            <button onClick={() => onSelect(addDays(date, -1))} className="rounded-lg p-2 text-ink-2 transition hover:bg-surface-2 hover:text-ink" aria-label="Previous day">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => onSelect(addDays(date, 1))} className="rounded-lg p-2 text-ink-2 transition hover:bg-surface-2 hover:text-ink" aria-label="Next day">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-ink-3">{key === todayKey ? 'Today' : key < todayKey ? 'Past day' : 'Upcoming'}</p>
            <h2 id="day-view-title" className="text-2xl font-semibold tracking-tight" aria-live="polite">
              {fmtFull(date)}
            </h2>
          </div>
          {!isFuture && (
            <button
              onClick={() => onAdd(key)}
              className="flex items-center gap-1.5 rounded-lg bg-btn px-3.5 py-2 text-sm font-semibold text-btn-ink transition hover:opacity-90"
              aria-label={`Add a log for ${fmtFull(date)}`}
            >
              <Plus size={16} strokeWidth={2.5} /> Add log
            </button>
          )}
        </div>

        {/* Week strip for quick switching between nearby days */}
        <div className="grid grid-cols-7 gap-1" role="group" aria-label="Days this week">
          {week.map((d) => {
            const k = toKey(d)
            const items = byDate.get(k) ?? []
            const active = k === key
            return (
              <button
                key={k}
                onClick={() => onSelect(d)}
                aria-pressed={active}
                aria-label={`${fmtFull(d)}: ${items.length} ${items.length === 1 ? 'activity' : 'activities'}`}
                className={`flex flex-col items-center gap-1 rounded-xl py-2 transition ${active ? 'bg-btn text-btn-ink' : 'hover:bg-surface-2'}`}
              >
                <span className={`text-[11px] font-medium ${active ? '' : 'text-ink-3'}`}>{fmtWeekday(d)}</span>
                <span className={`text-sm font-semibold tabular ${k === todayKey && !active ? 'text-ink underline underline-offset-4' : ''}`}>{d.getDate()}</span>
                <span className="flex h-1.5 gap-0.5" aria-hidden>
                  {items.slice(0, 3).map((l) => (
                    <span key={l.id} className={`h-1.5 w-1.5 rounded-full ${DOT[l.category]}`} />
                  ))}
                </span>
              </button>
            )
          })}
        </div>
      </header>

      {logs.length > 0 ? (
        <>
          <div className="grid gap-4 border-b border-line p-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8 sm:p-5">
            <dl className="flex gap-8">
              <div>
                <dt className="text-xs text-ink-3">Total time</dt>
                <dd className="text-2xl font-semibold tracking-tight tabular">{fmtDuration(total)}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-3">Activities</dt>
                <dd className="text-2xl font-semibold tracking-tight tabular">{logs.length}</dd>
              </div>
            </dl>
            <div>
              <div className="flex h-3 gap-0.5 overflow-hidden rounded-full" role="img" aria-label="Time by category">
                {byCategory.map((c) => (
                  <span key={c.id} className={c.dot} style={{ width: `${(c.minutes / total) * 100}%` }} />
                ))}
              </div>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
                {byCategory.map((c) => (
                  <li key={c.id} className="flex items-center gap-1.5 tabular">
                    <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                    {c.label} · {fmtDuration(c.minutes)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ul className="divide-y divide-line">
            {logs.map((log) => (
              <ActivityRow key={log.id} log={log} onEdit={onEdit} onDelete={onDelete} fullNotes />
            ))}
          </ul>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
          <p className="text-sm text-ink-3">{isFuture ? 'This day hasn’t happened yet.' : 'Nothing logged on this day.'}</p>
          {!isFuture && (
            <button
              onClick={() => onAdd(key)}
              className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink transition hover:bg-surface-2"
            >
              <Plus size={15} /> Add a log for this day
            </button>
          )}
        </div>
      )}
    </section>
  )
}

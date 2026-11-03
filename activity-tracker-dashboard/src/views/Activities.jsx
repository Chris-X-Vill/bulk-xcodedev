import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import ActivityRow from '../components/ActivityRow'
import { CATEGORIES, compareLogs, fmtDuration, fmtLong, fromKey, groupByDate } from '../lib/utils'

const PAGE = 40

export default function Activities({ logs, onAdd, onEdit, onDelete }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [limit, setLimit] = useState(PAGE)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return logs
      .filter((l) => category === 'all' || l.category === category)
      .filter((l) => !q || l.title.toLowerCase().includes(q) || l.notes?.toLowerCase().includes(q))
      .sort(compareLogs)
  }, [logs, query, category])

  const groups = [...groupByDate(filtered.slice(0, limit))]
  const totalMinutes = filtered.reduce((s, l) => s + l.minutes, 0)
  const dayTotals = useMemo(() => {
    const m = new Map()
    for (const l of filtered) m.set(l.date, (m.get(l.date) ?? 0) + l.minutes)
    return m
  }, [filtered])

  return (
    <section className="rounded-2xl border border-line bg-surface">
      <header className="space-y-3 border-b border-line px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-3 tabular">
            {filtered.length} {filtered.length === 1 ? 'activity' : 'activities'} · {fmtDuration(totalMinutes)} total
          </p>
          <div className="relative w-full sm:w-64">
            <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3" />
            <input
              id="activity-search"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setLimit(PAGE)
              }}
              placeholder="Search activities and notes"
              aria-label="Search activities"
              className="w-full rounded-lg border border-line bg-surface py-2 pr-3 pl-9 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-ink-3"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
          {[{ id: 'all', label: 'All' }, ...CATEGORIES].map((c) => (
            <button
              key={c.id}
              aria-pressed={category === c.id}
              onClick={() => {
                setCategory(c.id)
                setLimit(PAGE)
              }}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                category === c.id ? 'border-ink bg-surface-2 text-ink' : 'border-line text-ink-3 hover:text-ink'
              }`}
            >
              {c.dot && <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />}
              {c.label}
            </button>
          ))}
        </div>
      </header>

      {groups.length ? (
        <div>
          {groups.map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center justify-between border-b border-line bg-surface-2 px-4 py-2 text-xs font-semibold text-ink-2 sm:px-5">
                <span>{fmtLong(fromKey(date))}</span>
                <span className="tabular">{fmtDuration(dayTotals.get(date))}</span>
              </div>
              <ul className="divide-y divide-line border-b border-line">
                {items.map((log) => (
                  <ActivityRow key={log.id} log={log} onEdit={onEdit} onDelete={onDelete} />
                ))}
              </ul>
            </div>
          ))}
          {filtered.length > limit && (
            <div className="p-4 text-center">
              <button
                onClick={() => setLimit((n) => n + PAGE)}
                className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface-2"
              >
                Show more ({filtered.length - limit} left)
              </button>
            </div>
          )}
        </div>
      ) : logs.length ? (
        <p className="px-5 py-12 text-center text-sm text-ink-3">No activities match your search or filter.</p>
      ) : (
        <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
          <p className="text-sm text-ink-3">No activities yet. Add your first one to start tracking.</p>
          <button onClick={onAdd} className="flex items-center gap-1.5 rounded-lg bg-btn px-3.5 py-2 text-sm font-semibold text-btn-ink transition hover:opacity-90">
            <Plus size={16} strokeWidth={2.5} /> Add activity
          </button>
        </div>
      )}
    </section>
  )
}

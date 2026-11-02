import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Pencil, Search, Trash2 } from 'lucide-react'
import { CATEGORIES, categoryById, fmtDuration, fmtLong, fromKey } from '../lib/utils'

const PAGE_SIZE = 8

export default function LogTable({ logs, onEdit, onDelete }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return logs
      .filter((l) => category === 'all' || l.category === category)
      .filter((l) => !q || l.title.toLowerCase().includes(q) || l.notes?.toLowerCase().includes(q))
      .sort((a, b) => (a.date === b.date ? b.minutes - a.minutes : a.date < b.date ? 1 : -1))
  }, [logs, query, category])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages - 1)
  const rows = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE)

  return (
    <section className="rounded-2xl border border-line bg-surface">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-ink">Activity log</h2>
          <p className="text-sm text-ink-3">{filtered.length} entries</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(0)
              }}
              placeholder="Search activities"
              className="w-56 rounded-lg border border-line bg-surface py-2 pr-3 pl-9 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-ink-3"
            />
          </div>
          <div className="flex flex-wrap rounded-lg border border-line p-0.5">
            {[{ id: 'all', label: 'All' }, ...CATEGORIES].map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCategory(c.id)
                  setPage(0)
                }}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                  category === c.id ? 'bg-surface-2 text-ink' : 'text-ink-3 hover:text-ink'
                }`}
              >
                {c.dot && <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />}
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="relative overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs font-medium tracking-wide text-ink-3 uppercase">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Activity</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 text-right font-medium">Duration</th>
              <th className="px-5 py-3 font-medium">Notes</th>
              <th className="px-5 py-3 text-right font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((log) => {
              const c = categoryById[log.category]
              return (
                <tr key={log.id} className="group border-t border-line transition hover:bg-surface-2">
                  <td className="px-5 py-3 whitespace-nowrap text-ink-2 tabular">{fmtLong(fromKey(log.date))}</td>
                  <td className="px-5 py-3 font-medium text-ink">{log.title}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-2 py-0.5 text-xs font-medium text-ink-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                      {c.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-ink tabular">{fmtDuration(log.minutes)}</td>
                  <td className="max-w-64 truncate px-5 py-3 text-ink-3">{log.notes || '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1 opacity-60 transition group-hover:opacity-100 focus-within:opacity-100">
                      <button
                        onClick={() => onEdit(log)}
                        className="rounded-md p-1.5 text-ink-2 transition hover:bg-surface hover:text-ink"
                        aria-label={`Edit ${log.title}`}
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(log)}
                        className="rounded-md p-1.5 text-ink-2 transition hover:bg-bad/10 hover:text-bad"
                        aria-label={`Delete ${log.title}`}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {!rows.length && (
        <p className="border-t border-line px-5 py-12 text-center text-sm text-ink-3">
          {logs.length ? 'No entries match your filters.' : 'No logs yet. Tap Add Log to record your first activity.'}
        </p>
      )}

      <footer className="flex items-center justify-between border-t border-line px-5 py-3 text-sm text-ink-3">
        <span className="tabular">
          Page {current + 1} of {pages}
        </span>
        <div className="flex gap-1">
          <button
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
            className="rounded-md border border-line p-1.5 text-ink transition hover:bg-surface-2 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={current >= pages - 1}
            onClick={() => setPage(current + 1)}
            className="rounded-md border border-line p-1.5 text-ink transition hover:bg-surface-2 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>
    </section>
  )
}

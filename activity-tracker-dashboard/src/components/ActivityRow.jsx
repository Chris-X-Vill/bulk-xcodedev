import { Pencil, Trash2 } from 'lucide-react'
import { categoryById, fmtDuration, fmtLong, fromKey } from '../lib/utils'

// fullNotes: show the notes on their own wrapped line instead of truncating them (used by the calendar's day view).
export default function ActivityRow({ log, onEdit, onDelete, showDate = false, fullNotes = false }) {
  const c = categoryById[log.category]
  const meta = [c.label, showDate ? fmtLong(fromKey(log.date)) : null, fullNotes ? null : log.notes || null].filter(Boolean).join(' · ')
  return (
    <li className={`group flex gap-3 ${fullNotes ? 'items-start' : 'items-center'} px-4 py-3 transition hover:bg-surface-2 sm:px-5`}>
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${c.dot} ${fullNotes ? 'mt-1.5' : ''}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{log.title}</p>
        <p className="truncate text-xs text-ink-3">{meta}</p>
        {fullNotes && log.notes && <p className="mt-1 text-sm whitespace-pre-line text-ink-2">{log.notes}</p>}
      </div>
      <span className="shrink-0 text-sm font-medium text-ink tabular">{fmtDuration(log.minutes)}</span>
      <div className="flex shrink-0 transition focus-within:opacity-100 lg:opacity-60 lg:group-hover:opacity-100">
        <button
          onClick={() => onEdit(log)}
          className="rounded-md p-2 text-ink-2 transition hover:bg-surface hover:text-ink"
          aria-label={`Edit ${log.title}`}
          title="Edit"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(log)}
          className="rounded-md p-2 text-ink-2 transition hover:bg-bad/10 hover:text-bad"
          aria-label={`Delete ${log.title}`}
          title="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </li>
  )
}

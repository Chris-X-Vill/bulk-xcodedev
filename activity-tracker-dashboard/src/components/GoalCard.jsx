import { AlertCircle, CheckCircle2, CircleDashed, Pencil, Trash2, TrendingUp } from 'lucide-react'
import { PERIODS, STATUS } from '../lib/goals'
import { categoryById, fmtDuration } from '../lib/utils'

const STATUS_ICON = { met: CheckCircle2, ontrack: TrendingUp, behind: AlertCircle, progress: CircleDashed, notstarted: CircleDashed }
const TONE = { good: 'bg-good/10 text-good', warn: 'bg-warn/10 text-warn', neutral: 'bg-surface-2 text-ink-2' }

export function StatusChip({ status }) {
  const s = STATUS[status]
  const Icon = STATUS_ICON[status]
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold ${TONE[s.tone]}`}>
      <Icon size={12} strokeWidth={2.5} aria-hidden />
      {s.label}
    </span>
  )
}

export default function GoalCard({ goal, progress, onEdit, onDelete, compact = false }) {
  const c = goal.category === 'all' ? null : categoryById[goal.category]
  const fill = c ? c.dot : 'bg-ink'
  const period = PERIODS.find((p) => p.id === goal.period)
  const pct = Math.round(progress.ratio * 100)

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-ink">{goal.title}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-3">
            <span className={`h-2 w-2 rounded-full ${c ? c.dot : 'border border-ink-3'}`} aria-hidden />
            {c ? c.label : 'All activities'} · {period.label}
          </p>
        </div>
        {onEdit && (
          <div className="-mt-1 -mr-2 flex shrink-0">
            <button
              onClick={() => onEdit(goal)}
              className="rounded-md p-2 text-ink-2 transition hover:bg-surface-2 hover:text-ink"
              aria-label={`Edit goal ${goal.title}`}
              title="Edit"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDelete(goal)}
              className="rounded-md p-2 text-ink-2 transition hover:bg-bad/10 hover:text-bad"
              aria-label={`Delete goal ${goal.title}`}
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </header>

      <div>
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-ink tabular">
            <span className="text-2xl font-semibold tracking-tight">{fmtDuration(progress.done)}</span>
            <span className="text-sm text-ink-3"> of {fmtDuration(progress.target)}</span>
          </p>
          <span className="text-sm font-semibold text-ink-2 tabular">{pct}%</span>
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(100, pct)}
          aria-label={`${goal.title} progress`}
        >
          <div className={`h-full rounded-full ${fill} transition-[width]`} style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatusChip status={progress.status} />
        <span className="text-xs text-ink-3">{progress.periodLabel}</span>
      </div>

      {!compact && (
        <div className="border-t border-line pt-4">
          <div className="flex items-end gap-1.5" aria-label={progress.historyLabel}>
            {progress.history.map((h) => (
              <div key={h.key} className="flex flex-1 flex-col items-center gap-1.5" title={h.title}>
                <div className={`relative h-8 w-full overflow-hidden rounded-md bg-surface-2 ${h.current ? 'ring-1 ring-line-strong' : ''}`}>
                  <div className={`absolute inset-x-0 bottom-0 ${fill} ${h.met ? '' : 'opacity-40'}`} style={{ height: `${h.ratio * 100}%` }} />
                </div>
                <span className={`text-[10px] whitespace-nowrap tabular ${h.current ? 'font-semibold text-ink' : 'text-ink-3'}`}>{h.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-3">{progress.historyLabel}</p>
        </div>
      )}
    </article>
  )
}

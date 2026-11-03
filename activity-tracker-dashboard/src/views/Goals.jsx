import { Plus, Target } from 'lucide-react'
import GoalCard from '../components/GoalCard'
import { goalProgress } from '../lib/goals'

const SUGGESTIONS = [
  { title: '30m of Exercise a day', category: 'exercise', period: 'daily', target: 30 },
  { title: '2h of Deep Work a day', category: 'work', period: 'daily', target: 120 },
  { title: '3h of Learning a week', category: 'learning', period: 'weekly', target: 180 },
  { title: '10h of activity a week', category: 'all', period: 'weekly', target: 600 },
]

export default function Goals({ goals, logs, today, onAdd, onCreate, onEdit, onDelete }) {
  const rows = goals.map((g) => ({ goal: g, progress: goalProgress(g, logs, today) }))
  const sections = [
    { id: 'daily', title: 'Daily goals', hint: 'Count the time you log today. They start again at midnight.' },
    { id: 'weekly', title: 'Weekly goals', hint: 'Count Monday to Sunday. “On track” means you’re at or ahead of the pace the week needs.' },
  ]

  if (!goals.length) {
    return (
      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface-2 text-ink">
          <Target size={20} />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Set your first goal</h2>
        <p className="mt-1 max-w-prose text-sm text-ink-2">
          A goal measures the time you log against a daily or weekly target, for one category or for all activities. Your goals also appear on the
          dashboard.
        </p>
        <button onClick={onAdd} className="mt-5 flex items-center gap-1.5 rounded-lg bg-btn px-3.5 py-2 text-sm font-semibold text-btn-ink transition hover:opacity-90">
          <Plus size={16} strokeWidth={2.5} /> New goal
        </button>
        <div className="mt-8 border-t border-line pt-6">
          <p className="text-xs font-semibold tracking-wide text-ink-3 uppercase">Or start with one of these</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.title}
                onClick={() => onCreate(s)}
                className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-ink-2 transition hover:border-line-strong hover:text-ink"
              >
                <Plus size={14} /> {s.title}
              </button>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="space-y-8">
      {sections.map((sec) => {
        const items = rows.filter((r) => r.goal.period === sec.id)
        return (
          <section key={sec.id} aria-labelledby={`goals-${sec.id}`}>
            <div className="mb-3">
              <h2 id={`goals-${sec.id}`} className="text-base font-semibold">
                {sec.title} <span className="font-normal text-ink-3 tabular">· {items.length}</span>
              </h2>
              <p className="text-sm text-ink-3">{sec.hint}</p>
            </div>
            {items.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map(({ goal, progress }) => (
                  <GoalCard key={goal.id} goal={goal} progress={progress} onEdit={onEdit} onDelete={onDelete} />
                ))}
              </div>
            ) : (
              <button
                onClick={onAdd}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-line-strong bg-surface py-6 text-sm text-ink-3 transition hover:text-ink"
              >
                <Plus size={15} /> Add a {sec.id} goal
              </button>
            )}
          </section>
        )
      })}
    </div>
  )
}

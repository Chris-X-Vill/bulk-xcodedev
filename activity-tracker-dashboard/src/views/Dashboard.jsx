import { useMemo, useState } from 'react'
import { ArrowRight, BarChart3, Clock, Flame, Gauge, LineChart, Plus, Target } from 'lucide-react'
import ActivityChart from '../components/ActivityChart'
import ActivityRow from '../components/ActivityRow'
import GoalCard from '../components/GoalCard'
import KpiCard, { Delta } from '../components/KpiCard'
import { goalProgress } from '../lib/goals'
import { CATEGORIES, addDays, buildWeek, compareLogs, computeStreak, fmtDay, fmtDuration, longestStreak, toKey } from '../lib/utils'

export default function Dashboard({ logs, goals, today, weekStart, weekEnd, onEditLog, onDeleteLog, onAddGoal }) {
  const [chartMode, setChartMode] = useState('bar')
  const days = useMemo(() => buildWeek(logs, weekStart), [logs, weekStart])
  const prevDays = useMemo(() => buildWeek(logs, addDays(weekStart, -7)), [logs, weekStart])

  const total = days.reduce((s, d) => s + d.total, 0)
  const prevTotal = prevDays.reduce((s, d) => s + d.total, 0)
  const avg = total / 7
  const prevAvg = prevTotal / 7
  const streak = computeStreak(logs, today)
  const best = longestStreak(logs)
  const activeKeys = new Set(logs.map((l) => l.date))
  const last14 = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13))
  const byCategory = CATEGORIES.map((c) => ({ ...c, minutes: days.reduce((s, d) => s + d.byCat[c.id], 0) })).sort((a, b) => b.minutes - a.minutes)
  const recent = useMemo(() => [...logs].sort(compareLogs).slice(0, 6), [logs])
  const goalRows = goals.map((g) => ({ goal: g, progress: goalProgress(g, logs, today) }))
  const metCount = goalRows.filter((r) => r.progress.status === 'met').length

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard icon={Clock} label="Total Time" value={fmtDuration(total)} footer={<Delta value={prevTotal ? (total - prevTotal) / prevTotal : null} />} />
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
              return <span key={toKey(d)} title={`${fmtDay(d)}${on ? ' · active' : ' · no activity'}`} className={`h-2 flex-1 rounded-full ${on ? 'bg-s2' : 'bg-line'}`} />
            })}
          </div>
        </KpiCard>
      </div>

      {/* Goals */}
      <section aria-labelledby="dash-goals">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 id="dash-goals" className="text-base font-semibold">
              Goals
            </h2>
            <p className="text-sm text-ink-3">
              {goals.length ? `${metCount} of ${goals.length} met · daily goals count today, weekly goals count Mon–Sun` : 'Measure your time against daily and weekly targets'}
            </p>
          </div>
          {goals.length > 0 && (
            <a href="#goals" className="flex shrink-0 items-center gap-1 text-sm font-medium text-ink-2 transition hover:text-ink">
              Manage <ArrowRight size={14} />
            </a>
          )}
        </div>
        {goals.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {goalRows.map(({ goal, progress }) => (
              <GoalCard key={goal.id} goal={goal} progress={progress} compact />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-line-strong bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-ink">
                <Target size={17} />
              </span>
              <p className="text-sm text-ink-2">No goals yet. Set one, like 30 minutes of exercise a day, and track it here.</p>
            </div>
            <button
              onClick={onAddGoal}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink transition hover:bg-surface-2"
            >
              <Plus size={15} /> Add goal
            </button>
          </div>
        )}
      </section>

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
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${chartMode === id ? 'bg-surface-2 text-ink' : 'text-ink-3 hover:text-ink'}`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </header>
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
              <p className="mt-1 text-lg font-semibold tabular">{logs.filter((l) => l.date >= days[0].key && l.date <= days[6].key).length}</p>
            </div>
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="text-xs text-ink-3">Active days</p>
              <p className="mt-1 text-lg font-semibold tabular">
                {days.filter((d) => d.total > 0).length}
                <span className="text-sm font-normal text-ink-3"> / 7</span>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Recent activity */}
      <section className="rounded-2xl border border-line bg-surface">
        <header className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-base font-semibold">Recent activity</h2>
            <p className="text-sm text-ink-3">Your latest logs</p>
          </div>
          {logs.length > 0 && (
            <a href="#activities" className="flex items-center gap-1 text-sm font-medium text-ink-2 transition hover:text-ink">
              View all <ArrowRight size={14} />
            </a>
          )}
        </header>
        {recent.length ? (
          <ul className="divide-y divide-line">
            {recent.map((log) => (
              <ActivityRow key={log.id} log={log} onEdit={onEditLog} onDelete={onDeleteLog} showDate />
            ))}
          </ul>
        ) : (
          <p className="px-5 py-12 text-center text-sm text-ink-3">No logs yet. Tap Add Log to record your first activity.</p>
        )}
      </section>
    </div>
  )
}

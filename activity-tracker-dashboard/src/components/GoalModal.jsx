import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import Modal from './Modal'
import { PERIODS, defaultGoalTitle } from '../lib/goals'
import { CATEGORIES, categoryById, fmtDuration } from '../lib/utils'

const PRESETS = { daily: [15, 30, 60, 120], weekly: [120, 300, 600, 1200] }
const MAX = { daily: 24 * 60, weekly: 7 * 24 * 60 }

function toForm(goal) {
  if (!goal) return { title: '', category: 'all', period: 'daily', hours: '0', minutes: '30' }
  return {
    title: goal.title,
    category: goal.category,
    period: goal.period,
    hours: String(Math.floor(goal.target / 60)),
    minutes: String(goal.target % 60),
  }
}

export default function GoalModal({ open, goal, onClose, onSave }) {
  const [form, setForm] = useState(() => toForm(goal))
  const [error, setError] = useState('')
  const firstField = useRef(null)
  const isEdit = Boolean(goal?.id)

  useEffect(() => {
    if (!open) return
    setForm(toForm(goal))
    setError('')
    const t = setTimeout(() => firstField.current?.focus(), 30)
    return () => clearTimeout(t)
  }, [open, goal])

  const target = (Number(form.hours) || 0) * 60 + (Number(form.minutes) || 0)
  const autoTitle = defaultGoalTitle({ ...form, target: target || 30 }, categoryById[form.category]?.label)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (target <= 0) return setError('Set a target of at least 1 minute.')
    if (target > MAX[form.period]) {
      return setError(form.period === 'daily' ? 'A daily target can’t exceed 24 hours.' : 'A weekly target can’t exceed 168 hours.')
    }
    onSave({
      ...(goal ?? {}),
      title: form.title.trim() || defaultGoalTitle({ ...form, target }, categoryById[form.category]?.label),
      category: form.category,
      period: form.period,
      target,
    })
  }

  const input =
    'w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-3 outline-none transition focus:border-ink-3 focus:ring-4 focus:ring-ink/5'

  return (
    <Modal open={open} onClose={onClose} labelledBy="goal-modal-title">
      <form onSubmit={submit}>
        <header className="flex items-start justify-between border-b border-line px-6 py-5">
          <div>
            <h2 id="goal-modal-title" className="text-lg font-semibold text-ink">
              {isEdit ? 'Edit goal' : 'New goal'}
            </h2>
            <p className="mt-0.5 text-sm text-ink-3">Set a target for the time you log each day or week.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-ink-3 transition hover:bg-surface-2 hover:text-ink" aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className="space-y-5 px-6 py-5">
          <label className="block" htmlFor="goal-title">
            <span className="mb-1.5 flex justify-between text-sm font-medium text-ink">
              Name <span className="font-normal text-ink-3">Optional</span>
            </span>
            <input id="goal-title" ref={firstField} value={form.title} onChange={set('title')} placeholder={autoTitle} className={input} />
          </label>

          <fieldset>
            <legend className="mb-1.5 text-sm font-medium text-ink">Counts time from</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[{ id: 'all', label: 'All activities' }, ...CATEGORIES].map((c) => {
                const active = form.category === c.id
                return (
                  <button
                    type="button"
                    key={c.id}
                    aria-pressed={active}
                    onClick={() => setForm((f) => ({ ...f, category: c.id }))}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-2 py-2 text-xs font-medium transition ${
                      active ? 'border-ink bg-surface-2 text-ink' : 'border-line text-ink-2 hover:border-line-strong'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${c.dot ?? 'border border-ink-3'}`} />
                    {c.label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 text-sm font-medium text-ink">Period</legend>
            <div className="grid grid-cols-2 gap-1 rounded-lg border border-line p-1">
              {PERIODS.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  aria-pressed={form.period === p.id}
                  onClick={() => setForm((f) => ({ ...f, period: p.id }))}
                  className={`rounded-md py-1.5 text-sm font-medium transition ${form.period === p.id ? 'bg-surface-2 text-ink' : 'text-ink-3 hover:text-ink'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-ink-3">
              {form.period === 'daily' ? 'Measured each day, from midnight.' : 'Measured each week, Monday to Sunday.'}
            </p>
          </fieldset>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink">Target</span>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  id="goal-hours"
                  type="number"
                  min="0"
                  max={MAX[form.period] / 60}
                  value={form.hours}
                  onChange={set('hours')}
                  aria-label="Target hours"
                  className={`${input} w-20 pr-7 tabular ${error ? 'border-bad' : ''}`}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-ink-3">h</span>
              </div>
              <div className="relative">
                <input
                  id="goal-minutes"
                  type="number"
                  min="0"
                  max="59"
                  step="5"
                  value={form.minutes}
                  onChange={set('minutes')}
                  aria-label="Target minutes"
                  className={`${input} w-20 pr-7 tabular ${error ? 'border-bad' : ''}`}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-ink-3">m</span>
              </div>
              <span className="text-sm text-ink-3">{PERIODS.find((p) => p.id === form.period).unit}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {PRESETS[form.period].map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => setForm((f) => ({ ...f, hours: String(Math.floor(q / 60)), minutes: String(q % 60) }))}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition tabular ${
                    target === q ? 'border-ink bg-ink text-canvas' : 'border-line text-ink-2 hover:border-line-strong'
                  }`}
                >
                  {fmtDuration(q)}
                </button>
              ))}
            </div>
            {error && <p className="mt-1.5 text-xs text-bad">{error}</p>}
          </div>
        </div>

        <footer className="flex justify-end gap-2 border-t border-line px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface-2">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-btn px-4 py-2 text-sm font-semibold text-btn-ink transition hover:opacity-90">
            {isEdit ? 'Save changes' : 'Create goal'}
          </button>
        </footer>
      </form>
    </Modal>
  )
}

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES, toKey } from '../lib/utils'

const QUICK = [15, 30, 45, 60, 90, 120]

function emptyForm() {
  return { title: '', category: 'work', date: toKey(new Date()), hours: '0', minutes: '30', notes: '' }
}

function fromEntry(entry) {
  return {
    title: entry.title,
    category: entry.category,
    date: entry.date,
    hours: String(Math.floor(entry.minutes / 60)),
    minutes: String(entry.minutes % 60),
    notes: entry.notes ?? '',
  }
}

export default function LogModal({ open, entry, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const firstField = useRef(null)
  const isEdit = Boolean(entry)

  useEffect(() => {
    if (!open) return
    setForm(entry ? fromEntry(entry) : emptyForm())
    setErrors({})
    const t = setTimeout(() => firstField.current?.focus(), 30)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, entry, onClose])

  if (!open) return null

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const totalMinutes = (Number(form.hours) || 0) * 60 + (Number(form.minutes) || 0)

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.title.trim()) next.title = 'Give this activity a name.'
    if (!form.date) next.date = 'Pick a date.'
    if (totalMinutes <= 0) next.duration = 'Duration must be more than 0 minutes.'
    if (totalMinutes > 24 * 60) next.duration = 'Duration can’t exceed 24 hours.'
    setErrors(next)
    if (Object.keys(next).length) return
    onSave({
      ...(entry ?? {}),
      title: form.title.trim(),
      category: form.category,
      date: form.date,
      minutes: totalMinutes,
      notes: form.notes.trim(),
    })
  }

  const input =
    'w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-3 outline-none transition focus:border-ink-3 focus:ring-4 focus:ring-ink/5'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="animate-fade-in absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="log-modal-title"
        className="animate-pop-in relative w-full max-w-lg rounded-2xl border border-line bg-surface shadow-2xl shadow-black/20"
      >
        <header className="flex items-start justify-between border-b border-line px-6 py-5">
          <div>
            <h2 id="log-modal-title" className="text-lg font-semibold text-ink">
              {isEdit ? 'Edit log' : 'Add a log'}
            </h2>
            <p className="mt-0.5 text-sm text-ink-3">
              {isEdit ? 'Update the details of this entry.' : 'Record time spent on an activity.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-3 transition hover:bg-surface-2 hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-5 px-6 py-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Activity</span>
            <input
              ref={firstField}
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Morning run"
              className={`${input} ${errors.title ? 'border-bad' : ''}`}
            />
            {errors.title && <span className="mt-1 block text-xs text-bad">{errors.title}</span>}
          </label>

          <fieldset>
            <legend className="mb-1.5 text-sm font-medium text-ink">Category</legend>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((c) => {
                const active = form.category === c.id
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setForm((f) => ({ ...f, category: c.id }))}
                    aria-pressed={active}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-2 py-2 text-xs font-medium transition ${
                      active ? 'border-ink bg-surface-2 text-ink' : 'border-line text-ink-2 hover:border-line-strong'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                    {c.label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="grid grid-cols-[1fr_auto] gap-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">Date</span>
              <input type="date" value={form.date} onChange={set('date')} max={toKey(new Date())} className={input} />
              {errors.date && <span className="mt-1 block text-xs text-bad">{errors.date}</span>}
            </label>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-ink">Duration</span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={form.hours}
                    onChange={set('hours')}
                    aria-label="Hours"
                    className={`${input} w-20 pr-7 tabular ${errors.duration ? 'border-bad' : ''}`}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-ink-3">h</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    step="5"
                    value={form.minutes}
                    onChange={set('minutes')}
                    aria-label="Minutes"
                    className={`${input} w-20 pr-7 tabular ${errors.duration ? 'border-bad' : ''}`}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-ink-3">m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="-mt-2 flex flex-wrap items-center gap-1.5">
            {QUICK.map((q) => (
              <button
                type="button"
                key={q}
                onClick={() => setForm((f) => ({ ...f, hours: String(Math.floor(q / 60)), minutes: String(q % 60) }))}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition tabular ${
                  totalMinutes === q ? 'border-ink bg-ink text-canvas' : 'border-line text-ink-2 hover:border-line-strong'
                }`}
              >
                {q < 60 ? `${q}m` : `${q / 60}h`}
              </button>
            ))}
            {errors.duration && <span className="ml-1 text-xs text-bad">{errors.duration}</span>}
          </div>

          <label className="block">
            <span className="mb-1.5 flex justify-between text-sm font-medium text-ink">
              Notes <span className="font-normal text-ink-3">Optional</span>
            </span>
            <textarea rows={3} value={form.notes} onChange={set('notes')} placeholder="How did it go?" className={`${input} resize-none`} />
          </label>
        </div>

        <footer className="flex justify-end gap-2 border-t border-line px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface-2"
          >
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-btn px-4 py-2 text-sm font-semibold text-btn-ink transition hover:opacity-90">
            {isEdit ? 'Save changes' : 'Add log'}
          </button>
        </footer>
      </form>
    </div>
  )
}

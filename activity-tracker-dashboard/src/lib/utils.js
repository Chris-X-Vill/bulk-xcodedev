export const CATEGORIES = [
  { id: 'work', label: 'Deep Work', varName: '--series-1', dot: 'bg-s1' },
  { id: 'exercise', label: 'Exercise', varName: '--series-2', dot: 'bg-s2' },
  { id: 'learning', label: 'Learning', varName: '--series-3', dot: 'bg-s3' },
  { id: 'wellness', label: 'Wellness', varName: '--series-4', dot: 'bg-s4' },
]

export const categoryById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

/** Local-date key "YYYY-MM-DD" (avoids UTC shifts from toISOString). */
export function toKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date, n) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  d.setDate(d.getDate() + n)
  return d
}

/** Monday-based week start. */
export function startOfWeek(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return addDays(d, -((d.getDay() + 6) % 7))
}

export function fmtDuration(mins) {
  const total = Math.round(mins)
  const h = Math.floor(total / 60)
  const m = total % 60
  if (!h) return `${m}m`
  return m ? `${h}h ${m}m` : `${h}h`
}

const dayFmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
const longFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short' })

export const fmtDay = (d) => dayFmt.format(d)
export const fmtLong = (d) => longFmt.format(d)
export const fmtWeekday = (d) => weekdayFmt.format(d)

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

/** Sum minutes per day/category for a week starting at `weekStart`. */
export function buildWeek(logs, weekStart) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    const byCat = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0]))
    return { key: toKey(date), date, byCat, total: 0 }
  })
  const index = Object.fromEntries(days.map((d, i) => [d.key, i]))
  for (const log of logs) {
    const i = index[log.date]
    if (i === undefined) continue
    days[i].byCat[log.category] += log.minutes
    days[i].total += log.minutes
  }
  return days
}

/** Consecutive days with at least one log, ending today (or yesterday if today is still empty). */
export function computeStreak(logs, today) {
  const active = new Set(logs.map((l) => l.date))
  let cursor = active.has(toKey(today)) ? today : addDays(today, -1)
  let streak = 0
  while (active.has(toKey(cursor))) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function longestStreak(logs) {
  const keys = [...new Set(logs.map((l) => l.date))].sort()
  let best = 0
  let run = 0
  let prev = null
  for (const k of keys) {
    const d = fromKey(k)
    run = prev && toKey(addDays(prev, 1)) === k ? run + 1 : 1
    best = Math.max(best, run)
    prev = d
  }
  return best
}

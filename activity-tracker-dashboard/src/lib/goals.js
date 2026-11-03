import { addDays, fmtDay, fmtDuration, fmtLong, fmtNarrowWeekday, startOfWeek, toKey } from './utils'

export const PERIODS = [
  { id: 'daily', label: 'Daily', unit: 'a day' },
  { id: 'weekly', label: 'Weekly', unit: 'a week' },
]

export const STATUS = {
  met: { label: 'Goal met', tone: 'good' },
  ontrack: { label: 'On track', tone: 'good' },
  behind: { label: 'Behind pace', tone: 'warn' },
  progress: { label: 'In progress', tone: 'neutral' },
  notstarted: { label: 'Not started', tone: 'neutral' },
}

export function sumMinutes(logs, category, from, to) {
  let total = 0
  for (const l of logs) {
    if (l.date >= from && l.date <= to && (category === 'all' || l.category === category)) total += l.minutes
  }
  return total
}

/**
 * Progress for one goal.
 * Daily goals measure today; weekly goals measure the current Monday–Sunday week,
 * with "on track" meaning at least the share of the target that the days so far call for.
 */
export function goalProgress(goal, logs, today) {
  const target = goal.target

  if (goal.period === 'daily') {
    const key = toKey(today)
    const done = sumMinutes(logs, goal.category, key, key)
    const history = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(today, i - 6)
      const k = toKey(d)
      const m = sumMinutes(logs, goal.category, k, k)
      return {
        key: k,
        label: fmtNarrowWeekday(d),
        title: `${fmtLong(d)}: ${fmtDuration(m)} of ${fmtDuration(target)}`,
        ratio: Math.min(1, m / target),
        met: m >= target,
        current: i === 6,
      }
    })
    return {
      done,
      target,
      ratio: done / target,
      status: done >= target ? 'met' : done > 0 ? 'progress' : 'notstarted',
      periodLabel: 'Today',
      history,
      historyLabel: `Met on ${history.filter((h) => h.met).length} of the last 7 days`,
    }
  }

  const weekStart = startOfWeek(today)
  const done = sumMinutes(logs, goal.category, toKey(weekStart), toKey(addDays(weekStart, 6)))
  const dayIndex = Math.round((new Date(today.getFullYear(), today.getMonth(), today.getDate()) - weekStart) / 86400000)
  const daysLeft = 6 - dayIndex
  const expected = (target * (dayIndex + 1)) / 7
  const history = Array.from({ length: 4 }, (_, i) => {
    const start = addDays(weekStart, (i - 3) * 7)
    const m = sumMinutes(logs, goal.category, toKey(start), toKey(addDays(start, 6)))
    return {
      key: toKey(start),
      label: fmtDay(start),
      title: `Week of ${fmtDay(start)}: ${fmtDuration(m)} of ${fmtDuration(target)}`,
      ratio: Math.min(1, m / target),
      met: m >= target,
      current: i === 3,
    }
  })
  return {
    done,
    target,
    ratio: done / target,
    status: done >= target ? 'met' : done >= expected ? 'ontrack' : 'behind',
    periodLabel: daysLeft === 0 ? 'This week · last day' : `This week · ${daysLeft} day${daysLeft === 1 ? '' : 's'} left`,
    history,
    historyLabel: `Met in ${history.filter((h) => h.met).length} of the last 4 weeks`,
  }
}

export function defaultGoalTitle({ category, period, target }, categoryLabel) {
  const unit = PERIODS.find((p) => p.id === period)?.unit ?? ''
  return `${fmtDuration(target)} of ${category === 'all' ? 'activity' : categoryLabel} ${unit}`
}

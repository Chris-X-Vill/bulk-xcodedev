import { CATEGORIES, toKey, uid } from './utils'

const APP_ID = 'daily-activity-tracker'
const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id))
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function buildBackup({ logs, goals, theme }) {
  return {
    app: APP_ID,
    version: 1,
    exportedAt: new Date().toISOString(),
    data: { logs, goals, settings: { theme } },
  }
}

/**
 * Save the backup file. On phones, offer the share sheet (so it can go to Files, iCloud Drive or mail);
 * elsewhere, download it.
 */
export async function saveBackupFile(backup) {
  const name = `activity-tracker-backup-${toKey(new Date())}.json`
  const file = new File([JSON.stringify(backup, null, 2)], name, { type: 'application/json' })
  const touch = window.matchMedia?.('(pointer: coarse)').matches
  if (touch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Activity Tracker backup' })
      return 'shared'
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled'
      /* fall through to a download */
    }
  }
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
  return 'downloaded'
}

function cleanLog(l) {
  if (!l || typeof l !== 'object') return null
  const minutes = Math.round(Number(l.minutes))
  if (!DATE_RE.test(l.date ?? '') || !CATEGORY_IDS.has(l.category)) return null
  if (!(minutes > 0 && minutes <= 1440) || typeof l.title !== 'string' || !l.title.trim()) return null
  return {
    id: typeof l.id === 'string' && l.id ? l.id : uid(),
    date: l.date,
    category: l.category,
    title: l.title.trim().slice(0, 200),
    minutes,
    notes: typeof l.notes === 'string' ? l.notes.slice(0, 1000) : '',
  }
}

function cleanGoal(g) {
  if (!g || typeof g !== 'object') return null
  const target = Math.round(Number(g.target))
  if (!['daily', 'weekly'].includes(g.period)) return null
  if (g.category !== 'all' && !CATEGORY_IDS.has(g.category)) return null
  if (!(target > 0 && target <= (g.period === 'daily' ? 1440 : 10080))) return null
  return {
    id: typeof g.id === 'string' && g.id ? g.id : uid(),
    title: typeof g.title === 'string' ? g.title.trim().slice(0, 120) : '',
    category: g.category,
    period: g.period,
    target,
  }
}

/** Parse and validate a backup file's text. Throws an Error with a readable message when it can't be used. */
export function parseBackup(text) {
  let json
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error('This file isn’t valid JSON. Choose a backup exported from this app.')
  }
  const data = json?.app === APP_ID ? json.data : Array.isArray(json) ? { logs: json } : null
  if (!data || !Array.isArray(data.logs ?? [])) {
    throw new Error('This file isn’t a Daily Activity Tracker backup.')
  }
  const rawLogs = data.logs ?? []
  const rawGoals = Array.isArray(data.goals) ? data.goals : []
  const logs = rawLogs.map(cleanLog).filter(Boolean)
  const goals = rawGoals.map(cleanGoal).filter(Boolean)
  const theme = ['light', 'dark', 'system'].includes(data.settings?.theme) ? data.settings.theme : null
  return {
    logs,
    goals,
    theme,
    exportedAt: json.exportedAt ? new Date(json.exportedAt) : null,
    skipped: rawLogs.length - logs.length + (rawGoals.length - goals.length),
  }
}

/** Add imported items whose ids aren't already present. */
export function mergeById(current, incoming) {
  const ids = new Set(current.map((x) => x.id))
  return [...current, ...incoming.filter((x) => !ids.has(x.id))]
}

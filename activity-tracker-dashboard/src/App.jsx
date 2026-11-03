import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Moon, Plus, Sun, Upload } from 'lucide-react'
import ConfirmDialog from './components/ConfirmDialog'
import GoalModal from './components/GoalModal'
import LogModal from './components/LogModal'
import { BottomNav, ROUTES, Sidebar } from './components/Nav'
import { buildBackup, mergeById, parseBackup, saveBackupFile } from './lib/backup'
import { makeSeed } from './lib/seed'
import { KEYS, usePersistentState } from './lib/storage'
import { addDays, fmtDay, fmtStamp, toKey, uid } from './lib/utils'
import Activities from './views/Activities'
import CalendarView from './views/CalendarView'
import Dashboard from './views/Dashboard'
import Goals from './views/Goals'
import Settings from './views/Settings'

const ROUTE_IDS = ROUTES.map((r) => r.id)
const readRoute = () => {
  const id = window.location.hash.slice(1)
  return ROUTE_IDS.includes(id) ? id : 'dashboard'
}

function useRoute() {
  const [route, setRoute] = useState(readRoute)
  useEffect(() => {
    const onHash = () => {
      setRoute(readRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

/** Today's date, refreshed when the app comes back to the foreground on a new day (installed apps stay in memory). */
function useToday() {
  const [today, setToday] = useState(() => new Date())
  useEffect(() => {
    const check = () => setToday((prev) => (toKey(prev) === toKey(new Date()) ? prev : new Date()))
    const id = setInterval(check, 60_000)
    document.addEventListener('visibilitychange', check)
    window.addEventListener('focus', check)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', check)
      window.removeEventListener('focus', check)
    }
  }, [])
  return today
}

const prefersDark = () => Boolean(window.matchMedia?.('(prefers-color-scheme: dark)').matches)

/** Theme preference: 'light' | 'dark' | 'system'. Returns the preference and whether dark is showing. */
function useTheme() {
  const [theme, setTheme] = usePersistentState(KEYS.theme, () => 'system')
  const [systemDark, setSystemDark] = useState(prefersDark)
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!media) return
    const onChange = () => setSystemDark(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  const dark = theme === 'system' ? systemDark : theme === 'dark'
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])
  return [theme, setTheme, dark]
}

const PAGE_TITLES = {
  activities: ['Activities', 'Everything you’ve logged. Add, edit or delete any entry.'],
  goals: ['Goals', 'Daily and weekly targets for the time you log.'],
  calendar: ['Calendar', 'Your activities by day. Tap a day to see or add its logs.'],
  settings: ['Settings', 'Backup, app icon, appearance and data.'],
}

const primaryBtn =
  'flex items-center gap-1.5 rounded-lg bg-btn px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-btn-ink transition hover:opacity-90'

export default function App() {
  const route = useRoute()
  const today = useToday()
  const [theme, setTheme, dark] = useTheme()
  const [logs, setLogs] = usePersistentState(KEYS.logs, () => makeSeed())
  const [goals, setGoals] = usePersistentState(KEYS.goals, () => [])
  const [lastBackup, setLastBackup] = usePersistentState(KEYS.lastBackup, () => null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [logModal, setLogModal] = useState({ open: false, entry: null })
  const [goalModal, setGoalModal] = useState({ open: false, goal: null })
  const [dialog, setDialog] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  // Rolling 7-day windows ending today, so comparisons are always like-for-like (never a partial week).
  const todayKey = toKey(today)
  const weekEnd = useMemo(() => addDays(today, weekOffset * 7), [todayKey, weekOffset]) // eslint-disable-line react-hooks/exhaustive-deps
  const weekStart = useMemo(() => addDays(weekEnd, -6), [weekEnd])

  const closeLog = useCallback(() => setLogModal({ open: false, entry: null }), [])
  const closeGoal = useCallback(() => setGoalModal({ open: false, goal: null }), [])
  const closeDialog = useCallback(() => setDialog(null), [])
  // A date string pre-fills the form (used by the calendar); anything else opens a blank form.
  const openAddLog = (date) => setLogModal({ open: true, entry: typeof date === 'string' ? { date } : null })
  const openEditLog = (entry) => setLogModal({ open: true, entry })
  const openAddGoal = () => setGoalModal({ open: true, goal: null })
  const openEditGoal = (goal) => setGoalModal({ open: true, goal })

  // Logs
  const saveLog = (entry) => {
    setLogs((prev) => (entry.id ? prev.map((l) => (l.id === entry.id ? entry : l)) : [...prev, { ...entry, id: uid() }]))
    setToast({ message: entry.id ? 'Log updated' : 'Log added' })
    closeLog()
  }
  const deleteLog = (entry) => {
    setLogs((prev) => prev.filter((l) => l.id !== entry.id))
    setToast({ message: `Deleted “${entry.title}”`, onUndo: () => setLogs((prev) => [...prev, entry]) })
  }

  // Goals
  const saveGoal = (goal) => {
    setGoals((prev) => (goal.id ? prev.map((g) => (g.id === goal.id ? goal : g)) : [...prev, { ...goal, id: uid() }]))
    setToast({ message: goal.id ? 'Goal updated' : 'Goal created' })
    closeGoal()
  }
  const createGoal = (goal) => {
    setGoals((prev) => [...prev, { ...goal, id: uid() }])
    setToast({ message: `Goal created: ${goal.title}` })
  }
  const deleteGoal = (goal) => {
    setGoals((prev) => prev.filter((g) => g.id !== goal.id))
    setToast({ message: `Deleted goal “${goal.title}”`, onUndo: () => setGoals((prev) => [...prev, goal]) })
  }

  // Data
  const askReset = () =>
    setDialog({
      title: 'Reset all activity data?',
      body: `This deletes all ${logs.length} logs and sets every total, average and streak back to zero. Your goals and settings are kept.`,
      actions: [
        {
          label: 'Delete all logs',
          onClick: () => {
            const previous = logs
            setLogs([])
            setWeekOffset(0)
            setDialog(null)
            setToast({ message: `Deleted all ${previous.length} logs`, onUndo: () => setLogs(previous) })
          },
        },
      ],
    })

  const exportBackup = async () => {
    const result = await saveBackupFile(buildBackup({ logs, goals, theme }))
    if (result === 'cancelled') return
    setLastBackup(new Date().toISOString())
    setToast({ message: result === 'shared' ? 'Backup ready to save' : 'Backup downloaded' })
  }

  const importBackup = async (file) => {
    let parsed
    try {
      parsed = parseBackup(await file.text())
    } catch (err) {
      setDialog({ title: 'Can’t import this file', body: err.message, actions: [] })
      return
    }
    const apply = (mode) => {
      const prevLogs = logs
      const prevGoals = goals
      if (mode === 'replace') {
        setLogs(parsed.logs)
        setGoals(parsed.goals)
        if (parsed.theme) setTheme(parsed.theme)
      } else {
        setLogs((cur) => mergeById(cur, parsed.logs))
        setGoals((cur) => mergeById(cur, parsed.goals))
      }
      setDialog(null)
      setToast({
        message: mode === 'replace' ? 'Backup restored' : 'Backup merged',
        onUndo: () => {
          setLogs(prevLogs)
          setGoals(prevGoals)
        },
      })
    }
    setDialog({
      icon: Upload,
      tone: 'neutral',
      title: 'Import this backup?',
      body: (
        <div className="space-y-2">
          <p>
            {parsed.exportedAt ? `Exported ${fmtStamp(parsed.exportedAt)}. ` : ''}It has {parsed.logs.length} logs and {parsed.goals.length} goals.
            {parsed.skipped ? ` ${parsed.skipped} invalid entries will be skipped.` : ''}
          </p>
          <p>
            <strong className="font-semibold text-ink">Replace</strong> swaps your current {logs.length} logs and {goals.length} goals for the backup.{' '}
            <strong className="font-semibold text-ink">Merge</strong> adds only entries you don’t already have.
          </p>
        </div>
      ),
      actions: [
        { label: 'Merge', tone: 'secondary', onClick: () => apply('merge') },
        { label: 'Replace', tone: 'primary', onClick: () => apply('replace') },
      ],
    })
  }

  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening'
  const [title, subtitle] = route === 'dashboard' ? ['Daily Activity Tracker', greeting] : PAGE_TITLES[route]

  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      <Sidebar route={route} />

      <main className="min-w-0 flex-1 px-4 pt-6 pb-28 sm:px-8 lg:px-10 lg:pb-8">
        <div className="mx-auto max-w-[1280px] space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              {route === 'dashboard' && <p className="text-sm text-ink-3">{subtitle}</p>}
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {route !== 'dashboard' && <p className="mt-0.5 text-sm text-ink-3">{subtitle}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {route === 'dashboard' && (
                <div className="flex items-center rounded-lg border border-line bg-surface">
                  <button onClick={() => setWeekOffset((w) => w - 1)} className="p-2 text-ink-2 transition hover:text-ink" aria-label="Previous 7 days">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="min-w-36 text-center text-sm font-medium tabular">
                    {weekOffset === 0 ? 'Last 7 days' : `${fmtDay(weekStart)} – ${fmtDay(weekEnd)}`}
                  </span>
                  <button
                    onClick={() => setWeekOffset((w) => Math.min(0, w + 1))}
                    disabled={weekOffset === 0}
                    className="p-2 text-ink-2 transition hover:text-ink disabled:opacity-30"
                    aria-label="Next 7 days"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
              <button
                onClick={() => setTheme(dark ? 'light' : 'dark')}
                className="rounded-lg border border-line bg-surface p-2 text-ink-2 transition hover:text-ink"
                aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              {route === 'goals' ? (
                <button onClick={openAddGoal} className={primaryBtn}>
                  <Plus size={16} strokeWidth={2.5} /> New goal
                </button>
              ) : (
                <button onClick={() => openAddLog()} className={primaryBtn}>
                  <Plus size={16} strokeWidth={2.5} /> Add Log
                </button>
              )}
            </div>
          </header>

          {route === 'dashboard' && (
            <Dashboard
              logs={logs}
              goals={goals}
              today={today}
              weekStart={weekStart}
              weekEnd={weekEnd}
              onEditLog={openEditLog}
              onDeleteLog={deleteLog}
              onAddGoal={openAddGoal}
            />
          )}
          {route === 'activities' && <Activities logs={logs} onAdd={() => openAddLog()} onEdit={openEditLog} onDelete={deleteLog} />}
          {route === 'goals' && (
            <Goals goals={goals} logs={logs} today={today} onAdd={openAddGoal} onCreate={createGoal} onEdit={openEditGoal} onDelete={deleteGoal} />
          )}
          {route === 'calendar' && <CalendarView logs={logs} today={today} onAdd={openAddLog} onEdit={openEditLog} onDelete={deleteLog} />}
          {route === 'settings' && (
            <Settings
              theme={theme}
              onThemeChange={setTheme}
              logs={logs}
              goals={goals}
              lastBackup={lastBackup}
              onExport={exportBackup}
              onImportFile={importBackup}
              onReset={askReset}
            />
          )}
        </div>
      </main>

      <BottomNav route={route} />

      <LogModal open={logModal.open} entry={logModal.entry} onClose={closeLog} onSave={saveLog} />
      <GoalModal open={goalModal.open} goal={goalModal.goal} onClose={closeGoal} onSave={saveGoal} />
      <ConfirmDialog dialog={dialog} onClose={closeDialog} />

      {toast && (
        <div
          role="status"
          className="animate-pop-in fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-4 rounded-xl bg-btn px-4 py-3 text-sm text-btn-ink shadow-xl lg:bottom-6"
        >
          <span className="truncate">{toast.message}</span>
          {toast.onUndo && (
            <button
              onClick={() => {
                toast.onUndo()
                setToast(null)
              }}
              className="shrink-0 font-semibold underline underline-offset-2"
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  )
}

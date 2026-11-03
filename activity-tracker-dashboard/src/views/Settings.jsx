import { useRef, useState } from 'react'
import { Download, Monitor, Moon, RotateCcw, Sun, Upload } from 'lucide-react'
import { fmtStamp } from '../lib/utils'

function Card({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="mt-0.5 max-w-prose text-sm text-ink-3">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

const ICON_SRC = `${import.meta.env.BASE_URL}icons/icon-192.png`

export default function Settings({ theme, onThemeChange, logs, goals, lastBackup, onExport, onImportFile, onReset }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)

  const exportNow = async () => {
    setBusy(true)
    try {
      await onExport()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
      <Card title="Backup" description="Your logs and goals are stored only on this device. Export a backup file to keep a copy, or to move your data to another device.">
        <dl className="grid grid-cols-3 gap-3">
          {[
            ['Logs', logs.length],
            ['Goals', goals.length],
            ['Last backup', lastBackup ? fmtStamp(new Date(lastBackup)) : 'Never'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-surface-2 p-3">
              <dt className="text-xs text-ink-3">{k}</dt>
              <dd className={`mt-1 font-semibold tabular ${typeof v === 'number' ? 'text-lg' : 'text-xs leading-5'}`}>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={exportNow}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg bg-btn px-3.5 py-2 text-sm font-semibold text-btn-ink transition hover:opacity-90 disabled:opacity-50"
          >
            <Download size={15} /> Export backup
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-medium text-ink transition hover:bg-surface-2"
          >
            <Upload size={15} /> Import backup
          </button>
          <input
            ref={fileRef}
            id="import-file"
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (file) onImportFile(file)
            }}
          />
        </div>
        <p className="mt-3 text-xs text-ink-3">On iPhone, Export opens the share sheet. Choose Save to Files to keep the backup in iCloud Drive or on the phone.</p>
      </Card>

      <Card title="App icon" description="Choose the icon shown on your Home Screen.">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <img src={ICON_SRC} alt="Current app icon" width="64" height="64" className="h-16 w-16 rounded-[14px] ring-2 ring-ink ring-offset-2 ring-offset-surface" />
            <span className="text-xs font-medium text-ink">Current</span>
          </div>
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex flex-col items-center gap-1.5" aria-hidden>
              <div className="h-16 w-16 rounded-[14px] border border-dashed border-line-strong bg-surface-2" />
              <span className="text-xs text-ink-3">Soon</span>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-lg bg-surface-2 px-3 py-2 text-xs text-ink-2">More icons are coming in a future update.</p>
      </Card>

      <Card title="Appearance">
        <div className="grid grid-cols-3 gap-1 rounded-lg border border-line p-1" role="radiogroup" aria-label="Theme">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Monitor },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="radio"
              aria-checked={theme === id}
              onClick={() => onThemeChange(id)}
              className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${theme === id ? 'bg-surface-2 text-ink' : 'text-ink-3 hover:text-ink'}`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-3">System follows your phone or computer’s light and dark setting.</p>
      </Card>

      <Card title="Reset data" description="Delete every activity log so totals, averages and streaks go back to zero. Your goals and settings are kept.">
        <button
          onClick={onReset}
          disabled={!logs.length}
          className="flex items-center gap-1.5 rounded-lg border border-bad/40 px-3.5 py-2 text-sm font-medium text-bad transition hover:bg-bad/10 disabled:opacity-40"
        >
          <RotateCcw size={15} /> Reset activity data
        </button>
      </Card>
    </div>
  )
}

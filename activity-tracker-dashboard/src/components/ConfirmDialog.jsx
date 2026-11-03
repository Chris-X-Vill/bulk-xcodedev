import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

/**
 * Confirmation step for destructive or bulk actions.
 * `actions` is a list of { label, onClick, tone: 'danger' | 'primary' | 'secondary' }.
 */
export default function ConfirmDialog({ dialog, onClose }) {
  const open = Boolean(dialog)
  const { title, body, actions = [], icon: Icon = AlertTriangle, tone = 'danger' } = dialog ?? {}
  const btn = {
    danger: 'bg-bad text-btn-ink hover:opacity-90',
    primary: 'bg-btn text-btn-ink hover:opacity-90',
    secondary: 'border border-line text-ink hover:bg-surface-2',
  }
  return (
    <Modal open={open} onClose={onClose} role="alertdialog" labelledBy="confirm-title" describedBy="confirm-body" className="max-w-sm p-6">
      <span className={`grid h-10 w-10 place-items-center rounded-full ${tone === 'danger' ? 'bg-bad/10 text-bad' : 'bg-surface-2 text-ink'}`}>
        <Icon size={18} />
      </span>
      <h2 id="confirm-title" className="mt-4 text-lg font-semibold text-ink">
        {title}
      </h2>
      <div id="confirm-body" className="mt-1 text-sm text-ink-2">
        {body}
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button
          autoFocus
          onClick={onClose}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface-2"
        >
          {actions.length ? 'Cancel' : 'OK'}
        </button>
        {actions.map((a) => (
          <button key={a.label} onClick={a.onClick} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${btn[a.tone ?? 'danger']}`}>
            {a.label}
          </button>
        ))}
      </div>
    </Modal>
  )
}

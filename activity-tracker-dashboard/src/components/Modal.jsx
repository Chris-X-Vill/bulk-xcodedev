import { useEffect } from 'react'

/** Centered dialog with a dimmed backdrop. Esc or a backdrop click calls onClose. */
export default function Modal({ open, onClose, labelledBy, describedBy, role = 'dialog', className = 'max-w-lg', children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="animate-fade-in absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={`animate-pop-in relative max-h-[calc(100dvh-2rem)] w-full overflow-y-auto rounded-2xl border border-line bg-surface shadow-2xl shadow-black/20 ${className}`}
      >
        {children}
      </div>
    </div>
  )
}

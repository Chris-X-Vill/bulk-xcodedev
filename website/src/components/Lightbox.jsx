import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

/** Full-screen image viewer. Esc closes; arrow keys move between images. */
export default function Lightbox({ items, index, onClose, onMove }) {
  useEffect(() => {
    if (index === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onMove(1)
      if (e.key === 'ArrowLeft') onMove(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [index, onClose, onMove])

  if (index === null) return null
  const item = items[index]
  const btn = 'grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.caption || 'Image'}
      className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-black/90 p-4 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
      onClick={onClose}
    >
      <div className="flex justify-end">
        <button onClick={onClose} className={btn} aria-label="Close">
          <X size={20} />
        </button>
      </div>
      <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
        <img src={item.image} alt={item.caption} className="max-h-full min-h-0 max-w-full rounded-lg object-contain" />
        {item.caption && <figcaption className="text-center text-sm text-white/80">{item.caption}</figcaption>}
      </figure>
      {items.length > 1 && (
        <div className="flex justify-center gap-3 pt-3" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onMove(-1)} className={btn} aria-label="Previous image">
            <ChevronLeft size={20} />
          </button>
          <span className="self-center text-sm text-white/70 tabular-nums">
            {index + 1} / {items.length}
          </span>
          <button onClick={() => onMove(1)} className={btn} aria-label="Next image">
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

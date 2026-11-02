import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

export function Delta({ value, suffix = 'vs previous 7 days' }) {
  if (value === null || !Number.isFinite(value)) {
    return <span className="text-xs text-ink-3">No data for previous 7 days</span>
  }
  const pct = Math.round(value * 100)
  const Icon = pct > 0 ? TrendingUp : pct < 0 ? TrendingDown : Minus
  const tone = pct > 0 ? 'text-good bg-good/10' : pct < 0 ? 'text-bad bg-bad/10' : 'text-ink-2 bg-surface-2'
  return (
    <span className="flex items-center gap-2 text-xs text-ink-3">
      <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold tabular ${tone}`}>
        <Icon size={12} strokeWidth={2.5} aria-hidden />
        {pct > 0 ? '+' : ''}
        {pct}%
      </span>
      {suffix}
    </span>
  )
}

export default function KpiCard({ icon: Icon, label, value, unit, footer, children }) {
  return (
    <section className="flex flex-col rounded-2xl border border-line bg-surface p-5">
      <header className="flex items-center gap-2 text-sm font-medium text-ink-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-surface-2 text-ink">
          <Icon size={15} aria-hidden />
        </span>
        {label}
      </header>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-[32px] leading-none font-semibold tracking-tight text-ink tabular">{value}</span>
        {unit && <span className="text-sm font-medium text-ink-3">{unit}</span>}
      </div>
      {children}
      <div className="mt-auto pt-4">{footer}</div>
    </section>
  )
}

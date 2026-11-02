import { useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORIES, fmtDuration, fmtLong, fmtWeekday, toKey } from '../lib/utils'

const HEIGHT = 280
const M = { top: 24, right: 12, bottom: 30, left: 44 }
const GAP = 2 // surface gap between stacked segments
const RADIUS = 4

function niceStep(max) {
  for (const step of [30, 60, 120, 180, 240, 360]) if (max / step <= 5) return step
  return 480
}

/** Rect with only the top corners rounded (the data end); square at the baseline. */
function topRoundedPath(x, y, w, h, r) {
  const rr = Math.min(r, h, w / 2)
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`
}

function useWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, width]
}

export default function ActivityChart({ days, prevDays, mode }) {
  const [ref, width] = useWidth()
  const [hover, setHover] = useState(null)
  const todayKey = toKey(new Date())

  const innerW = Math.max(0, width - M.left - M.right)
  const innerH = HEIGHT - M.top - M.bottom
  const rawMax = Math.max(60, ...days.map((d) => d.total), ...(mode === 'line' ? prevDays.map((d) => d.total) : []))
  const step = niceStep(rawMax)
  const yMax = Math.ceil(rawMax / step) * step
  const ticks = Array.from({ length: yMax / step + 1 }, (_, i) => i * step)
  const band = innerW / 7
  const barW = Math.min(40, band * 0.5)
  const y = (v) => M.top + innerH - (v / yMax) * innerH
  const cx = (i) => M.left + band * i + band / 2

  const peakIndex = useMemo(() => {
    let best = -1
    days.forEach((d, i) => {
      if (d.total > 0 && (best < 0 || d.total > days[best].total)) best = i
    })
    return best
  }, [days])

  const linePath = (series) =>
    series.map((d, i) => `${i ? 'L' : 'M'}${cx(i)},${y(d.total)}`).join('')

  const hovered = hover !== null ? days[hover] : null
  const tooltipLeft = hover !== null ? Math.min(Math.max(cx(hover), 110), width - 110) : 0

  return (
    <div ref={ref} className="relative w-full select-none" style={{ height: HEIGHT }}>
      {width > 0 && (
        <svg width={width} height={HEIGHT} role="img" aria-label="Time logged per day over the selected 7 days">
          {/* grid + y axis */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={M.left}
                x2={width - M.right}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--line)"
                strokeDasharray={t === 0 ? undefined : '2 4'}
              />
              <text x={M.left - 10} y={y(t)} dy="0.32em" textAnchor="end" className="fill-ink-3 text-[11px] tabular">
                {t === 0 ? '0' : `${t / 60}h`}
              </text>
            </g>
          ))}

          {/* hover column */}
          {hover !== null && (
            <rect x={M.left + band * hover + 4} y={M.top} width={band - 8} height={innerH} rx={6} fill="var(--surface-2)" />
          )}

          {mode === 'bar' &&
            days.map((d, i) => {
              let acc = 0
              const segs = CATEGORIES.filter((c) => d.byCat[c.id] > 0)
              return (
                <g key={d.key}>
                  {segs.map((c, si) => {
                    const v = d.byCat[c.id]
                    const y0 = y(acc)
                    const y1 = y(acc + v)
                    acc += v
                    const isTop = si === segs.length - 1
                    const h = Math.max(1, y0 - y1 - (si > 0 ? GAP : 0))
                    const x = cx(i) - barW / 2
                    return isTop ? (
                      <path key={c.id} d={topRoundedPath(x, y1, barW, h, RADIUS)} fill={`var(${c.varName})`} />
                    ) : (
                      <rect key={c.id} x={x} y={y1} width={barW} height={h} fill={`var(${c.varName})`} />
                    )
                  })}
                  {i === peakIndex && (
                    <text x={cx(i)} y={y(d.total) - 8} textAnchor="middle" className="fill-ink-2 text-[11px] font-semibold tabular">
                      {fmtDuration(d.total)}
                    </text>
                  )}
                </g>
              )
            })}

          {mode === 'line' && (
            <g>
              <path d={linePath(prevDays)} fill="none" stroke="var(--ink-3)" strokeWidth={2} strokeDasharray="4 4" />
              <path
                d={`${linePath(days)}L${cx(6)},${y(0)}L${cx(0)},${y(0)}Z`}
                fill="var(--series-1)"
                opacity={0.08}
              />
              <path d={linePath(days)} fill="none" stroke="var(--series-1)" strokeWidth={2} strokeLinejoin="round" />
              {hover !== null && (
                <line x1={cx(hover)} x2={cx(hover)} y1={M.top} y2={M.top + innerH} stroke="var(--line-strong)" />
              )}
              {days.map((d, i) => (
                <circle
                  key={d.key}
                  cx={cx(i)}
                  cy={y(d.total)}
                  r={hover === i ? 5.5 : 4}
                  fill="var(--series-1)"
                  stroke="var(--surface)"
                  strokeWidth={2}
                />
              ))}
              {peakIndex >= 0 && (
                <text x={cx(peakIndex)} y={y(days[peakIndex].total) - 12} textAnchor="middle" className="fill-ink-2 text-[11px] font-semibold tabular">
                  {fmtDuration(days[peakIndex].total)}
                </text>
              )}
            </g>
          )}

          {/* x axis */}
          {days.map((d, i) => (
            <text
              key={d.key}
              x={cx(i)}
              y={HEIGHT - 8}
              textAnchor="middle"
              className={`text-[11px] ${d.key === todayKey ? 'fill-ink font-semibold' : 'fill-ink-3'}`}
            >
              {d.key === todayKey ? 'Today' : fmtWeekday(d.date)}
            </text>
          ))}

          {/* hit targets: whole column, bigger than the mark */}
          {days.map((d, i) => (
            <rect
              key={d.key}
              x={M.left + band * i}
              y={M.top}
              width={band}
              height={innerH + M.bottom}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>
      )}

      {hovered && (
        <div
          className="pointer-events-none absolute z-10 w-52 -translate-x-1/2 rounded-xl border border-line bg-surface p-3 text-xs shadow-lg shadow-black/5"
          style={{ left: tooltipLeft, top: 4 }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold text-ink">{fmtLong(hovered.date)}</span>
            <span className="font-semibold text-ink tabular">{fmtDuration(hovered.total)}</span>
          </div>
          {mode === 'bar' ? (
            <ul className="space-y-1">
              {CATEGORIES.map((c) => (
                <li key={c.id} className="flex items-center justify-between text-ink-2">
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                    {c.label}
                  </span>
                  <span className="tabular">{hovered.byCat[c.id] ? fmtDuration(hovered.byCat[c.id]) : '—'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-between text-ink-2">
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-3 border-t-2 border-dashed border-ink-3" />
                Prev. {fmtWeekday(prevDays[hover].date)}
              </span>
              <span className="tabular">{fmtDuration(prevDays[hover].total)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

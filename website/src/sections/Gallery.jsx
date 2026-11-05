import { useCallback, useState } from 'react'
import Lightbox from '../components/Lightbox'
import Section from '../components/Section'
import { gallery } from '../content'

export default function Gallery() {
  const [index, setIndex] = useState(null)
  const close = useCallback(() => setIndex(null), [])
  const move = useCallback((step) => setIndex((i) => (i + step + gallery.items.length) % gallery.items.length), [])

  return (
    <Section id="gallery" heading={gallery.heading} intro={gallery.intro} className="bg-surface">
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {gallery.items.map((g, i) => (
          <li key={g.image}>
            <button onClick={() => setIndex(i)} className="group block w-full overflow-hidden rounded-2xl border border-line" aria-label={`View larger: ${g.caption}`}>
              <img src={g.image} alt={g.caption} width="900" height="900" loading="lazy" className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={gallery.items} index={index} onClose={close} onMove={move} />
    </Section>
  )
}

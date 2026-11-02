import { addDays, toKey, uid } from './utils'

const TEMPLATES = {
  work: ['Focused coding session', 'Write project spec', 'Code review', 'Design system cleanup'],
  exercise: ['Morning run', 'Strength training', 'Cycling', 'Yoga flow'],
  learning: ['Read: Designing Data-Intensive Apps', 'Spanish practice', 'Online course module', 'Guitar practice'],
  wellness: ['Meditation', 'Evening walk', 'Journaling', 'Stretching'],
}

// Small deterministic PRNG so the demo data is stable between reloads.
function rng(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

/** ~4 weeks of sample entries with one gap so the streak reads realistically. */
export function makeSeed(today = new Date()) {
  const rand = rng(42)
  const logs = []
  for (let back = 27; back >= 0; back--) {
    if (back === 11 || back === 19) continue // rest days break the streak
    const date = toKey(addDays(today, -back))
    const count = 1 + Math.floor(rand() * 3)
    const cats = ['work', 'exercise', 'learning', 'wellness'].sort(() => rand() - 0.5).slice(0, count)
    for (const category of cats) {
      const list = TEMPLATES[category]
      const base = category === 'work' ? 90 : category === 'exercise' ? 45 : 30
      logs.push({
        id: uid(),
        date,
        category,
        title: list[Math.floor(rand() * list.length)],
        minutes: Math.round((base + rand() * base) / 5) * 5,
        notes: rand() > 0.6 ? 'Felt productive and focused.' : '',
      })
    }
  }
  return logs
}

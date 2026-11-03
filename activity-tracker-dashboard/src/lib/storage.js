import { useEffect, useState } from 'react'

export const KEYS = {
  logs: 'activity-tracker:logs',
  goals: 'activity-tracker:goals',
  theme: 'activity-tracker:theme',
  lastBackup: 'activity-tracker:last-backup',
}

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback()
  } catch {
    return fallback()
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — keep working in memory */
  }
}

/** useState that mirrors its value into localStorage. */
export function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => load(key, fallback))
  useEffect(() => save(key, value), [key, value])
  return [value, setValue]
}

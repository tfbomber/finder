import type { Answers, Category } from '../domain/types'

/**
 * Antworten leben in der URL. Ergebnis-Links sind dadurch teilbar –
 * ein Leser kann seine Empfehlung an den Partner schicken, und wir können
 * einem Publisher einen fertigen Beispielfall verlinken.
 */
export function answersToQuery(cat: Category, a: Answers): string {
  const q = new URLSearchParams()
  for (const question of cat.questions) {
    const v = a[question.id]
    if (v === undefined) continue
    q.set(question.id, Array.isArray(v) ? v.join('-') : v)
  }
  return q.toString()
}

export function answersFromQuery(cat: Category, q: URLSearchParams): Answers {
  const a: Answers = {}
  for (const question of cat.questions) {
    const raw = q.get(question.id)
    if (!raw) continue
    const valid = new Set(question.options.map((o) => o.id))
    if (question.type === 'multi') {
      const parts = raw.split('-').filter((p) => valid.has(p))
      if (parts.length) a[question.id] = parts
    } else if (valid.has(raw)) {
      a[question.id] = raw
    }
  }
  return a
}

export function isComplete(cat: Category, a: Answers): boolean {
  return cat.questions.every((q) => {
    const v = a[q.id]
    return Array.isArray(v) ? v.length > 0 : typeof v === 'string' && v.length > 0
  })
}

export function labelFor(cat: Category, questionId: string, a: Answers): string {
  const q = cat.questions.find((x) => x.id === questionId)
  if (!q) return ''
  const v = a[questionId]
  if (v === undefined) return ''
  const ids = Array.isArray(v) ? v : [v]
  return ids
    .map((id) => q.options.find((o) => o.id === id)?.label ?? id)
    .join(', ')
}

import type {
  Answers,
  Category,
  CriterionScore,
  Evaluation,
  Product,
  Recommendation,
  RecommendationRole,
} from './types'

const BUDGET_RULE_ID = 'budget'

function evaluateProduct(p: Product, a: Answers, cat: Category): Evaluation {
  const blockers: string[] = []
  const blockerIds: string[] = []

  for (const rule of cat.logic.hardRules) {
    const r = rule.test(p, a)
    if (!r.ok) {
      blockers.push(r.reason)
      blockerIds.push(rule.id)
    }
  }

  const breakdown: CriterionScore[] = cat.logic.criteria.map((c) => {
    const weight = c.weight(a)
    const score = Math.max(0, Math.min(1, c.score(p, a)))
    return { id: c.id, label: c.label, weight, score, contribution: weight * score }
  })

  const weightSum = breakdown.reduce((s, b) => s + b.weight, 0) || 1
  const raw = breakdown.reduce((s, b) => s + b.contribution, 0) / weightSum
  const score = Math.round(raw * 100)

  const pros: string[] = []
  const caveats: string[] = []

  // Reasons are ordered by how much the criterion actually mattered for *this* reader.
  const ranked = [...breakdown].sort((x, y) => y.weight * y.score - x.weight * x.score)
  for (const b of ranked) {
    if (pros.length >= 3) break
    if (b.weight <= 0 || b.score < 0.7) continue
    const text = cat.logic.criteria.find((c) => c.id === b.id)?.pro?.(p, a)
    if (text) pros.push(text)
  }
  for (const b of [...breakdown].sort((x, y) => y.weight - x.weight)) {
    if (caveats.length >= 2) break
    if (b.weight < 1 || b.score > 0.5) continue
    const text = cat.logic.criteria.find((c) => c.id === b.id)?.caveat?.(p, a)
    if (text) caveats.push(text)
  }

  return {
    product: p,
    fits: blockers.length === 0,
    score,
    band: score >= 80 ? 'sehr' : score >= 66 ? 'gut' : 'ok',
    pros,
    caveats,
    blockers,
    onlyBudgetBlocked: blockerIds.length === 1 && blockerIds[0] === BUDGET_RULE_ID,
    breakdown,
  }
}

function assignRole(
  alt: Evaluation,
  primary: Evaluation,
  a: Answers,
  used: Set<string>,
): RecommendationRole {
  const cheaper = primary.product.priceEur - alt.product.priceEur
  const must = (a.ausstattung as string[] | undefined) ?? []

  const candidates: RecommendationRole[] = []
  if (cheaper >= 80) {
    // Preisvorteil ist fuer jedes Modell eine eigene Aussage, darf also mehrfach vorkommen.
    candidates.push({ key: `guenstiger-${alt.product.id}`, label: `${Math.round(cheaper)} € günstiger` })
  }
  if (cheaper <= -80) {
    candidates.push({ key: 'mehr', label: 'Wenn du mehr investieren willst' })
  }
  if (alt.product.attrs.headrest && !primary.product.attrs.headrest && !must.includes('kopfstuetze')) {
    candidates.push({ key: 'kopfstuetze', label: 'Mit Kopfstütze' })
  }
  if (alt.product.attrs.material === 'netz' && primary.product.attrs.material !== 'netz') {
    candidates.push({ key: 'netz', label: 'Luftiger Netzrücken' })
  }
  if (
    typeof alt.product.attrs.maxLoadKg === 'number' &&
    typeof primary.product.attrs.maxLoadKg === 'number' &&
    alt.product.attrs.maxLoadKg >= primary.product.attrs.maxLoadKg + 20
  ) {
    candidates.push({ key: 'stabil', label: 'Mehr Belastbarkeit' })
  }
  if (alt.product.grade < primary.product.grade) {
    candidates.push({
      key: 'note',
      label: `Bessere Testnote (${alt.product.grade.toFixed(1).replace('.', ',')})`,
    })
  }
  if (
    typeof alt.product.attrs.dailyHoursMax === 'number' &&
    typeof primary.product.attrs.dailyHoursMax === 'number' &&
    alt.product.attrs.dailyHoursMax >= primary.product.attrs.dailyHoursMax + 2
  ) {
    candidates.push({ key: 'dauer', label: 'Für längere Sitzzeiten freigegeben' })
  }
  if (
    typeof alt.product.attrs.warrantyYears === 'number' &&
    typeof primary.product.attrs.warrantyYears === 'number' &&
    alt.product.attrs.warrantyYears > primary.product.attrs.warrantyYears
  ) {
    candidates.push({ key: 'garantie', label: `${alt.product.attrs.warrantyYears} Jahre Garantie` })
  }
  if (alt.product.attrs.seatDepthAdjust && !primary.product.attrs.seatDepthAdjust) {
    candidates.push({ key: 'sitztiefe', label: 'Mit Sitztiefenverstellung' })
  }
  if (alt.product.attrs.material === 'polster' && primary.product.attrs.material === 'netz') {
    candidates.push({ key: 'polster', label: 'Gepolstert statt Netz' })
  }

  const pick = candidates.find((c) => !used.has(c.key)) ?? { key: 'alt', label: 'Ebenfalls passend' }
  used.add(pick.key)
  return pick
}

export function recommend(cat: Category, a: Answers): Recommendation {
  const evaluations = cat.products.map((p) => evaluateProduct(p, a, cat))

  const fitting = evaluations
    .filter((e) => e.fits)
    .sort((x, y) => y.score - x.score || x.product.grade - y.product.grade)

  const primary = fitting[0] ?? null
  const used = new Set<string>()
  const alternatives = primary
    ? fitting.slice(1, 3).map((e) => ({ evaluation: e, role: assignRole(e, primary, a, used) }))
    : []

  // "Warum nicht …?" – only models the reader actually saw in the article.
  const ruledOut = evaluations
    .filter((e) => !e.fits && e.product.listRank !== undefined)
    .sort((x, y) => (x.product.listRank ?? 99) - (y.product.listRank ?? 99))
    .slice(0, 3)

  // Nur am Budget gescheitert. Zwei sehr unterschiedliche Situationen:
  // mit Empfehlung ist das ein Upgrade, ohne Empfehlung ist es der
  // guenstigste Stuhl, den wir ueberhaupt verantworten koennen.
  const budgetBlocked = evaluations.filter((e) => !e.fits && e.onlyBudgetBlocked)

  let stretch: Evaluation | null = null
  if (primary) {
    const best = [...budgetBlocked].sort((x, y) => y.score - x.score)[0]
    if (best && best.score >= primary.score + 6) stretch = best
  } else {
    stretch =
      [...budgetBlocked].sort(
        (x, y) => x.product.priceEur - y.product.priceEur || y.score - x.score,
      )[0] ?? null
  }

  return {
    primary,
    alternatives,
    ruledOut,
    stretch,
    totalConsidered: cat.products.length,
  }
}

export { evaluateProduct }

export interface FunnelStep {
  id: string
  label: string
  removed: number
  remaining: number
}

/**
 * Der Trichter macht die harte Filterung sichtbar: aus wie vielen Modellen
 * wurde ausgewählt und welche Regel hat wie viele entfernt.
 */
export function funnel(cat: Category, a: Answers): { steps: FunnelStep[]; start: number; remaining: number } {
  let pool = cat.products
  const steps: FunnelStep[] = []
  for (const rule of cat.logic.hardRules) {
    const before = pool.length
    pool = pool.filter((p) => rule.test(p, a).ok)
    steps.push({ id: rule.id, label: rule.label, removed: before - pool.length, remaining: pool.length })
  }
  return { steps, start: cat.products.length, remaining: pool.length }
}

/** Gewichtung der weichen Kriterien für genau diesen Leser. */
export function weighting(cat: Category, a: Answers) {
  const rows = cat.logic.criteria.map((c) => ({ id: c.id, label: c.label, weight: c.weight(a) }))
  const max = Math.max(...rows.map((r) => r.weight), 1)
  return rows.sort((x, y) => y.weight - x.weight).map((r) => ({ ...r, share: r.weight / max }))
}

/** Beste Nicht-Treffer, wenn gar nichts passt. */
export function nearMisses(cat: Category, a: Answers): Evaluation[] {
  return cat.products
    .map((p) => evaluateProduct(p, a, cat))
    .filter((e) => !e.fits)
    .sort((x, y) => x.blockers.length - y.blockers.length || y.score - x.score)
    .slice(0, 3)
}

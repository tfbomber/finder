/**
 * Domain types are category-agnostic on purpose.
 * A category = questions + products + logic. Nothing here knows about chairs.
 */

export type AnswerValue = string | string[]
export type Answers = Record<string, AnswerValue>

export interface QuestionOption {
  id: string
  label: string
  hint?: string
  /** exclusive option in a multi-select ("nichts davon") */
  exclusive?: boolean
}

export interface Question {
  id: string
  /** short label used in the answer-chip bar on the result page */
  chip: string
  headline: string
  sub?: string
  /** answers the reader's silent "warum wollt ihr das wissen?" */
  why?: string
  type: 'single' | 'multi'
  options: QuestionOption[]
}

export interface Product {
  id: string
  brand: string
  model: string
  priceEur: number
  /** editorial test grade, German school notation, e.g. 1.5 */
  grade: number
  /** rank in the publisher's public top list, if it appears there */
  listRank?: number
  tagline: string
  /** written in the publisher's voice – this is *their* knowledge, not ours */
  editorNote: string
  attrs: Record<string, string | number | boolean>
}

/** A hard constraint. Fails => product is removed and the reason is shown. */
export interface HardRule {
  id: string
  /** plain-language description of the rule, shown on the publisher page */
  label: string
  test: (p: Product, a: Answers) => { ok: true } | { ok: false; reason: string }
}

/** A weighted soft criterion. Produces the ranking and the explanations. */
export interface Criterion {
  id: string
  label: string
  /** 0 = irrelevant for this reader, 3 = dominant */
  weight: (a: Answers) => number
  /** 0..1 */
  score: (p: Product, a: Answers) => number
  pro?: (p: Product, a: Answers) => string | null
  caveat?: (p: Product, a: Answers) => string | null
}

export interface CategoryLogic {
  hardRules: HardRule[]
  criteria: Criterion[]
}

export interface Category {
  id: string
  /** e.g. "Bürostuhl" */
  noun: string
  nounPlural: string
  advisorTitle: string
  advisorIntro: string
  questions: Question[]
  products: Product[]
  logic: CategoryLogic
  /** answers used for the "Beispiel ansehen" shortcut */
  demoAnswers: Answers
}

export interface CriterionScore {
  id: string
  label: string
  weight: number
  score: number
  contribution: number
}

export interface Evaluation {
  product: Product
  fits: boolean
  /** 0..100, only meaningful when fits === true */
  score: number
  band: 'sehr' | 'gut' | 'ok'
  pros: string[]
  caveats: string[]
  /** reasons this product was ruled out */
  blockers: string[]
  /** true when the only blocker is the budget */
  onlyBudgetBlocked: boolean
  breakdown: CriterionScore[]
}

export interface RecommendationRole {
  key: string
  label: string
}

export interface Recommendation {
  primary: Evaluation | null
  alternatives: Array<{ evaluation: Evaluation; role: RecommendationRole }>
  /** popular models from the list that were ruled out – the "warum nicht?" block */
  ruledOut: Evaluation[]
  /** the strongest product that is only blocked by budget, if it clearly beats the primary */
  stretch: Evaluation | null
  totalConsidered: number
}

import { useEffect, useMemo, useState } from 'react'
import { buerostuhl } from '../categories/buerostuhl'
import { Button, Container, Icon } from '../components/ui'
import { answersFromQuery, answersToQuery, isComplete } from '../lib/answers'
import { navigate, useRoute } from '../lib/router'
import type { Answers } from '../domain/types'

const cat = buerostuhl

export function AdvisorPage() {
  const route = useRoute()
  const initial = useMemo(() => answersFromQuery(cat, route.query), [])
  const [answers, setAnswers] = useState<Answers>(initial)
  const [step, setStep] = useState(() => {
    const s = Number(route.query.get('step'))
    if (Number.isFinite(s) && s >= 1 && s <= cat.questions.length) return s - 1
    const firstOpen = cat.questions.findIndex((q) => initial[q.id] === undefined)
    return firstOpen === -1 ? 0 : firstOpen
  })
  const [why, setWhy] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const q = cat.questions[step]
  const selected = answers[q.id]
  const multi = q.type === 'multi'
  const chosen: string[] = Array.isArray(selected) ? selected : selected ? [selected] : []

  useEffect(() => setWhy(false), [step])

  // Antworten bleiben in der URL – Neuladen verliert nichts.
  useEffect(() => {
    const qs = answersToQuery(cat, answers)
    window.history.replaceState({}, '', `/berater?${qs}${qs ? '&' : ''}step=${step + 1}`)
  }, [answers, step])

  function goNext(next: Answers) {
    if (step < cat.questions.length - 1) {
      setLeaving(true)
      window.setTimeout(() => {
        setStep((s) => s + 1)
        setLeaving(false)
        window.scrollTo({ top: 0 })
      }, 130)
    } else if (isComplete(cat, next)) {
      navigate(`/berater/ergebnis?${answersToQuery(cat, next)}`)
    }
  }

  function choose(optionId: string) {
    const opt = q.options.find((o) => o.id === optionId)
    if (multi) {
      const isExclusive = opt?.exclusive
      let list = chosen
      if (isExclusive) {
        list = chosen.includes(optionId) ? [] : [optionId]
      } else {
        const withoutExclusive = chosen.filter(
          (id) => !cat.questions.find((x) => x.id === q.id)?.options.find((o) => o.id === id)?.exclusive,
        )
        list = withoutExclusive.includes(optionId)
          ? withoutExclusive.filter((id) => id !== optionId)
          : [...withoutExclusive, optionId]
      }
      setAnswers((a) => ({ ...a, [q.id]: list }))
      return
    }
    const next = { ...answers, [q.id]: optionId }
    setAnswers(next)
    goNext(next)
  }

  // Zifferntasten für schnelles Durchklicken am Desktop
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const i = Number(e.key) - 1
      if (i >= 0 && i < q.options.length) choose(q.options[i].id)
      if (e.key === 'Enter' && multi && chosen.length) goNext(answers)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const pct = Math.round(((step + (chosen.length ? 1 : 0)) / cat.questions.length) * 100)

  return (
    <Container className="pt-6 pb-16">
      {/* Fortschritt */}
      <div className="mb-8">
        <div className="mb-2 flex items-baseline justify-between text-[13px]">
          <span className="font-semibold text-brand">
            Frage {step + 1} von {cat.questions.length}
          </span>
          <span className="text-ink-mute">Kaufberater Bürostuhl</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out"
            style={{ width: `${Math.max(pct, 6)}%` }}
          />
        </div>
      </div>

      <div key={step} className={leaving ? 'opacity-0 transition-opacity duration-100' : 'anim-in'}>
        <h1 className="font-serif text-[27px] leading-tight font-bold text-ink sm:text-[33px]">{q.headline}</h1>
        {q.sub && <p className="mt-2.5 text-[15.5px] leading-relaxed text-ink-soft">{q.sub}</p>}

        <div className={`mt-7 grid gap-2.5 ${multi ? '' : 'sm:grid-cols-2'}`}>
          {q.options.map((o, i) => {
            const active = chosen.includes(o.id)
            return (
              <button
                key={o.id}
                onClick={() => choose(o.id)}
                aria-pressed={active}
                className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-150 ${
                  active
                    ? 'border-brand bg-brand-soft shadow-[0_0_0_1px_var(--publisher-brand)]'
                    : 'border-line bg-paper hover:border-line-strong hover:bg-paper-warm'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors ${
                    multi ? 'rounded-[6px]' : 'rounded-full'
                  } ${active ? 'border-brand bg-brand text-white' : 'border-line-strong text-transparent'}`}
                >
                  <Icon name="check" className="h-3 w-3" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15.5px] leading-snug font-semibold text-ink">{o.label}</span>
                  {o.hint && <span className="mt-0.5 block text-[13.5px] text-ink-soft">{o.hint}</span>}
                </span>
                <span className="mt-1 hidden text-[11px] font-semibold text-ink-mute sm:block">{i + 1}</span>
              </button>
            )
          })}
        </div>

        {/* Vertrauensbaustein: die Redaktion erklärt, warum sie fragt */}
        {q.why && (
          <div className="mt-5">
            <button
              onClick={() => setWhy((v) => !v)}
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-brand hover:opacity-70"
            >
              <Icon name="info" className="h-4 w-4" />
              Warum fragen wir das?
              <span className={`transition-transform ${why ? 'rotate-90' : ''}`}>
                <Icon name="chevron" className="h-3.5 w-3.5" />
              </span>
            </button>
            {why && (
              <p className="anim-in mt-3 rounded-xl border border-line bg-paper-warm p-4 text-[14.5px] leading-relaxed text-ink-soft">
                {q.why}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-1.5 text-[14.5px] font-medium text-ink-soft hover:text-brand"
            >
              <Icon name="back" /> Zurück
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-[14.5px] font-medium text-ink-soft hover:text-brand"
            >
              <Icon name="back" /> Zum Artikel
            </button>
          )}

          {multi && (
            <Button variant="cta" size="lg" disabled={chosen.length === 0} onClick={() => goNext(answers)}>
              {step === cat.questions.length - 1 ? 'Empfehlung ansehen' : 'Weiter'} <Icon name="arrow" />
            </Button>
          )}
        </div>
      </div>

      <p className="mt-12 border-t border-line pt-5 text-[12.5px] leading-relaxed text-ink-mute">
        Keine Anmeldung, keine E-Mail-Adresse. Deine Angaben bleiben im Browser und werden ausschließlich mit
        unseren Testdaten abgeglichen.
      </p>
    </Container>
  )
}

import { useMemo, useState } from 'react'
import { buerostuhl } from '../categories/buerostuhl'
import { funnel, nearMisses, recommend, weighting } from '../domain/engine'
import { publisher } from '../config/publisher'
import { answersFromQuery, answersToQuery, isComplete, labelFor } from '../lib/answers'
import { navigate, useRoute } from '../lib/router'
import type { Evaluation } from '../domain/types'
import { AlternativeCard, PrimaryCard, RuledOutList, StretchCard } from '../components/ResultCards'
import { Container, Icon, Button } from '../components/ui'

const cat = buerostuhl

export function ResultPage() {
  const route = useRoute()
  const answers = useMemo(() => answersFromQuery(cat, route.query), [route.query.toString()])
  const complete = isComplete(cat, answers)
  const rec = useMemo(() => (complete ? recommend(cat, answers) : null), [answers, complete])
  const [showLogic, setShowLogic] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!complete) {
    return (
      <Container className="py-16 text-center">
        <h1 className="font-serif text-[26px] font-bold">Es fehlen noch Angaben</h1>
        <p className="mt-3 text-ink-soft">Für eine Empfehlung brauchen wir alle sechs Antworten.</p>
        <div className="mt-6 flex justify-center">
          <Button variant="cta" size="lg" onClick={() => navigate('/berater')}>
            Kaufberater starten <Icon name="arrow" />
          </Button>
        </div>
      </Container>
    )
  }

  const f = funnel(cat, answers)
  const w = weighting(cat, answers)
  const qs = answersToQuery(cat, answers)

  return (
    <Container className="pt-6 pb-4">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-cta uppercase">Dein Ergebnis</p>
      <h1 className="mt-2 font-serif text-[28px] leading-tight font-bold text-ink sm:text-[34px]">
        {rec?.primary
          ? `Aus ${f.start} getesteten Stühlen bleiben ${f.remaining} für dich übrig`
          : rec?.stretch
            ? 'In deinem Budget passt keiner – knapp darüber schon'
            : 'Für deine Kombination haben wir keinen passenden Stuhl im Test'}
      </h1>

      {/* Angaben – jederzeit korrigierbar, das hält den Leser im Tool */}
      <div className="mt-5 rounded-xl border border-line bg-paper-warm p-4">
        <p className="mb-2.5 text-[12px] font-semibold tracking-wide text-ink-mute uppercase">Deine Angaben</p>
        <div className="flex flex-wrap gap-2">
          {cat.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => navigate(`/berater?${qs}&step=${i + 1}`)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-paper px-3 py-1.5 text-[13px] text-ink transition-colors hover:border-brand hover:bg-brand-soft"
            >
              <span className="text-ink-mute group-hover:text-brand">{q.chip}:</span>
              <span className="font-semibold">{labelFor(cat, q.id, answers)}</span>
              <span className="text-ink-mute opacity-0 transition-opacity group-hover:opacity-100">
                <Icon name="edit" className="h-3.5 w-3.5" />
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-[12.5px] text-ink-mute">
          Angabe anklicken, um sie zu ändern – das Ergebnis passt sich sofort an.
        </p>
      </div>

      {rec?.primary ? (
        <>
          <div className="mt-7">
            <PrimaryCard e={rec.primary} />
          </div>

          {rec.stretch && (
            <div className="mt-4">
              <StretchCard e={rec.stretch} />
            </div>
          )}

          {rec.alternatives.length > 0 && (
            <section className="mt-12">
              <h2 className="font-serif text-[23px] font-bold text-ink sm:text-[26px]">
                Ebenfalls passend, mit anderem Schwerpunkt
              </h2>
              <p className="mt-2 text-[15px] text-ink-soft">
                Beide erfüllen deine Anforderungen. Sie setzen nur andere Prioritäten als unsere
                Hauptempfehlung.
              </p>
              <div className={`mt-5 grid gap-4 ${rec.alternatives.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                {rec.alternatives.map(({ evaluation, role }) => (
                  <AlternativeCard key={evaluation.product.id} e={evaluation} role={role} />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <NoMatch answers={answers} stretch={rec?.stretch ?? null} />
      )}

      {rec?.primary && rec.ruledOut.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-[23px] font-bold text-ink sm:text-[26px]">
            Warum nicht die Modelle aus unserer Top-Liste?
          </h2>
          <p className="mt-2 text-[15px] text-ink-soft">
            Diese Stühle empfehlen wir im Artikel ausdrücklich. Für deine Angaben scheiden sie trotzdem aus –
            hier ist der Grund.
          </p>
          <div className="mt-5">
            <RuledOutList items={rec.ruledOut} />
          </div>
        </section>
      )}

      {/* Transparenzblock: das ist der Vertrauensanker der ganzen Seite */}
      <section className="mt-12 rounded-2xl border border-line bg-paper-warm p-5 sm:p-7">
        <h2 className="font-serif text-[21px] font-bold text-ink">Wie wir gefiltert und gewichtet haben</h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
          Die Empfehlung entsteht aus festen Regeln über unsere Testdaten. Gleiche Angaben führen immer zum
          gleichen Ergebnis – hier ist der komplette Rechenweg.
        </p>

        <button
          onClick={() => setShowLogic((v) => !v)}
          className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand hover:opacity-70"
        >
          {showLogic ? 'Rechenweg ausblenden' : 'Rechenweg anzeigen'}
          <span className={`transition-transform ${showLogic ? 'rotate-90' : ''}`}>
            <Icon name="chevron" className="h-3.5 w-3.5" />
          </span>
        </button>

        {showLogic && (
          <div className="anim-in mt-5 space-y-7">
            <div>
              <p className="mb-3 text-[12px] font-semibold tracking-wide text-ink-mute uppercase">
                Schritt 1 · Ausschlusskriterien
              </p>
              <ol className="space-y-2">
                <li className="flex items-baseline gap-3 text-[14px]">
                  <span className="w-8 shrink-0 text-right font-bold tabular-nums text-ink">{f.start}</span>
                  <span className="text-ink-soft">getestete Modelle im Datensatz</span>
                </li>
                {f.steps.map((s) => (
                  <li key={s.id} className="flex items-baseline gap-3 text-[14px]">
                    <span
                      className={`w-8 shrink-0 text-right font-bold tabular-nums ${s.removed ? 'text-bad' : 'text-ink-mute'}`}
                    >
                      {s.removed ? `−${s.removed}` : '0'}
                    </span>
                    <span className="text-ink-soft">
                      {s.label} <span className="text-ink-mute">· es bleiben {s.remaining}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className="mb-3 text-[12px] font-semibold tracking-wide text-ink-mute uppercase">
                Schritt 2 · Gewichtung für deine Angaben
              </p>
              <div className="space-y-2">
                {w.map((r) => (
                  <div key={r.id} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 text-[13px] text-ink-soft sm:w-52">{r.label}</span>
                    <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-line">
                      <span
                        className="block h-full rounded-full bg-brand"
                        style={{ width: `${Math.round(r.share * 100)}%` }}
                      />
                    </span>
                    <span className="w-10 shrink-0 text-right text-[12px] tabular-nums text-ink-mute">
                      ×{r.weight.toFixed(1).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink-mute">
                Beispiel: Wer täglich mehr als neun Stunden sitzt, bekommt Ergonomie und Nutzungsdauer stärker
                gewichtet als jemand, der den Stuhl zwei Stunden am Abend nutzt.
              </p>
            </div>
          </div>
        )}

        <p className="mt-6 border-t border-line pt-5 text-[12.5px] leading-relaxed text-ink-mute">
          {publisher.affiliateDisclosure}
        </p>
      </section>

      <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button variant="outline" onClick={() => navigate('/berater')}>
          <Icon name="back" /> Angaben neu eingeben
        </Button>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2000)
          }}
          className="text-[14px] font-medium text-brand underline underline-offset-4 hover:opacity-70"
        >
          {copied ? 'Link kopiert' : 'Ergebnis-Link kopieren'}
        </button>
      </div>
    </Container>
  )
}

function NoMatch({
  answers,
  stretch,
}: {
  answers: Record<string, string | string[]>
  stretch: Evaluation | null
}) {
  const misses = nearMisses(cat, answers).filter((m) => m.product.id !== stretch?.product.id)
  const budgetOnly = stretch !== null

  return (
    <section className="mt-7">
      <div className="rounded-2xl border border-line bg-warn-soft/50 p-5 sm:p-7">
        <p className="text-[15.5px] leading-relaxed text-ink">
          {budgetOnly
            ? 'In deinem Budget gibt es kein Modell, das wir dir mit gutem Gewissen empfehlen können. Wir schlagen dir hier lieber nichts vor, was nur fast passt.'
            : `Das ist selten, kommt aber vor: Deine Kombination aus Körpergröße, Gewicht und Anforderungen wird von keinem der ${cat.products.length} getesteten Modelle vollständig abgedeckt.`}
        </p>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
          {budgetOnly
            ? 'Ein Modell erfüllt alle deine Anforderungen – es kostet nur mehr als geplant. Wenn das keine Option ist, lockere oben eine deiner Angaben.'
            : 'Am nächsten kommen die folgenden Modelle. Wenn du bei einem Punkt Kompromisse machen kannst, ändere die entsprechende Angabe oben – dann rechnen wir neu.'}
        </p>
      </div>

      {stretch && (
        <div className="mt-5">
          <StretchCard e={stretch} mode="cheapest" />
        </div>
      )}

      {!budgetOnly && misses.length > 0 && (
        <div className="mt-5">
          <p className="mb-2.5 text-[12px] font-semibold tracking-wide text-ink-mute uppercase">
            Am nächsten dran
          </p>
          <RuledOutList items={misses} />
        </div>
      )}
    </section>
  )
}

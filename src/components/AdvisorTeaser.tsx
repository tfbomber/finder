import { buerostuhl } from '../categories/buerostuhl'
import { Link, navigate } from '../lib/router'
import { Button, Icon } from './ui'
import { word } from '../lib/format'

const count = buerostuhl.products.length

const POINTS = [
  'Körpergröße, Gewicht und Sitzdauer statt Bestsellerliste',
  'Klare Begründung, warum ein Modell passt – und warum ein anderes nicht',
  'Ergebnis in unter einer Minute, ohne Anmeldung',
]

export function AdvisorTeaser({ variant = 'full' }: { variant?: 'full' | 'inline' }) {
  if (variant === 'inline') {
    return (
      <div className="my-8 flex flex-col gap-3 rounded-xl border border-brand-line bg-brand-soft p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-[18px] font-bold text-brand">Unsicher, welches Modell?</p>
          <p className="mt-0.5 text-[14px] text-ink-soft">
            Sechs Fragen zu deinem Körper und deinem Arbeitstag – wir sagen dir, welcher der {word(count)}{' '}
            Stühle passt.
          </p>
        </div>
        <Button variant="cta" onClick={() => navigate('/berater')} className="shrink-0">
          Kaufberater starten <Icon name="arrow" />
        </Button>
      </div>
    )
  }

  return (
    <section className="my-10 overflow-hidden rounded-2xl border border-brand-line bg-brand-soft">
      <div className="p-6 sm:p-8">
        <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-brand/70 uppercase">
          Persönliche Empfehlung
        </p>
        <h2 className="font-serif text-[26px] leading-tight font-bold text-brand sm:text-[30px]">
          {buerostuhl.advisorTitle}
        </h2>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft">
          Ein Testsieger ist immer der Sieger für einen Durchschnittskörper. Bei 1,62 m und Bandscheibenvorfall
          sieht die Antwort anders aus als bei 1,94 m und 110 kg.
        </p>

        <ul className="mt-5 space-y-2.5">
          {POINTS.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-[14.5px] text-ink">
              <span className="mt-0.5 shrink-0 text-brand">
                <Icon name="check" className="h-4 w-4" />
              </span>
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button variant="cta" size="lg" onClick={() => navigate('/berater')}>
            Kaufberater starten <Icon name="arrow" />
          </Button>
          <Link
            to="/berater/ergebnis?groesse=179_190&gewicht=80_100&dauer=6_9&ruecken=verspannung&ausstattung=kopfstuetze&budget=450_700"
            className="text-[14px] font-medium text-brand underline underline-offset-4 hover:opacity-70"
          >
            Beispielergebnis ansehen
          </Link>
        </div>

        <p className="mt-5 text-[12.5px] text-ink-mute">
          60 Sekunden · keine Anmeldung · {word(count)} von uns getestete Modelle
        </p>
      </div>
    </section>
  )
}

import { useState } from 'react'
import type { Evaluation, RecommendationRole } from '../domain/types'
import { publisher } from '../config/publisher'
import { eur, grade } from '../lib/format'
import { ChairFigure } from './ChairFigure'
import { Badge, Button, Icon } from './ui'

const BAND_LABEL: Record<Evaluation['band'], string> = {
  sehr: 'Sehr gute Passung',
  gut: 'Gute Passung',
  ok: 'Passt grundsätzlich',
}

function SpecRow({ product }: { product: Evaluation['product'] }) {
  const a = product.attrs
  const items = [
    `${a.heightMinCm}–${a.heightMaxCm} cm`,
    `bis ${a.maxLoadKg} kg`,
    `${a.dailyHoursMax} Std./Tag`,
    a.headrest ? 'Kopfstütze' : 'ohne Kopfstütze',
    `${a.armrests === 'keine' ? 'keine Armlehnen' : `${a.armrests}-Armlehnen`}`,
    a.material === 'netz' ? 'Netzrücken' : a.material === 'kunstleder' ? 'Kunstleder' : 'Polster',
  ]
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-[12.5px] text-ink-mute">
      {items.map((t, i) => (
        <li key={t} className="flex items-center gap-3">
          {i > 0 && <span className="text-line-strong">|</span>}
          {t}
        </li>
      ))}
    </ul>
  )
}

export function PrimaryCard({ e }: { e: Evaluation }) {
  const [open, setOpen] = useState(false)
  const p = e.product
  return (
    <article className="anim-in overflow-hidden rounded-2xl border-2 border-brand bg-paper">
      <div className="flex items-center justify-between gap-3 bg-brand px-5 py-2.5 text-white">
        <p className="text-[13px] font-semibold tracking-wide">Unsere Empfehlung für dich</p>
        <p className="text-[12.5px] font-medium text-white/80">{BAND_LABEL[e.band]}</p>
      </div>

      <div className="p-5 sm:p-7">
        <div className="flex gap-5">
          <ChairFigure product={p} className="h-28 w-24 shrink-0 sm:h-36 sm:w-32" />
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-[24px] leading-tight font-bold text-ink sm:text-[29px]">
              {p.brand} {p.model}
            </h2>
            <p className="mt-1 text-[14.5px] text-ink-soft">{p.tagline}</p>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[22px] font-bold text-ink">{eur(p.priceEur)}</span>
              <Badge tone="neutral">Testnote {grade(p.grade)}</Badge>
              {p.listRank && <Badge tone="neutral">Platz {p.listRank} im Test</Badge>}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-brand-soft p-4 sm:p-5">
          <p className="mb-3 text-[13px] font-bold tracking-wide text-brand">Passt zu dir, weil</p>
          <ul className="space-y-2.5">
            {e.pros.map((r) => (
              <li key={r} className="flex items-start gap-2.5 text-[15px] leading-snug text-ink">
                <span className="mt-0.5 shrink-0 text-brand">
                  <Icon name="check" className="h-4.5 w-4.5" />
                </span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {e.caveats.length > 0 && (
          <div className="mt-3 rounded-xl border border-line bg-warn-soft/60 p-4 sm:p-5">
            <p className="mb-2 text-[13px] font-bold tracking-wide text-warn">Das solltest du wissen</p>
            <ul className="space-y-2">
              {e.caveats.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-ink-soft">
                  <span className="mt-0.5 shrink-0 text-warn">
                    <Icon name="warn" className="h-4 w-4" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        <blockquote className="mt-6 border-l-3 border-line-strong pl-4 font-serif text-[16.5px] leading-relaxed text-ink-soft italic">
          {p.editorNote}
          <footer className="mt-2 font-sans text-[12.5px] not-italic">
            Aus unserem Testbericht · Redaktion {publisher.name}
          </footer>
        </blockquote>

        <div className="mt-6">
          <SpecRow product={p} />
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button variant="cta" size="lg" href="#" className="sm:flex-1">
            {publisher.shopCtaLabel} <Icon name="external" />
          </Button>
          <Button variant="outline" size="lg" href="#" className="sm:flex-1">
            {publisher.contentCtaLabel}
          </Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand hover:opacity-70"
        >
          <Icon name="info" className="h-4 w-4" />
          Wie diese Empfehlung zustande kommt
          <span className={`transition-transform ${open ? 'rotate-90' : ''}`}>
            <Icon name="chevron" className="h-3.5 w-3.5" />
          </span>
        </button>

        {open && (
          <div className="anim-in mt-4 space-y-2.5 rounded-xl border border-line bg-paper-warm p-4 sm:p-5">
            <p className="text-[13px] font-bold tracking-wide text-ink">Bewertung dieses Modells für dich</p>
            {e.breakdown
              .filter((b) => b.weight > 0)
              .sort((x, y) => y.weight - x.weight)
              .map((b) => (
                <div key={b.id} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 text-[13px] text-ink-soft sm:w-52">{b.label}</span>
                  <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-line">
                    <span
                      className="block h-full rounded-full bg-brand"
                      style={{ width: `${Math.round(b.score * 100)}%`, opacity: 0.35 + 0.65 * (b.weight / 3) }}
                    />
                  </span>
                  <span className="w-10 shrink-0 text-right text-[12px] tabular-nums text-ink-mute">
                    {Math.round(b.score * 100)}
                  </span>
                </div>
              ))}
            <p className="pt-1 text-[12.5px] leading-relaxed text-ink-mute">
              Kräftigere Balken sind Kriterien, die aufgrund deiner Angaben stärker gewichtet werden. Es
              werden keine Provisionen und keine Verkaufszahlen einbezogen.
            </p>
          </div>
        )}
      </div>
    </article>
  )
}

export function AlternativeCard({ e, role }: { e: Evaluation; role: RecommendationRole }) {
  const p = e.product
  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-paper p-5">
      <Badge tone="brand">{role.label}</Badge>
      <div className="mt-4 flex gap-4">
        <ChairFigure product={p} className="h-20 w-16 shrink-0" />
        <div className="min-w-0">
          <h3 className="font-serif text-[19px] leading-tight font-bold text-ink">
            {p.brand} {p.model}
          </h3>
          <p className="mt-1 text-[13.5px] text-ink-soft">{p.tagline}</p>
          <p className="mt-2 text-[16px] font-bold text-ink">{eur(p.priceEur)}</p>
        </div>
      </div>
      <ul className="mt-4 flex-1 space-y-2">
        {e.pros.slice(0, 2).map((r) => (
          <li key={r} className="flex items-start gap-2 text-[14px] leading-snug text-ink-soft">
            <span className="mt-0.5 shrink-0 text-brand">
              <Icon name="check" className="h-4 w-4" />
            </span>
            {r}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex gap-2">
        <Button variant="outline" href="#" className="flex-1">
          {publisher.shopCtaLabel}
        </Button>
      </div>
    </article>
  )
}

export function StretchCard({ e, mode = 'upgrade' }: { e: Evaluation; mode?: 'upgrade' | 'cheapest' }) {
  const p = e.product
  return (
    <article className="rounded-xl border border-dashed border-line-strong bg-paper-warm p-5 sm:p-6">
      <Badge tone="warn">{mode === 'cheapest' ? 'Günstigste Empfehlung' : 'Über deinem Budget'}</Badge>
      <div className="mt-4 flex gap-4">
        <ChairFigure product={p} className="h-20 w-16 shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-[20px] leading-tight font-bold text-ink">
            {p.brand} {p.model}
          </h3>
          <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
            {mode === 'cheapest'
              ? `Das günstigste Modell im Test, das alle deine Anforderungen erfüllt. Mit ${eur(p.priceEur)} liegt es über deinem Budget – darunter finden wir nichts, das wir dir empfehlen würden.`
              : `Wäre nach deinen Angaben das stimmigere Modell, kostet mit ${eur(p.priceEur)} aber mehr als geplant. Wir sagen dir das lieber, als es zu verschweigen.`}
          </p>
          {e.pros[0] && (
            <p className="mt-2.5 flex items-start gap-2 text-[14px] text-ink">
              <span className="mt-0.5 shrink-0 text-brand">
                <Icon name="check" className="h-4 w-4" />
              </span>
              {e.pros[0]}
            </p>
          )}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button variant="cta" href="#">
              {publisher.shopCtaLabel} <Icon name="external" />
            </Button>
            <Button variant="outline" href="#">
              {publisher.contentCtaLabel}
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

export function RuledOutList({ items }: { items: Evaluation[] }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-paper">
      {items.map((e) => (
        <li key={e.product.id} className="flex items-start gap-4 p-4 sm:p-5">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bad-soft text-bad">
            <Icon name="x" className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-ink">
              {e.product.brand} {e.product.model}
              <span className="ml-2 text-[12.5px] font-normal text-ink-mute">
                {e.product.listRank ? `Platz ${e.product.listRank} im Test · ` : ''}
                {eur(e.product.priceEur)}
              </span>
            </p>
            <ul className="mt-1.5 space-y-1">
              {e.blockers.map((b) => (
                <li key={b} className="text-[14px] leading-snug text-ink-soft">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  )
}

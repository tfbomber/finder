import { useState } from 'react'
import { buerostuhl } from '../categories/buerostuhl'
import { alternativeThemes, applyTheme, publisher, restoreTheme } from '../config/publisher'
import { navigate } from '../lib/router'
import { Button, Icon, WideContainer } from '../components/ui'

const RESPONSIBILITY = [
  {
    them: 'Sie entscheiden, welche Produkte überhaupt in Frage kommen',
    us: 'Wir rechnen nur mit Ihrer Auswahl – nichts kommt von außen dazu',
  },
  {
    them: 'Sie liefern Messwerte, Testnoten und Ihre Einschätzungen',
    us: 'Wir bilden daraus die Filter- und Gewichtungsregeln ab',
  },
  {
    them: 'Sie formulieren die Empfehlungsprinzipien Ihrer Redaktion',
    us: 'Wir übersetzen sie in nachvollziehbare, wiederholbare Logik',
  },
  {
    them: 'Ihre Marke, Ihre Domain, Ihre Affiliate-Links',
    us: 'Wir erscheinen mit einer Zeile im Footer – oder gar nicht',
  },
]

const NOT_BUILT = [
  'Kein Login, kein Dashboard, keine Abrechnung – das ist bewusst nicht Teil dieser Demo.',
  'Keine Live-Preise und keine Shop-Anbindung. Beides ist Standardarbeit, aber es beantwortet nicht die Frage, ob Ihre Leser so ein Werkzeug nutzen würden.',
  'Kein Sprachmodell im Empfehlungsweg. Die Reihenfolge entsteht aus Regeln, nicht aus einer Textgenerierung. Ein Modell, das sich Produkteigenschaften ausdenkt, wäre in Ihrem Namen ein Risiko.',
]

export function PublisherPage() {
  const [theme, setTheme] = useState(restoreTheme)

  return (
    <div className="pb-4">
      {/* Hero */}
      <div className="border-b border-line bg-paper-warm">
        <WideContainer className="py-14 sm:py-20">
          <p className="mb-4 text-[11px] font-semibold tracking-[0.14em] text-cta uppercase">
            Für Vergleichsportale, Testredaktionen und Kaufberatungs-Kanäle
          </p>
          <h1 className="max-w-3xl font-serif text-[34px] leading-[1.12] font-bold text-ink sm:text-[48px]">
            Ihre Testergebnisse werden zum persönlichen Kaufberater.
          </h1>
          <p className="mt-5 max-w-2xl text-[18px] leading-relaxed text-ink-soft">
            Ihre Leser haben Ihre Top-Liste gesehen und stellen trotzdem die eine Frage, die Ihre Redaktion
            jede Woche per Mail beantwortet: <em>Welches Modell passt zu mir?</em> Passform beantwortet sie auf
            Ihrer Seite, mit Ihren Daten, in Ihrem Namen.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="cta" size="lg" onClick={() => navigate('/')}>
              Demo aus Lesersicht ansehen <Icon name="arrow" />
            </Button>
            <Button variant="outline" size="lg" href="mailto:hallo@passform.tools?subject=Kaufberater%20Demo">
              Gespräch vereinbaren
            </Button>
          </div>
          <p className="mt-6 text-[13px] text-ink-mute">
            Die Demo zeigt ein fiktives Testportal namens {publisher.name}. Produkte und Messwerte sind
            Beispieldaten.
          </p>
        </WideContainer>
      </div>

      {/* Das Problem */}
      <WideContainer className="py-14 sm:py-18">
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="font-serif text-[27px] leading-tight font-bold text-ink sm:text-[32px]">
              Zwischen Ihrer Empfehlung und dem Kauf liegt eine Lücke
            </h2>
            <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-ink-soft">
              <p>
                Ein Test mit zehn Modellen ist die richtige Antwort auf eine allgemeine Frage. Der Leser hat
                aber eine konkrete: Er ist 1,63 m groß, sitzt neun Stunden am Tag und hat einen
                Bandscheibenvorfall.
              </p>
              <p>
                Diese Lücke schließt heute niemand. Der Leser öffnet fünf Tabs, vergleicht selbst, verliert
                die Lust – oder kauft bei jemand anderem. Ihre Arbeit war die Grundlage der Entscheidung, aber
                nicht der letzte Schritt davor.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-6 sm:p-7">
            <p className="text-[12px] font-semibold tracking-wide text-ink-mute uppercase">Ohne Kaufberater</p>
            <p className="mt-2 font-serif text-[17px] text-ink">
              Artikel → Top-10-Liste → Leser vergleicht selbst → irgendwann irgendwo ein Klick
            </p>
            <div className="my-6 h-px bg-line" />
            <p className="text-[12px] font-semibold tracking-wide text-brand uppercase">Mit Kaufberater</p>
            <p className="mt-2 font-serif text-[17px] font-semibold text-ink">
              Artikel → sechs Fragen → eine begründete Empfehlung → Ihr Testbericht und Ihr Affiliate-Link
            </p>
            <p className="mt-5 text-[13.5px] leading-relaxed text-ink-mute">
              Der Kaufberater ersetzt Ihre Inhalte nicht. Er ist der letzte Schritt davor und führt in Ihre
              Inhalte zurück.
            </p>
          </div>
        </div>
      </WideContainer>

      {/* Verantwortung */}
      <div className="border-y border-line bg-paper-warm">
        <WideContainer className="py-14 sm:py-18">
          <h2 className="font-serif text-[27px] leading-tight font-bold text-ink sm:text-[32px]">
            Ihr Wissen bleibt Ihres
          </h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
            Das hier ist kein Empfehlungsdienst, der sich zwischen Sie und Ihre Leser stellt. Die redaktionelle
            Hoheit bleibt vollständig bei Ihnen.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-paper">
            <div className="grid grid-cols-2 border-b border-line bg-paper-warm text-[12px] font-semibold tracking-wide text-ink-mute uppercase">
              <div className="border-r border-line px-5 py-3">Sie als Redaktion</div>
              <div className="px-5 py-3">Passform</div>
            </div>
            {RESPONSIBILITY.map((r) => (
              <div key={r.them} className="grid grid-cols-2 border-b border-line last:border-0">
                <div className="border-r border-line px-5 py-4 text-[14.5px] leading-snug text-ink">
                  {r.them}
                </div>
                <div className="px-5 py-4 text-[14.5px] leading-snug text-ink-soft">{r.us}</div>
              </div>
            ))}
          </div>
        </WideContainer>
      </div>

      {/* Regeln */}
      <WideContainer className="py-14 sm:py-18">
        <h2 className="font-serif text-[27px] leading-tight font-bold text-ink sm:text-[32px]">
          Nachvollziehbar statt magisch
        </h2>
        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
          Die Ausschlusskriterien im Demo-Kaufberater sind vollständig lesbar. Genau in dieser Form würden wir
          sie mit Ihrer Redaktion abstimmen – Sie sehen jede Regel, bevor sie live geht.
        </p>
        <ol className="mt-8 space-y-3">
          {buerostuhl.logic.hardRules.map((r, i) => (
            <li key={r.id} className="flex items-start gap-4 rounded-xl border border-line bg-paper p-5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[13px] font-bold text-brand">
                {i + 1}
              </span>
              <p className="text-[15px] leading-relaxed text-ink">{r.label}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-[14px] leading-relaxed text-ink-mute">
          Dazu kommen sieben gewichtete Kriterien für die Reihenfolge. Gleiche Angaben führen immer zum
          gleichen Ergebnis. Der Leser kann sich den gesamten Rechenweg auf der Ergebnisseite anzeigen lassen.
        </p>
      </WideContainer>

      {/* Branding */}
      <div className="border-y border-line bg-paper-warm">
        <WideContainer className="py-14 sm:py-18">
          <h2 className="font-serif text-[27px] leading-tight font-bold text-ink sm:text-[32px]">
            In Ihren Farben, auf Ihrer Domain
          </h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
            Probieren Sie es aus: Die Umschaltung unten ändert das Erscheinungsbild der gesamten Demo. In einem
            echten Projekt kommen Schrift, Farben und Tonalität aus Ihrem Styleguide.
          </p>
          <p className="mt-4 text-[13.5px] text-ink-mute">
            Die Auswahl bleibt aktiv, wenn Sie danach zur Leser-Demo wechseln.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {alternativeThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  applyTheme(t)
                  setTheme(t.id)
                }}
                className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-[14px] font-medium transition-colors ${
                  theme === t.id ? 'border-brand bg-paper text-ink' : 'border-line bg-paper text-ink-soft hover:border-line-strong'
                }`}
              >
                <span className="flex gap-1">
                  <span className="h-4 w-4 rounded-full" style={{ background: t.brand }} />
                  <span className="h-4 w-4 rounded-full" style={{ background: t.cta }} />
                </span>
                {t.name}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                t: 'Als eigene Unterseite',
                d: 'ihre-domain.de/kaufberater – die schnellste Variante, ohne Eingriff in Ihr CMS.',
              },
              {
                t: 'Eingebettet im Artikel',
                d: 'Ein Skript-Tag an der Stelle, an der Ihre Leser heute abspringen. Passt sich der Breite an.',
              },
              {
                t: 'Verlinkt aus Video und Newsletter',
                d: 'Ein Link in der Videobeschreibung. Ergebnisse sind teilbar, weil alle Angaben in der URL stehen.',
              },
            ].map((c) => (
              <div key={c.t} className="rounded-xl border border-line bg-paper p-5">
                <p className="font-serif text-[18px] font-bold text-ink">{c.t}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{c.d}</p>
              </div>
            ))}
          </div>

          <pre className="mt-6 overflow-x-auto rounded-xl border border-line bg-ink p-5 text-[13px] leading-relaxed text-white/90">
            <code>{`<div id="kaufberater"></div>
<script src="https://cdn.passform.tools/v1/embed.js"
        data-portal="ihre-domain"
        data-kategorie="buerostuhl"></script>`}</code>
          </pre>
        </WideContainer>
      </div>

      {/* Ehrlichkeit */}
      <WideContainer className="py-14 sm:py-18">
        <h2 className="font-serif text-[27px] leading-tight font-bold text-ink sm:text-[32px]">
          Was diese Demo bewusst nicht kann
        </h2>
        <ul className="mt-6 max-w-3xl space-y-3.5">
          {NOT_BUILT.map((t) => (
            <li key={t} className="flex items-start gap-3 text-[15.5px] leading-relaxed text-ink-soft">
              <span className="mt-1 shrink-0 text-ink-mute">
                <Icon name="x" className="h-4 w-4" />
              </span>
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-[15.5px] leading-relaxed text-ink">
          Was die Demo kann, ist die einzige Frage beantworten, die vorher zählt: Ergibt so ein Werkzeug für
          Ihre Leser Sinn?
        </p>

        <div className="mt-10 rounded-2xl border border-brand-line bg-brand-soft p-6 sm:p-8">
          <h3 className="font-serif text-[23px] font-bold text-brand sm:text-[26px]">
            Wir bauen eine Version mit Ihren Daten
          </h3>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-ink-soft">
            Schicken Sie uns eine Ihrer bestehenden Vergleichsseiten. Wir bauen den Kaufberater mit Ihren
            Produkten, Ihren Testnoten und Ihren Farben – zum Ansehen, unverbindlich, bevor irgendetwas
            vereinbart wird.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="cta" size="lg" href="mailto:hallo@passform.tools?subject=Kaufberater%20mit%20unseren%20Daten">
              Seite einreichen
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/')}>
              Zurück zur Leser-Demo
            </Button>
          </div>
        </div>
      </WideContainer>
    </div>
  )
}

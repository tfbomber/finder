import { buerostuhl } from '../categories/buerostuhl'
import { AdvisorTeaser } from '../components/AdvisorTeaser'
import { ChairFigure } from '../components/ChairFigure'
import { Badge, Container, Icon } from '../components/ui'
import { eur, grade, num, word, Word } from '../lib/format'

const all = buerostuhl.products
const count = all.length
const minPrice = Math.min(...all.map((p) => p.priceEur))
const maxPrice = Math.max(...all.map((p) => p.priceEur))

const topList = buerostuhl.products
  .filter((p) => p.listRank !== undefined)
  .sort((a, b) => (a.listRank ?? 9) - (b.listRank ?? 9))

export function ArticlePage() {
  return (
    <Container className="pt-8 pb-4">
      <article>
        <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-cta uppercase">
          Bürostuhl-Test · Homeoffice
        </p>
        <h1 className="font-serif text-[32px] leading-[1.14] font-bold text-ink sm:text-[42px]">
          Die besten Bürostühle fürs Homeoffice 2026
        </h1>
        <p className="mt-4 font-serif text-[19px] leading-relaxed text-ink-soft sm:text-[21px]">
          {Word(count)} Modelle zwischen {num(minPrice)} und {num(maxPrice)} Euro, jedes davon vier Wochen im
          echten Arbeitsalltag. {Word(topList.length)} schaffen es in unsere Empfehlungsliste – welches davon
          für dich das richtige ist, hängt allerdings von dir ab.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-3 text-[13px] text-ink-mute">
          <span className="font-medium text-ink-soft">Von Kathrin Vogt & Micha Reinders</span>
          <span aria-hidden>·</span>
          <span>Aktualisiert am 4. September 2026</span>
          <span aria-hidden>·</span>
          <span>Lesezeit 11 Minuten</span>
        </div>

        <div className="mt-8 space-y-5 text-[17px] leading-[1.75] text-ink">
          <p>
            Ein guter Bürostuhl ist die einzige Anschaffung im Homeoffice, die man acht Stunden am Tag am
            eigenen Körper spürt. Trotzdem wird er meistens nach zwei Kriterien gekauft: Preis und Aussehen.
            Beides sagt wenig darüber aus, ob man nach einem Arbeitstag noch aufrecht steht.
          </p>
          <p>
            Wir haben deshalb {word(count)} Stühle beschafft, sie in unserer Redaktion und bei acht Testpersonen
            zwischen 1,58 m und 1,96 m eingesetzt und nach denselben Kriterien bewertet: Verstellbarkeit,
            Rückenunterstützung, Sitzklima, Verarbeitung und Langzeitkomfort. Das Ergebnis ist keine
            Rangliste mit einem einzigen Gewinner. Es ist eine Liste mit {word(topList.length)} Empfehlungen – und der
            wichtigsten Erkenntnis aus vier Wochen Test:
          </p>
          <p className="border-l-3 border-brand py-1 pl-5 font-serif text-[21px] leading-snug font-semibold text-brand">
            Der beste Stuhl im Test ist selten der beste Stuhl für dich. Entscheidend sind deine Körpergröße,
            dein Gewicht und wie lange du wirklich sitzt.
          </p>
        </div>

        <AdvisorTeaser />

        <h2 className="mt-12 font-serif text-[26px] font-bold text-ink sm:text-[30px]">
          Unsere Empfehlungen auf einen Blick
        </h2>
        <p className="mt-3 text-[15px] text-ink-soft">
          {Word(topList.length)} von {word(count)} Modellen haben es in die Liste geschafft. Die Reihenfolge
          ist unser Gesamturteil – nicht automatisch die Reihenfolge für deinen Rücken.
        </p>

        <ol className="mt-6 space-y-3">
          {topList.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-4 rounded-xl border border-line bg-paper p-4 transition-colors hover:border-line-strong"
            >
              <div className="flex w-10 shrink-0 flex-col items-center">
                <span className="font-serif text-[22px] leading-none font-bold text-brand">
                  {p.listRank}
                </span>
              </div>
              <ChairFigure product={p} className="h-16 w-14 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15.5px] font-semibold text-ink">
                    {p.brand} {p.model}
                  </p>
                  {p.listRank === 1 && <Badge tone="brand">Testsieger</Badge>}
                </div>
                <p className="mt-0.5 truncate text-[13.5px] text-ink-soft">{p.tagline}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[15px] font-semibold text-ink">{eur(p.priceEur)}</p>
                <p className="text-[12.5px] text-ink-mute">Note {grade(p.grade)}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 space-y-5 text-[17px] leading-[1.75] text-ink">
          <h2 className="pt-2 font-serif text-[26px] font-bold text-ink sm:text-[30px]">
            Warum diese Liste allein nicht reicht
          </h2>
          <p>
            Unser Testsieger, der Nordsitz Aeris 300, ist für Körpergrößen zwischen 168 und 195 cm freigegeben.
            Wer 1,63 m groß ist, sitzt darauf dauerhaft zu hoch – egal wie gut die Note ist. Der beliebte
            Officio Mesh One ist bis 100 kg zugelassen und für sechs Stunden täglich ausgelegt. Für einen
            Vollzeit-Arbeitstag ist er damit schlicht das falsche Werkzeug, auch wenn er sich hunderttausendfach
            verkauft.
          </p>
          <p>
            Das sind keine Feinheiten. Es sind Herstellerangaben, an denen eine Kaufentscheidung scheitert oder
            gelingt. Genau deshalb haben wir unsere Testdaten in einen Kaufberater überführt: Er stellt die sechs
            Fragen, die wir sonst in jeder zweiten Leser-E-Mail beantworten, und gleicht die Antworten mit
            unseren Messwerten ab.
          </p>
        </div>

        <AdvisorTeaser variant="inline" />

        <div className="mt-10 space-y-5 text-[17px] leading-[1.75] text-ink">
          <h2 className="pt-2 font-serif text-[26px] font-bold text-ink sm:text-[30px]">So haben wir getestet</h2>
          <p>
            Alle Stühle wurden von uns selbst gekauft, aufgebaut und über vier Wochen von wechselnden
            Testpersonen genutzt. Bewertet wurden fünf Bereiche: Verstellbarkeit der Mechanik, Qualität der
            Rückenunterstützung, Sitzklima nach sechs Stunden, Verarbeitung und Ersatzteilverfügbarkeit. Aus
            diesen Bereichen entsteht die Ergonomie-Wertung von 0 bis 100, die auch der Kaufberater verwendet.
          </p>
          <p className="rounded-xl border border-line bg-paper-warm p-5 text-[15px] leading-relaxed text-ink-soft">
            <span className="mr-1.5 inline-block align-[-2px] text-ink-mute">
              <Icon name="info" />
            </span>
            <strong className="font-semibold text-ink">Hinweis zu dieser Demo:</strong> Alle {count} Produkte,
            Marken und Messwerte auf dieser Seite sind erfunden. Sie zeigen, wie ein Kaufberater mit
            den echten Testdaten einer Redaktion arbeiten würde.
          </p>
        </div>
      </article>
    </Container>
  )
}

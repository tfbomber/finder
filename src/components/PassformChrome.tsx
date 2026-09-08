import { Link } from '../lib/router'
import { WideContainer } from './ui'

/**
 * Eigene Kopf- und Fußzeile für die Publisher-Seite. Wichtig für die
 * Verständlichkeit: die Leser-Demo traegt die Marke des Portals,
 * die Vertriebsseite unsere. Beides zu mischen verwirrt beide Zielgruppen.
 */
export function PassformHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <WideContainer className="flex items-center justify-between gap-4 py-4">
        <Link to="/fuer-publisher" className="flex items-baseline gap-2.5">
          <span className="font-serif text-[21px] leading-none font-bold text-ink">Passform</span>
          <span className="hidden text-[12px] text-ink-mute sm:inline">
            Kaufberater für Vergleichsportale
          </span>
        </Link>
        <Link
          to="/"
          className="shrink-0 rounded-lg border border-line-strong px-3.5 py-2 text-[13px] font-semibold text-ink hover:bg-paper-warm"
        >
          Zur Leser-Demo
        </Link>
      </WideContainer>
    </header>
  )
}

export function PassformFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-paper">
      <WideContainer className="flex flex-col gap-2 py-8 text-[12.5px] text-ink-mute sm:flex-row sm:items-center sm:justify-between">
        <p>Passform · Kaufberater-Technologie für Vergleichsportale und Testredaktionen</p>
        <a href="mailto:hallo@passform.tools" className="underline underline-offset-2 hover:text-ink">
          hallo@passform.tools
        </a>
      </WideContainer>
    </footer>
  )
}

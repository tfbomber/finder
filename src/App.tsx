import { useEffect } from 'react'
import { DemoRibbon, SiteFooter, SiteHeader } from './components/SiteChrome'
import { PassformFooter, PassformHeader } from './components/PassformChrome'
import { ArticlePage } from './pages/ArticlePage'
import { AdvisorPage } from './pages/AdvisorPage'
import { ResultPage } from './pages/ResultPage'
import { PublisherPage } from './pages/PublisherPage'
import { useRoute } from './lib/router'

const TITLES: Record<string, string> = {
  '/': 'Die besten Buerostuehle fuers Homeoffice 2026',
  '/berater': 'Kaufberater Buerostuhl',
  '/berater/ergebnis': 'Deine persoenliche Empfehlung',
  '/fuer-publisher': 'Passform - Kaufberater fuer Vergleichsportale',
}

export default function App() {
  const { path } = useRoute()

  useEffect(() => {
    document.title = `${TITLES[path] ?? 'Sitzkompass'} | Sitzkompass`
  }, [path])

  // Die Publisher-Seite traegt bewusst unsere eigene Marke, nicht die des Portals.
  if (path === '/fuer-publisher') {
    return (
      <div className="flex min-h-screen flex-col">
        <PassformHeader />
        <main className="flex-1">
          <PublisherPage />
        </main>
        <PassformFooter />
      </div>
    )
  }

  let page = <ArticlePage />
  if (path === '/berater') page = <AdvisorPage />
  else if (path === '/berater/ergebnis') page = <ResultPage />

  return (
    <div className="flex min-h-screen flex-col">
      <DemoRibbon />
      <SiteHeader />
      <main className="flex-1">{page}</main>
      <SiteFooter />
    </div>
  )
}

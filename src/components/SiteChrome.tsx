import { useEffect, useState } from 'react'
import { publisher } from '../config/publisher'
import { Link } from '../lib/router'
import { WideContainer } from './ui'

const NAV = [
  { label: 'Bürostühle', to: '/' },
  { label: 'Schreibtische', to: '/' },
  { label: 'Ratgeber', to: '/' },
  { label: 'Über uns', to: '/' },
]

export function DemoRibbon() {
  const [open, setOpen] = useState(true)
  useEffect(() => {
    if (sessionStorage.getItem('ribbon-closed') === '1') setOpen(false)
  }, [])
  if (!open) return null
  return (
    <div className="bg-brand text-white/95">
      <WideContainer className="flex items-center gap-3 py-2 text-[13px]">
        <span className="hidden shrink-0 rounded-sm bg-white/15 px-1.5 py-0.5 text-[10px] font-bold tracking-[0.12em] uppercase sm:inline">
          Demo
        </span>
        <p className="min-w-0 flex-1 leading-snug">
          Beispielseite eines Testportals.{' '}
          <span className="text-white/70">So sieht der Kaufberater im eigenen Layout aus.</span>
        </p>
        <Link
          to="/fuer-publisher"
          className="shrink-0 font-semibold whitespace-nowrap text-white underline underline-offset-4 hover:text-white/80"
        >
          Für Publisher
        </Link>
        <button
          aria-label="Hinweis schließen"
          className="shrink-0 px-1 text-white/60 hover:text-white"
          onClick={() => {
            sessionStorage.setItem('ribbon-closed', '1')
            setOpen(false)
          }}
        >
          ✕
        </button>
      </WideContainer>
    </div>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper">
      <WideContainer className="flex h-15 items-center justify-between gap-4 py-3">
        <Link to="/" className="group flex min-w-0 items-baseline gap-2">
          <span className="font-serif text-[21px] leading-none font-bold text-brand">{publisher.name}</span>
          <span className="hidden truncate text-[12px] text-ink-mute lg:inline">{publisher.claim}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-[14px] text-ink-soft md:flex">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} className="whitespace-nowrap hover:text-brand">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/berater"
          className="shrink-0 rounded-lg bg-brand-soft px-3 py-2 text-[13px] font-semibold text-brand hover:bg-brand hover:text-white"
        >
          Kaufberater
        </Link>
      </WideContainer>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-paper-warm">
      <WideContainer className="py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-[18px] font-bold text-brand">{publisher.name}</p>
            <p className="mt-1 text-[13px] text-ink-soft">
              {publisher.claim}. Wir kaufen alle Testgeräte selbst und sitzen jedes Modell mindestens vier Wochen
              im Alltag.
            </p>
          </div>
          <div className="flex gap-10 text-[13px] text-ink-soft">
            <ul className="space-y-1.5">
              <li>Testverfahren</li>
              <li>Redaktion</li>
              <li>Kontakt</li>
            </ul>
            <ul className="space-y-1.5">
              <li>Impressum</li>
              <li>Datenschutz</li>
              <li>
                <Link to="/fuer-publisher" className="underline underline-offset-2 hover:text-brand">
                  Kaufberater-Technologie
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-line pt-5 text-[12px] leading-relaxed text-ink-mute">
          Demo-Anwendung. {publisher.name} ist ein fiktives Testportal, alle Produkte und Messwerte sind
          Beispieldaten. Kaufberater-Technologie von{' '}
          <Link to="/fuer-publisher" className="font-semibold underline underline-offset-2 hover:text-brand">
            Passform
          </Link>
          .
        </p>
      </WideContainer>
    </footer>
  )
}

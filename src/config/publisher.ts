/**
 * White-Label-Konfiguration.
 *
 * Das ist die einzige Datei, die pro Kunde angefasst wird. Farben, Name,
 * Tonalität und Links kommen vom Publisher – der Kaufberater sieht danach
 * aus wie ein Teil seiner Seite, nicht wie ein fremdes Widget.
 */
export interface PublisherConfig {
  name: string
  claim: string
  /** kurzer Domain-artiger Zusatz in der Kopfzeile */
  domain: string
  brand: string
  brandSoft: string
  brandLine: string
  cta: string
  ctaHover: string
  /** Beschriftung des Affiliate-Buttons */
  shopCtaLabel: string
  /** Beschriftung des Links zurück in den eigenen Testbericht */
  contentCtaLabel: string
  affiliateDisclosure: string
}

export const publisher: PublisherConfig = {
  name: 'Sitzkompass',
  claim: 'Unabhängige Bürostuhl-Tests seit 2018',
  domain: 'sitzkompass.de',
  brand: '#1c3a34',
  brandSoft: '#eef3f1',
  brandLine: '#cddbd6',
  cta: '#b4530e',
  ctaHover: '#96440b',
  shopCtaLabel: 'Preise vergleichen',
  contentCtaLabel: 'Zum ausführlichen Testbericht',
  affiliateDisclosure:
    'Die Links zu den Shops sind Affiliate-Links. Kaufst du darüber, erhalten wir eine Provision – für dich ändert sich der Preis nicht. Auf die Empfehlung hat das keinen Einfluss: Die Reihenfolge entsteht ausschließlich aus deinen Angaben und unseren Testwerten.',
}

/** Zweitthema für die Publisher-Seite: zeigt, dass alles austauschbar ist. */
export const alternativeThemes: Array<{ id: string; name: string; brand: string; brandSoft: string; brandLine: string; cta: string; ctaHover: string }> = [
  {
    id: 'sitzkompass',
    name: 'Sitzkompass',
    brand: '#1c3a34',
    brandSoft: '#eef3f1',
    brandLine: '#cddbd6',
    cta: '#b4530e',
    ctaHover: '#96440b',
  },
  {
    id: 'blau',
    name: 'Redaktionsblau',
    brand: '#17335c',
    brandSoft: '#eef2f8',
    brandLine: '#cbd7e8',
    cta: '#1d6fa5',
    ctaHover: '#175a86',
  },
  {
    id: 'rot',
    name: 'Magazinrot',
    brand: '#7a1f24',
    brandSoft: '#fbeff0',
    brandLine: '#eccdd0',
    cta: '#b03a3a',
    ctaHover: '#8f2e2e',
  },
  {
    id: 'anthrazit',
    name: 'Anthrazit',
    brand: '#26262a',
    brandSoft: '#f2f2f3',
    brandLine: '#d8d8db',
    cta: '#4f6b2a',
    ctaHover: '#3e5421',
  },
]

const THEME_KEY = 'passform-theme'

export function applyTheme(t: (typeof alternativeThemes)[number], persist = true) {
  const r = document.documentElement.style
  r.setProperty('--publisher-brand', t.brand)
  r.setProperty('--publisher-brand-soft', t.brandSoft)
  r.setProperty('--publisher-brand-line', t.brandLine)
  r.setProperty('--publisher-cta', t.cta)
  r.setProperty('--publisher-cta-hover', t.ctaHover)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t.brand)
  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, t.id)
    } catch {
      /* Privatmodus – dann gilt eben das Standardthema */
    }
  }
}

/** Beim Start das zuletzt gewaehlte Portal-Branding wiederherstellen. */
export function restoreTheme(): string {
  let id = 'sitzkompass'
  try {
    id = localStorage.getItem(THEME_KEY) ?? id
  } catch {
    /* ignorieren */
  }
  const t = alternativeThemes.find((x) => x.id === id)
  if (t && t.id !== 'sitzkompass') applyTheme(t, false)
  return t?.id ?? 'sitzkompass'
}

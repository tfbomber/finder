import type { Answers, CategoryLogic, Product } from '../../domain/types'
import { grade, num } from '../../lib/format'

/* ------------------------------------------------------------------ *
 * Antworten -> Zahlen. Bewusst konservativ: bei Spannen rechnen wir
 * mit dem ungünstigeren Ende, damit keine Empfehlung "gerade so" passt.
 * ------------------------------------------------------------------ */

const HEIGHT: Record<string, { rep: number; label: string }> = {
  u165: { rep: 163, label: 'unter 165 cm' },
  '165_178': { rep: 172, label: '165–178 cm' },
  '179_190': { rep: 185, label: '179–190 cm' },
  ue190: { rep: 194, label: 'über 190 cm' },
}

const WEIGHT: Record<string, { upper: number; label: string }> = {
  u80: { upper: 80, label: 'bis 80 kg' },
  '80_100': { upper: 100, label: '80–100 kg' },
  '100_120': { upper: 120, label: '100–120 kg' },
  ue120: { upper: 135, label: 'über 120 kg' },
}

const HOURS: Record<string, { typical: number; label: string }> = {
  u3: { typical: 3, label: 'bis 3 Std.' },
  '3_6': { typical: 6, label: '3–6 Std.' },
  '6_9': { typical: 8, label: '6–9 Std.' },
  ue9: { typical: 10, label: 'mehr als 9 Std.' },
}

const BUDGET: Record<string, { max: number; label: string }> = {
  u250: { max: 250, label: 'bis 250 €' },
  '250_450': { max: 450, label: 'bis 450 €' },
  '450_700': { max: 700, label: 'bis 700 €' },
  ue700: { max: 99999, label: 'offen' },
}

const BACK_LABEL: Record<string, string> = {
  keine: 'keine Beschwerden',
  verspannung: 'gelegentliche Verspannungen',
  schmerzen: 'regelmäßige Rückenschmerzen',
  diagnose: 'einer ärztlichen Diagnose',
}

const FEATURE_LABEL: Record<string, string> = {
  kopfstuetze: 'Kopfstütze',
  armlehnen4d: '4D-Armlehnen',
  sitztiefe: 'Sitztiefenverstellung',
  netz: 'Netzrücken',
}

export const answerMaps = { HEIGHT, WEIGHT, HOURS, BUDGET, BACK_LABEL, FEATURE_LABEL }

/* ------------------------------- helpers ------------------------------- */

const h = (a: Answers) => HEIGHT[a.groesse as string] ?? HEIGHT['165_178']
const w = (a: Answers) => WEIGHT[a.gewicht as string] ?? WEIGHT['80_100']
const d = (a: Answers) => HOURS[a.dauer as string] ?? HOURS['3_6']
const b = (a: Answers) => BUDGET[a.budget as string] ?? BUDGET['250_450']
const back = (a: Answers) => (a.ruecken as string) ?? 'keine'
const musts = (a: Answers) => ((a.ausstattung as string[]) ?? []).filter((x) => x !== 'nichts')

const n = (p: Product, k: string) => p.attrs[k] as number
const s = (p: Product, k: string) => p.attrs[k] as string
const clamp = (x: number) => Math.max(0, Math.min(1, x))

function hasFeature(p: Product, f: string): boolean {
  switch (f) {
    case 'kopfstuetze':
      return p.attrs.headrest === true
    case 'armlehnen4d':
      return s(p, 'armrests') === '4D'
    case 'sitztiefe':
      return p.attrs.seatDepthAdjust === true
    case 'netz':
      return s(p, 'material') === 'netz'
    default:
      return true
  }
}

/* -------------------------------- Logik -------------------------------- */

export const logic: CategoryLogic = {
  hardRules: [
    {
      id: 'koerpergroesse',
      label:
        'Der Stuhl muss für die Körpergröße des Lesers freigegeben sein. Außerhalb des Bereichs reichen die Verstellwege nicht aus.',
      test: (p, a) => {
        const u = h(a)
        if (u.rep >= n(p, 'heightMinCm') && u.rep <= n(p, 'heightMaxCm')) return { ok: true }
        const zu = u.rep < n(p, 'heightMinCm') ? 'zu groß' : 'zu klein'
        return {
          ok: false,
          reason: `Freigegeben für ${n(p, 'heightMinCm')}–${n(p, 'heightMaxCm')} cm. Für ${u.label} ist der Stuhl ${zu} dimensioniert.`,
        }
      },
    },
    {
      id: 'belastbarkeit',
      label:
        'Die Herstellerfreigabe muss das Gewicht des Lesers abdecken – ohne Ausnahme, auch nicht knapp.',
      test: (p, a) => {
        const u = w(a)
        if (n(p, 'maxLoadKg') >= u.upper) return { ok: true }
        return {
          ok: false,
          reason: `Nur bis ${n(p, 'maxLoadKg')} kg freigegeben. Bei ${u.label} raten wir davon ab.`,
        }
      },
    },
    {
      id: 'nutzungsdauer',
      label:
        'Die vom Hersteller freigegebene tägliche Nutzungsdauer muss zur Sitzdauer des Lesers passen.',
      test: (p, a) => {
        const u = d(a)
        if (n(p, 'dailyHoursMax') >= u.typical) return { ok: true }
        return {
          ok: false,
          reason: `Ausgelegt für maximal ${n(p, 'dailyHoursMax')} Std. am Tag. Bei ${u.label} täglich ist das zu wenig.`,
        }
      },
    },
    {
      id: 'ausstattung',
      label:
        'Als Pflicht markierte Ausstattung ist ein Ausschlusskriterium – unabhängig von der Testnote.',
      test: (p, a) => {
        const missing = musts(a).filter((f) => !hasFeature(p, f))
        if (missing.length === 0) return { ok: true }
        return {
          ok: false,
          reason: `Ohne ${missing.map((m) => FEATURE_LABEL[m]).join(' und ')} – von dir als Pflicht markiert.`,
        }
      },
    },
    {
      id: 'rueckenhalt',
      label:
        'Bei regelmäßigen Beschwerden oder ärztlicher Diagnose muss die Lordosenstütze verstellbar sein.',
      test: (p, a) => {
        const r = back(a)
        if (r !== 'schmerzen' && r !== 'diagnose') return { ok: true }
        if (s(p, 'lumbar') === 'verstellbar') return { ok: true }
        return {
          ok: false,
          reason: `Die Lordosenstütze ist fest verbaut. Bei ${BACK_LABEL[r]} empfehlen wir ausschließlich verstellbare Modelle.`,
        }
      },
    },
    {
      id: 'budget',
      label:
        'Das Budget ist eine harte Grenze. Teurere Modelle zeigen wir separat, nie als Hauptempfehlung.',
      test: (p, a) => {
        const u = b(a)
        if (p.priceEur <= u.max) return { ok: true }
        return { ok: false, reason: `Kostet ${num(p.priceEur)} € und liegt damit über deinem Budget (${u.label}).` }
      },
    },
  ],

  criteria: [
    {
      id: 'ergonomie',
      label: 'Ergonomie-Wertung aus unserem Test',
      weight: (a) => {
        let x = 1
        if (d(a).typical >= 9) x += 1
        else if (d(a).typical >= 6) x += 0.5
        if (back(a) === 'schmerzen') x += 0.5
        if (back(a) === 'diagnose') x += 1
        return x
      },
      score: (p) => n(p, 'ergoScore') / 100,
      pro: (p) =>
        `Ergonomie-Wertung ${n(p, 'ergoScore')} von 100 in unserem Test – Gesamtnote ${grade(p.grade)}.`,
      caveat: (p) =>
        `Ergonomisch nur Mittelfeld (${n(p, 'ergoScore')} von 100). Für kurze Sitzeinheiten reicht das, für lange nicht.`,
    },
    {
      id: 'rueckenunterstuetzung',
      label: 'Verstellbare Rückenunterstützung',
      weight: (a) =>
        ({ keine: 0.6, verspannung: 1.2, schmerzen: 2.2, diagnose: 2.8 })[back(a)] ?? 1,
      score: (p) => {
        const l = s(p, 'lumbar')
        const base = l === 'verstellbar' ? 0.78 : l === 'fest' ? 0.3 : 0
        return base + (p.attrs.seatDepthAdjust ? 0.22 : 0)
      },
      pro: (p, a) => {
        const bits = ['verstellbare Lordosenstütze']
        if (p.attrs.seatDepthAdjust) bits.push('Sitztiefenverstellung')
        const r = back(a)
        const tail =
          r === 'keine'
            ? 'So bleibt es auch dabei.'
            : `Genau die zwei Punkte, die bei ${BACK_LABEL[r]} den Unterschied machen.`
        return `${bits.join(' und ')}. ${tail}`
      },
      caveat: (p) =>
        s(p, 'lumbar') !== 'verstellbar'
          ? 'Die Lordosenstütze sitzt fest – sie lässt sich nicht auf deine Wirbelsäule einstellen.'
          : 'Ohne Sitztiefenverstellung. Bei sehr langen oder sehr kurzen Oberschenkeln kann das stören.',
    },
    {
      id: 'passung',
      label: 'Passung zur Körpergröße',
      weight: () => 1.6,
      score: (p, a) => {
        const u = h(a).rep
        const lo = n(p, 'heightMinCm')
        const hi = n(p, 'heightMaxCm')
        const mid = (lo + hi) / 2
        const half = (hi - lo) / 2 || 1
        return clamp(1 - Math.abs(u - mid) / half)
      },
      pro: (p, a) =>
        `Bei ${h(a).label} sitzt du mitten im Freigabebereich (${n(p, 'heightMinCm')}–${n(p, 'heightMaxCm')} cm).`,
      caveat: (p, a) =>
        `Mit ${h(a).label} liegst du am Rand des Freigabebereichs (${n(p, 'heightMinCm')}–${n(p, 'heightMaxCm')} cm). Sitzhöhe unbedingt vor dem Kauf prüfen.`,
    },
    {
      id: 'reserve',
      label: 'Reserve bei der Belastbarkeit',
      weight: (a) => (w(a).upper >= 100 ? 1.4 : 0.8),
      score: (p, a) => clamp((n(p, 'maxLoadKg') - w(a).upper) / 45),
      pro: (p, a) =>
        `Bis ${n(p, 'maxLoadKg')} kg freigegeben – deutliche Reserve bei ${w(a).label}. Mechanik und Polster halten länger.`,
      caveat: (p, a) =>
        `Nur ${n(p, 'maxLoadKg')} kg Belastbarkeit. Bei ${w(a).label} sitzt du nah am Limit, das geht auf die Haltbarkeit.`,
    },
    {
      id: 'dauereinsatz',
      label: 'Freigabe für die tägliche Sitzdauer',
      weight: (a) => (d(a).typical >= 9 ? 1.8 : d(a).typical >= 6 ? 1.2 : 0.5),
      score: (p, a) => clamp((n(p, 'dailyHoursMax') - d(a).typical) / 5 + 0.2),
      pro: (p, a) =>
        n(p, 'dailyHoursMax') >= 24
          ? `Als 24-Stunden-Stuhl zertifiziert. Deine ${d(a).label} täglich sind für ihn Teillast.`
          : `Für ${n(p, 'dailyHoursMax')} Std. täglich freigegeben – deine ${d(a).label} deckt er mit Reserve ab.`,
      caveat: (p, a) =>
        `Herstellerfreigabe: ${n(p, 'dailyHoursMax')} Std. pro Tag. Bei ${d(a).label} ist das knapp bemessen.`,
    },
    {
      id: 'preisleistung',
      label: 'Preis-Leistungs-Verhältnis',
      weight: (a) => (b(a).max <= 250 ? 2 : b(a).max <= 450 ? 1.5 : b(a).max <= 700 ? 0.9 : 0.4),
      score: (p) => clamp((n(p, 'ergoScore') / p.priceEur - 0.08) / 0.2),
      pro: (p) => `${num(p.priceEur)} € für Testnote ${grade(p.grade)} – in dieser Preisklasse stark.`,
      caveat: (p) =>
        `${num(p.priceEur)} € sind viel Geld. Du zahlst hier auch für Ausstattung, die du laut deinen Angaben nicht zwingend brauchst.`,
    },
    {
      id: 'sitzklima',
      label: 'Sitzklima',
      weight: (a) => (d(a).typical >= 6 ? 0.7 : 0.3),
      score: (p) =>
        ({ netz: 1, polster: 0.62, kunstleder: 0.25, leder: 0.45 })[s(p, 'material')] ?? 0.5,
      pro: () => 'Netzrücken – bleibt auch nach Stunden luftig.',
      caveat: (p) =>
        s(p, 'material') === 'kunstleder'
          ? 'Kunstleder wird bei langen Sitzungen spürbar warm.'
          : null,
    },
  ],
}

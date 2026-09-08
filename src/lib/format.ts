const de = new Intl.NumberFormat('de-DE')

export const num = (n: number) => de.format(n)
export const grade = (g: number) => g.toFixed(1).replace('.', ',')
export const eur = (n: number) => `${de.format(n)} €`

const WORDS: Record<number, string> = {
  1: 'ein',
  2: 'zwei',
  3: 'drei',
  4: 'vier',
  5: 'fünf',
  6: 'sechs',
  7: 'sieben',
  8: 'acht',
  9: 'neun',
  10: 'zehn',
  11: 'elf',
  12: 'zwölf',
  13: 'dreizehn',
  14: 'vierzehn',
  15: 'fünfzehn',
  16: 'sechzehn',
  17: 'siebzehn',
  18: 'achtzehn',
  19: 'neunzehn',
  20: 'zwanzig',
}

/** Zahlwort fuer Fliesstext, mit Ziffern als Rueckfallebene. */
export const word = (n: number) => WORDS[n] ?? de.format(n)
export const Word = (n: number) => {
  const w = word(n)
  return w.charAt(0).toUpperCase() + w.slice(1)
}

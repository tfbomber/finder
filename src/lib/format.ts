const de = new Intl.NumberFormat('de-DE')

export const num = (n: number) => de.format(n)
export const grade = (g: number) => g.toFixed(1).replace('.', ',')
export const eur = (n: number) => `${de.format(n)} €`

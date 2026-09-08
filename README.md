# Passform – Personalized Buying Assistant Demo

Ein klickbarer Demo-Prototyp: Wie ein Vergleichsportal seine eigenen Testdaten
in einen persönlichen Kaufberater verwandelt.

Der Demo hat zwei Zielgruppen und deshalb zwei Ansichten:

| Route | Für wen | Zweck |
| --- | --- | --- |
| `/` | Leser | Artikelseite eines fiktiven Testportals ("Sitzkompass") mit eingebettetem Kaufberater |
| `/berater` | Leser | Sechs Fragen, eine pro Bildschirm |
| `/berater/ergebnis?...` | Leser | Empfehlung, Alternativen, Ausschlussgründe, kompletter Rechenweg |
| `/fuer-publisher` | Publisher | Die Verkaufsseite, unter eigener Marke |

## Warum das so gebaut ist

- **Keine Chat-Oberfläche.** Ein Eingabefeld erzeugt beim Publisher sofort die
  Frage, ob das System sich Produkteigenschaften ausdenkt. Ein Wizard nicht.
- **Kein Sprachmodell im Empfehlungsweg.** Die Reihenfolge entsteht aus sechs
  harten Ausschlussregeln und sieben gewichteten Kriterien über `products.ts`.
  Gleiche Eingaben ergeben immer dasselbe Ergebnis, und jede Regel ist im
  Klartext lesbar – auf der Publisher-Seite und im "Rechenweg" der Ergebnisseite.
- **Der Publisher bleibt die Marke.** Die Leser-Ansicht trägt durchgehend das
  Portal-Branding, wir stehen mit einer Zeile im Footer.
- **Antworten leben in der URL.** Ergebnis-Links sind teilbar, und ein
  Beispielfall lässt sich einem Interessenten direkt verlinken.

## Anpassung für einen konkreten Kunden

Drei Dateien, mehr nicht:

- `src/config/publisher.ts` – Name, Claim, Farben, CTA-Beschriftungen, Affiliate-Hinweis
- `src/categories/buerostuhl/products.ts` – der Produktdatensatz
- `src/categories/buerostuhl/rules.ts` – Ausschlusskriterien und Gewichtung

Eine neue Kategorie (Kaffeevollautomat, Saugroboter, …) ist ein neuer Ordner
unter `src/categories/`, der das `Category`-Interface aus `src/domain/types.ts`
erfüllt. Die Engine in `src/domain/engine.ts` kennt keine Bürostühle.

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # statisches Bundle nach dist/
```

Deployment: statisches Hosting, `vercel.json` enthält bereits das SPA-Rewrite.

## Wichtig

Alle Produkte, Marken, Messwerte, Testnoten und Redaktionsnamen in diesem
Repository sind erfunden. "Sitzkompass" ist ein fiktives Portal.

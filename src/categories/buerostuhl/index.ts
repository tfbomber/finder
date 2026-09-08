import type { Category } from '../../domain/types'
import { questions } from './questions'
import { products } from './products'
import { logic } from './rules'

export const buerostuhl: Category = {
  id: 'buerostuhl',
  noun: 'Bürostuhl',
  nounPlural: 'Bürostühle',
  advisorTitle: 'Welcher Bürostuhl passt zu dir?',
  advisorIntro:
    'Sechs Fragen, etwa 60 Sekunden. Danach siehst du aus unseren getesteten Modellen die, die zu deinem Körper und deinem Arbeitstag passen – und warum die anderen es nicht tun.',
  questions,
  products,
  logic,
  demoAnswers: {
    groesse: '179_190',
    gewicht: '80_100',
    dauer: '6_9',
    ruecken: 'verspannung',
    ausstattung: ['kopfstuetze'],
    budget: '450_700',
  },
}

export const categories: Category[] = [buerostuhl]

import type { Product } from '../domain/types'

/**
 * Bewusst eine schematische Zeichnung statt eines Produktfotos:
 * im Demo-Datensatz gibt es keine echten Produkte, und ein Platzhalterfoto
 * würde unehrlich wirken. Die Zeichnung zeigt genau die Merkmale,
 * über die der Kaufberater entscheidet.
 */
export function ChairFigure({ product, className = '' }: { product: Product; className?: string }) {
  const material = product.attrs.material as string
  const headrest = product.attrs.headrest === true
  const arms = (product.attrs.armrests as string) !== 'keine'
  const mesh = material === 'netz'
  const uid = product.id

  const shellFill = mesh ? 'var(--publisher-brand-soft)' : 'var(--publisher-brand)'
  const shellOpacity = mesh ? 1 : 0.92

  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      role="img"
      aria-label={`Schematische Darstellung ${product.brand} ${product.model}`}
    >
      <defs>
        <pattern id={`mesh-${uid}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="var(--publisher-brand)" strokeWidth="1" opacity="0.45" />
        </pattern>
      </defs>

      <g
        stroke="var(--publisher-brand)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Fußkreuz und Rollen */}
        <path d="M100 158 V192" />
        <path d="M56 198 L100 190 L146 198" />
        <circle cx="50" cy="203" r="7" fill="var(--paper)" />
        <circle cx="152" cy="203" r="7" fill="var(--paper)" />

        {/* Sitzfläche */}
        <rect x="52" y="132" width="94" height="20" rx="9" fill={shellFill} opacity={shellOpacity} />
        {mesh && <rect x="52" y="132" width="94" height="20" rx="9" fill="none" />}

        {/* Rückenlehne */}
        <g transform="rotate(9 140 132)">
          <rect
            x="126"
            y={headrest ? 52 : 60}
            width="26"
            height={headrest ? 78 : 70}
            rx="12"
            fill={mesh ? `url(#mesh-${uid})` : shellFill}
            opacity={shellOpacity}
          />
          {/* Lordosenstütze */}
          {product.attrs.lumbar === 'verstellbar' && (
            <rect x="121" y="104" width="10" height="20" rx="5" fill="var(--publisher-cta)" stroke="none" />
          )}
          {headrest && <rect x="127" y="28" width="24" height="18" rx="8" fill={shellFill} opacity={shellOpacity} />}
          {headrest && <path d="M139 46 V52" />}
        </g>

        {/* Armlehne */}
        {arms && <path d="M120 132 V116 H88" />}
      </g>
    </svg>
  )
}

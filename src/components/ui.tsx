import type { ReactNode } from 'react'

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[720px] px-5 ${className}`}>{children}</div>
}

export function WideContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1040px] px-5 ${className}`}>{children}</div>
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-ink-mute uppercase">{children}</p>
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'brand' | 'good' | 'warn' | 'bad'
}) {
  const tones = {
    neutral: 'bg-paper-warm text-ink-soft border-line',
    brand: 'bg-brand-soft text-brand border-brand-line',
    good: 'bg-good-soft text-good border-transparent',
    warn: 'bg-warn-soft text-warn border-transparent',
    bad: 'bg-bad-soft text-bad border-transparent',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] leading-none font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

type BtnProps = {
  children: ReactNode
  onClick?: () => void
  href?: string
  variant?: 'cta' | 'brand' | 'outline' | 'ghost'
  size?: 'md' | 'lg'
  full?: boolean
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}

export function Button({
  children,
  onClick,
  href,
  variant = 'brand',
  size = 'md',
  full,
  className = '',
  disabled,
  type = 'button',
}: BtnProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 select-none disabled:opacity-45 disabled:cursor-not-allowed'
  const sizes = { md: 'px-4 py-2.5 text-[15px]', lg: 'px-5 py-3.5 text-[16px]' }
  const variants = {
    cta: 'bg-cta text-white hover:bg-cta-hover',
    brand: 'bg-brand text-white hover:opacity-90',
    outline: 'border border-line-strong bg-paper text-ink hover:bg-paper-warm',
    ghost: 'text-brand hover:bg-brand-soft',
  }
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`

  if (href) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer nofollow sponsored">
        {children}
      </a>
    )
  }
  return (
    <button className={cls} onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  )
}

export function Icon({ name, className = 'h-4 w-4' }: { name: string; className?: string }) {
  const paths: Record<string, ReactNode> = {
    check: <path d="M4 10.5 8 14.5 16 5.5" />,
    x: <path d="M5 5l10 10M15 5L5 15" />,
    info: (
      <>
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 9v5M10 6.2v.4" />
      </>
    ),
    arrow: <path d="M4 10h11M11 6l4 4-4 4" />,
    back: <path d="M16 10H5M9 6l-4 4 4 4" />,
    chevron: <path d="M7 4l6 6-6 6" />,
    edit: <path d="M13.5 3.5l3 3L7 16H4v-3z" />,
    external: (
      <>
        <path d="M11 4h5v5" />
        <path d="M16 4l-7 7" />
        <path d="M14 12v4H4V6h4" />
      </>
    ),
    warn: (
      <>
        <path d="M10 3.5 18 16.5H2z" />
        <path d="M10 8.5v3.2M10 14.1v.3" />
      </>
    ),
  }
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

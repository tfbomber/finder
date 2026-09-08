import { useCallback, useEffect, useState } from 'react'

export interface Route {
  path: string
  query: URLSearchParams
}

function read(): Route {
  return { path: window.location.pathname.replace(/\/+$/, '') || '/', query: new URLSearchParams(window.location.search) }
}

const EVENT = 'app:navigate'

export function navigate(to: string, opts: { replace?: boolean; keepScroll?: boolean } = {}) {
  if (opts.replace) window.history.replaceState({}, '', to)
  else window.history.pushState({}, '', to)
  window.dispatchEvent(new CustomEvent(EVENT))
  if (!opts.keepScroll) window.scrollTo({ top: 0, behavior: 'auto' })
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(read)
  const sync = useCallback(() => setRoute(read()), [])
  useEffect(() => {
    window.addEventListener('popstate', sync)
    window.addEventListener(EVENT, sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener(EVENT, sync)
    }
  }, [sync])
  return route
}

export function Link({
  to,
  children,
  className,
  onClick,
}: {
  to: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        onClick?.()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}

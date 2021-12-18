import { useEffect, useMemo, useState } from 'react'

import { css } from './styled'

const overflowCss = css`
  overflow-y: scroll;
`

/** Customizes the scrollbar for vertical overflow. */
const scrollbarCss = (padded: boolean) => css`
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 1.25em;
  }

  ::-webkit-scrollbar-thumb {
    background: radial-gradient(
        closest-corner at 0.25em 0.25em,
        ${({ theme }) => theme.interactive} 0.25em,
        transparent 0.25em
      ),
      linear-gradient(
        to bottom,
        #ffffff00 0.25em,
        ${({ theme }) => theme.interactive} 0.25em,
        ${({ theme }) => theme.interactive} calc(100% - 0.25em),
        #ffffff00 calc(100% - 0.25em)
      ),
      radial-gradient(
        closest-corner at 0.25em calc(100% - 0.25em),
        ${({ theme }) => theme.interactive} 0.25em,
        #ffffff00 0.25em
      );
    background-clip: padding-box;
    border: none;
    ${padded ? 'border-right' : 'border-left'}: 0.75em solid transparent;
  }

  @supports not selector(::-webkit-scrollbar-thumb) {
    scrollbar-color: ${({ theme }) => theme.interactive} transparent;
  }
`

interface ScrollbarOptions {
  padded?: boolean
}

export function useScrollbar(element: HTMLElement | null, { padded = false }: ScrollbarOptions = {}) {
  const [overflow, setOverflow] = useState(true)
  useEffect(() => {
    setOverflow(hasOverflow(element))
    if (element) {
      const updateOverflow = () => setOverflow(hasOverflow(element))
      element.addEventListener('transitionend', updateOverflow)
      return () => element.removeEventListener('transitionend', updateOverflow)
    }
    return
  }, [element])
  return useMemo(() => {
    return overflow ? scrollbarCss(padded) : overflowCss
  }, [overflow, padded])

  function hasOverflow(element: HTMLElement | null) {
    if (!element) {
      return true
    }
    return element.scrollHeight > element.clientHeight
  }
}
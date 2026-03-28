import { useEffect } from 'react'

export default function useScrollReveal() {
  useEffect(() => {
    const observe = () => {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              const delay = parseFloat(en.target.style.transitionDelay || '0') * 1000
              setTimeout(() => en.target.classList.add('visible'), delay)
              io.unobserve(en.target)
            }
          })
        },
        { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
      )
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => io.observe(el))
      return io
    }

    let io = observe()

    // Throttle via rAF — batches rapid DOM mutations (e.g. card re-renders)
    // into a single re-observe per animation frame
    let rafId = null
    const mutationObserver = new MutationObserver(() => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        io.disconnect()
        io = observe()
      })
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      io.disconnect()
      mutationObserver.disconnect()
    }
  }, [])
}

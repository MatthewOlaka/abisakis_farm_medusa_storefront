"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function ShyController({ threshold = 50 }: { threshold?: number }) {
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const hide = y > lastY.current && y > threshold // scrolling down past threshold → hide
        document.documentElement.classList.toggle("nav-hidden", hide)
        lastY.current = y
        ticking.current = false
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  // Reset on route change so nav shows at the top of a new page
  const pathname = usePathname()
  useEffect(() => {
    document.documentElement.classList.remove("nav-hidden")
  }, [pathname])

  return null
}

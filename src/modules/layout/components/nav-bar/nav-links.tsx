"use client"

import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@modules/common/components/button"
import MobileMenu from "./mobile-menu"

export default function NavLinks() {
  const router = useRouter()
  const rawPath = usePathname() || "/"
  const normalize = (p: string) => (p || "/").replace(/^\/[a-z]{2}(?=\/|$)/i, "") || "/"
  const pathname = normalize(rawPath)

  // Desktop dropdown
  const [productsOpen, setProductsOpen] = useState(false)
  const productsRef = useRef<HTMLLIElement>(null)

  // Hide-on-scroll (applies to the left/center block)
  const [visible, setVisible] = useState(true)
  const last = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setVisible(!(y > last.current && y > 50))
      last.current = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close desktop dropdown on outside click
  useEffect(() => {
    if (!productsOpen) return
    const onDoc = (e: MouseEvent) => {
      if (!productsRef.current) return
      if (!productsRef.current.contains(e.target as Node)) setProductsOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [productsOpen])

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/")

  return (
    <div className={`flex items-center gap-8 transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}>
      {/* Logo */}
      {/* <LocalizedClientLink href="/" className="flex items-center gap-2">
        <div className="relative h-10 w-20">
          <Image
            src="/images/logo.png" // ensure /public/images/logo.png exists
            alt="Abisaki's Farm"
            fill
            sizes="80px"
            className="object-contain"
            priority
          />
        </div>
      </LocalizedClientLink> */}

      {/* Desktop nav */}
      <ul className="hidden items-center gap-6 md:flex">
        {/* Products dropdown */}
        <li
          className="relative"
          ref={productsRef}
          onMouseEnter={() => setProductsOpen(true)}
          onMouseLeave={() => setProductsOpen(false)}
        >
          <button
            className="flex items-center gap-1 text-sm font-medium text-gray-700 transition-colors hover:text-amber-500 focus:outline-none"
            aria-haspopup="menu"
            aria-expanded={productsOpen}
            onClick={() => setProductsOpen((v) => !v)}
            onKeyDown={(e) => e.key === "Escape" && setProductsOpen(false)}
          >
            Products
            {productsOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          <div
            className={`absolute right-0 mt-2 w-44 rounded-md bg-white p-1 shadow-xl transition-all ${
              productsOpen ? "visible opacity-100" : "invisible opacity-0"
            }`}
            role="menu"
          >
            <LocalizedClientLink
              href="/products/honey"
              role="menuitem"
              className={`block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-amber-50 hover:text-amber-600 ${
                isActive("/products/honey") ? "bg-amber-50 text-amber-600" : "text-gray-700"
              }`}
              onClick={() => setProductsOpen(false)}
            >
              Honey
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/products/coffee"
              role="menuitem"
              className={`block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-amber-50 hover:text-amber-600 ${
                isActive("/products/coffee") ? "bg-amber-50 text-amber-600" : "text-gray-700"
              }`}
              onClick={() => setProductsOpen(false)}
            >
              Coffee
            </LocalizedClientLink>
          </div>
        </li>

        {/* Other links */}
        <li>
          <LocalizedClientLink
            href="/team"
            className={`text-sm font-medium transition-colors hover:text-amber-500 ${
              isActive("/team") ? "text-amber-500" : "text-gray-700"
            }`}
          >
            Team
          </LocalizedClientLink>
        </li>
        <li>
          <LocalizedClientLink
            href="/contact"
            className={`text-sm font-medium transition-colors hover:text-amber-500 ${
              isActive("/contact") ? "text-amber-500" : "text-gray-700"
            }`}
          >
            Contact us
          </LocalizedClientLink>
        </li>

        {/* Shop CTA */}
        <li>
          <Button
            text="Shop"
            onClick={() => router.push("/shop")}
            primaryColor="bg-yellow-400"
            secondaryColor={isActive("/shop") ? "text-amber-500" : "text-green-900"}
            borderRadius="rounded-lg"
            size="small"
            wrapperClass="font-semibold"
          />
        </li>
      </ul>

      {/* Mobile menu trigger + sheet (separate component) */}
      <div className="md:hidden">
        <MobileMenu />
      </div>
    </div>
  )
}

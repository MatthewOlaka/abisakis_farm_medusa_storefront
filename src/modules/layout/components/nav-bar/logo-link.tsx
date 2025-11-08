"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"


export default function LogoLink() { 
    return(
        <LocalizedClientLink href="/" className="flex items-center gap-2">
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
      </LocalizedClientLink>
    ) 
}
import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "ke"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    throw new Error(
      "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
    )
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      next: {
        revalidate: 3600,
        tags: [`regions-${cacheId}`],
      },
      cache: "force-cache",
    }).then(async (response) => {
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.message)
      }

      return json
    })

    if (!regions?.length) {
      throw new Error(
        "No regions found. Please set up regions in your Medusa Admin."
      )
    }

    // Create a map of country codes to regions.
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? "", region)
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
      )
    }
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search, origin } = request.nextUrl

  // ⬅️ 1) Never touch Server Actions/RSC POSTs, Next assets, API, or files
  if (request.method !== "GET") return NextResponse.next()
  if (
    pathname.startsWith("/_next") ||          // root _next
    pathname.includes("/_next/") ||           // e.g. /ke/_next/...
    pathname.startsWith("/api") ||            // API routes
    /\.[a-z0-9]+$/i.test(pathname)            // any file like .css, .png, .ico
  ) {
    return NextResponse.next()
  }

  // cache id
  const cacheIdCookie = request.cookies.get("_medusa_cache_id")
  const cacheId = cacheIdCookie?.value ?? crypto.randomUUID()

  // regions → country
  const regionMap = await getRegionMap(cacheId)
  const countryCode = regionMap && (await getCountryCode(request, regionMap))

  const seg1 = pathname.split("/")[1]?.toLowerCase()
  const urlHasCountryCode = Boolean(countryCode && seg1 === countryCode)

  // ⬅️ 2) If URL already has the country but cookie missing → set cookie and continue (no redirect)
  if (urlHasCountryCode && !cacheIdCookie) {
    const res = NextResponse.next()
    res.cookies.set("_medusa_cache_id", cacheId, { maxAge: 60 * 60 * 24 })
    return res
  }

  // If URL has country and cookie exists → just continue
  if (urlHasCountryCode) {
    return NextResponse.next()
  }

  // If URL has no country but we resolved one → redirect to /{cc}/...
  if (!urlHasCountryCode && countryCode) {
    const redirectPath = pathname === "/" ? "" : pathname
    const redirectUrl = `${origin}/${countryCode}${redirectPath}${search || ""}`
    return NextResponse.redirect(redirectUrl, 307)
  }

  // No valid country available
  return new NextResponse(
    "No valid regions configured. Please set up regions with countries in your Medusa Admin.",
    { status: 500 }
  )
}

// /**
//  * Middleware to handle region selection and onboarding status.
//  */
// export async function middleware(request: NextRequest) {
//   let redirectUrl = request.nextUrl.href

//   let response = NextResponse.redirect(redirectUrl, 307)

//   let cacheIdCookie = request.cookies.get("_medusa_cache_id")

//   let cacheId = cacheIdCookie?.value || crypto.randomUUID()

//   const regionMap = await getRegionMap(cacheId)

//   const countryCode = regionMap && (await getCountryCode(request, regionMap))

//   const urlHasCountryCode =
//     countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode)

//   // if one of the country codes is in the url and the cache id is set, return next
//   if (urlHasCountryCode && cacheIdCookie) {
//     return NextResponse.next()
//   }

//   // if one of the country codes is in the url and the cache id is not set, set the cache id and redirect
//   if (urlHasCountryCode && !cacheIdCookie) {
//     response.cookies.set("_medusa_cache_id", cacheId, {
//       maxAge: 60 * 60 * 24,
//     })

//     return response
//   }

//   // check if the url is a static asset
//   if (request.nextUrl.pathname.includes(".")) {
//     return NextResponse.next()
//   }

//   const redirectPath =
//     request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname

//   const queryString = request.nextUrl.search ? request.nextUrl.search : ""

//   // If no country code is set, we redirect to the relevant region.
//   if (!urlHasCountryCode && countryCode) {
//     redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
//     response = NextResponse.redirect(`${redirectUrl}`, 307)
//   } else if (!urlHasCountryCode && !countryCode) {
//     // Handle case where no valid country code exists (empty regions)
//     return new NextResponse(
//       "No valid regions configured. Please set up regions with countries in your Medusa Admin.",
//       { status: 500 }
//     )
//   }

//   return response
// }

// New middleware function to make remove countrycode from urls

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl

//   // If URL begins with any 2-letter country (e.g. /dk, /de, /gb, /ke) → strip it from the URL
//   const m = pathname.match(/^\/([a-z]{2})(\/.*)?$/i)
//   if (m) {
//     const url = req.nextUrl.clone()
//     url.pathname = m[2] || "/"
//     // Redirect so the browser bar is clean (no /xx)
//     return NextResponse.redirect(url, 308)
//   }

//   // Otherwise, rewrite clean URLs to the Kenya pages internally.
//   // Example: /products → /ke/products (user still sees /products)
//   if (!pathname.startsWith(`/${DEFAULT_REGION}`)) {
//     const url = req.nextUrl.clone()
//     url.pathname = `/${DEFAULT_REGION}${pathname}`
//     return NextResponse.rewrite(url)
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
//   ],
// }

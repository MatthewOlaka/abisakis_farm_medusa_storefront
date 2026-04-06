'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

type LocalizedClientLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
	href: string;
};

/**
 * Use this component to create a Next.js `<Link />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
const LocalizedClientLink = ({ children, href, ...props }: LocalizedClientLinkProps) => {
	const { countryCode } = useParams<{ countryCode?: string }>();
	const normalizedHref = href.startsWith('/') ? href : `/${href}`;
	const countryPrefix =
		typeof countryCode === 'string' && countryCode.length === 2 ? `/${countryCode}` : '';

	return (
		<Link href={`${countryPrefix}${normalizedHref}`} {...props}>
			{children}
		</Link>
	);
};

export default LocalizedClientLink;

// Updated link to remove countrycode from urls
// "use client"

// import Link from "next/link"
// import React from "react"

// /**
//  * LocalizedClientLink (clean version)
//  * - Always returns a countryless path.
//  * - Still works if someone passes a localized href like "/dk/products"—we strip it.
//  */
// const LocalizedClientLink = ({
//   children,
//   href,
//   ...props
// }: {
//   children?: React.ReactNode
//   href: string
//   className?: string
//   onClick?: () => void
//   passHref?: true
//   [x: string]: any
// }) => {
//   const clean = (raw: string) => {
//     if (!raw) return "/"
//     // Leave external links and hash-only links untouched
//     if (raw.startsWith("http")) return raw
//     if (raw.startsWith("#")) return raw

//     const withLeadingSlash = raw.startsWith("/") ? raw : `/${raw}`

//     // Strip a leading "/xx" (2 letters) if present, keep the rest
//     // e.g. "/dk/products?x=1#y" -> "/products?x=1#y"
//     const stripped = withLeadingSlash.replace(/^\/[a-z]{2}(?=\/|$)/i, "")

//     return stripped === "" ? "/" : stripped
//   }

//   return (
//     <Link href={clean(href)} {...props}>
//       {children}
//     </Link>
//   )
// }

// export default LocalizedClientLink

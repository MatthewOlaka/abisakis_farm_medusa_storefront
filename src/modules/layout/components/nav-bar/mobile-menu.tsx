'use client';

import { useId, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Button } from '@modules/common/components/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

// ✅ shadcn path (matches components.json). Adjust only if you changed it.
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@lib/components/ui/sheet';

export default function MobileMenu() {
	const rawPath = usePathname() || '/';
	const normalize = (p: string) => (p || '/').replace(/^\/[a-z]{2}(?=\/|$)/i, '') || '/';
	const pathname = normalize(rawPath);
	//   const router = useRouter();

	const [open, setOpen] = useState(false);
	const [productsOpen, setProductsOpen] = useState(false);

	// 👇 Create a stable, SSR/CSR-safe id and use it for BOTH trigger & content
	const _rid = useId();
	const contentId = `mobile-menu-${_rid.replace(/[:]/g, '')}`;

	const isActive = (href: string) =>
		href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					// This mr-5 might mess up your closing button
					className="inline-flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100"
					aria-label="Toggle menu"
					aria-expanded={open}
					aria-controls={contentId}
				>
					<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
						{open ? (
							<path
								d="M18 6L6 18M6 6l12 12"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						) : (
							<path
								d="M3 6h18M3 12h18M3 18h18"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						)}
					</svg>
				</button>
			</SheetTrigger>

			<SheetContent
				id={contentId}
				side="top"
				className="right-0 mt-20 left-auto z-[998] h-auto w-[320px] max-w-[85vw] rounded-b-sm border border-t-0 bg-yellow-100 p-0 shadow-xl"
			>
				<SheetTitle className="ml-7 pt-3 text-4xl text-green-900 font-serif">Menu</SheetTitle>
				<div className="px-6 py-3">
					<ul className="space-y-1">
						{/* Products disclosure */}
						<li>
							<button
								className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-base font-medium text-gray-800 hover:bg-gray-50"
								onClick={() => setProductsOpen((v) => !v)}
								aria-expanded={productsOpen}
								aria-controls="mobile-products-submenu"
							>
								<span>Products</span>
								{productsOpen ? (
									<ChevronUp className="h-5 w-5" />
								) : (
									<ChevronDown className="h-5 w-5" />
								)}
							</button>

							{productsOpen && (
								<ul
									id="mobile-products-submenu"
									className="m-3 space-y-1 rounded-xl bg-gray-50 p-3"
								>
									<li>
										<SheetClose asChild>
											<LocalizedClientLink
												href="/products/honey"
												className={`block rounded-lg px-3 py-2 text-base font-medium text-gray-800 hover:bg-amber-50 hover:text-amber-500 ${
													isActive('/products/honey') ? 'bg-amber-50 text-amber-500' : ''
												}`}
												onClick={() => setProductsOpen(false)}
											>
												Honey
											</LocalizedClientLink>
										</SheetClose>
									</li>
									<li>
										<SheetClose asChild>
											<LocalizedClientLink
												href="/products/coffee"
												className={`block rounded-lg px-3 py-2 text-base font-medium text-gray-800 hover:bg-amber-50 hover:text-amber-500 ${
													isActive('/products/coffee') ? 'bg-amber-50 text-amber-500' : ''
												}`}
												onClick={() => setProductsOpen(false)}
											>
												Coffee
											</LocalizedClientLink>
										</SheetClose>
									</li>
								</ul>
							)}
						</li>

						{/* Other links */}
						<li>
							<SheetClose asChild>
								<LocalizedClientLink
									href="/team"
									className={`block rounded-lg px-3 py-2 text-base font-medium hover:bg-gray-50 ${
										isActive('/team') ? 'text-amber-600' : 'text-gray-800'
									}`}
								>
									Team
								</LocalizedClientLink>
							</SheetClose>
						</li>
						<li>
							<SheetClose asChild>
								<LocalizedClientLink
									href="/contact"
									className={`block rounded-lg px-3 py-2 text-base font-medium hover:bg-gray-50 ${
										isActive('/contact') ? 'text-amber-600' : 'text-gray-800'
									}`}
								>
									Contact us
								</LocalizedClientLink>
							</SheetClose>
						</li>

						{/* Shop CTA */}
						<li className="ml-3 pt-3 pb-6">
							<SheetClose asChild>
								<Button
									text="Shop"
									wrapperClass="font-semibold"
									primaryColor={isActive('/shop') ? 'bg-amber-600' : 'bg-yellow-500'}
									secondaryColor="text-green-900"
									borderRadius="rounded-lg"
									size="medium"
								/>
							</SheetClose>
						</li>
					</ul>
				</div>
			</SheetContent>
		</Sheet>
	);
}

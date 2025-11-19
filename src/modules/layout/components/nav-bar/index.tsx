import { Suspense } from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import CartButton from '@modules/layout/components/cart-button'; // server component
import NavLinks from './nav-links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faUser } from '@fortawesome/free-solid-svg-icons';
import LogoLink from './logo-link';
import ShyController from './shy-controller';

export default async function Navbar() {
	return (
		<>
			<ShyController threshold={50} />
			<div className="shy-header sticky top-0 z-[999] bg-[#fffdee]">
				<nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					{/* Left + center: your interactive client navbar */}
					<LogoLink wrapperClassname="h-10 w-20" />
					{/* Right: account (client link) + server cart button */}
					<div className="flex flex-row-reverse md:flex-row items-center gap-x-4">
						<NavLinks />
						<div className="flex gap-4 h-full">
							<LocalizedClientLink
								href="/account"
								className="text-sm font-medium transition-colors hover:text-amber-500"
								data-testid="nav-account-link"
							>
								<FontAwesomeIcon
									icon={faUser}
									className="text-2xl text-gray-700 hover:scale-125 hover:text-amber-500 transition"
								/>
								{/* <h2>account</h2> */}
							</LocalizedClientLink>

							<Suspense
								fallback={
									<LocalizedClientLink
										className="flex gap-2 text-sm font-medium"
										href="/cart"
										data-testid="nav-cart-link"
									>
										{/* Cart (0) */}
										{
											<FontAwesomeIcon
												icon={faShoppingBag}
												className="text-xl text-gray-700 hover:scale-125 hover:text-amber-500 transition"
											/>
										}
									</LocalizedClientLink>
								}
							>
								<CartButton />
							</Suspense>
						</div>
					</div>
				</nav>

				<div className="mx-auto max-w-7xl px-12 lg:px-14">
					<div className="h-px rounded-3xl bg-gray-300" />
				</div>
			</div>
		</>
	);
}

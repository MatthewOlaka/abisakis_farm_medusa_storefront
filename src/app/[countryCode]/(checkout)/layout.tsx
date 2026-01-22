import LocalizedClientLink from '@modules/common/components/localized-client-link';
// import ChevronDown from '@modules/common/icons/chevron-down';
// import MedusaCTA from '@modules/layout/components/medusa-cta';
import LogoLink from '@modules/layout/components/nav-bar/logo-link';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full flex flex-col items-center h-full bg-yellow-100 relative small:min-h-screen">
			<div className="w-full max-w-7xl flex justify-center flex-col">
				{/* <div className=""> */}
				<div className="h-16 bg-yellow-100 border-b md:mx-10 ">
					<nav className="flex h-full items-center content-container justify-between">
						<LocalizedClientLink
							href="/cart"
							className="flex flex-1 basis-0 items-center gap-x-2"
							// className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
							data-testid="back-to-cart-link"
						>
							{/* <ChevronDown className="rotate-90" size={16} /> */}
							{/* <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base ">
							Back to shopping cart
							</span>
							<span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
							Back
							</span> */}
							<span className="hidden small:block text-sm text-green-900 hover:underline decoration-2.5">
								← Back to shopping cart
							</span>
							<span className="block small:hidden text-sm text-green-900 hover:underline decoration-2.5">
								← Back
							</span>
						</LocalizedClientLink>
						{/* <LocalizedClientLink
						href="/"
						className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
						data-testid="store-link"
						>
						Medusa Store
						</LocalizedClientLink> */}
						<LogoLink wrapperClassname="h-12 w-16 md:h-16 md:w-28" />
						<div className="flex-1 basis-0" />
					</nav>
				</div>
				<div className="relative" data-testid="checkout-container">
					{children}
				</div>
				{/* <div className="py-4 w-full flex items-center justify-center">
				<MedusaCTA />
				</div> */}
			</div>
		</div>
	);
}

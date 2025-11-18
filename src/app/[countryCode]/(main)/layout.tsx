import { Metadata } from 'next';

import { listCartOptions, retrieveCart } from '@lib/data/cart';
import { retrieveCustomer } from '@lib/data/customer';
import { getBaseURL } from '@lib/util/env';
import { StoreCartShippingOption } from '@medusajs/types';
import CartMismatchBanner from '@modules/layout/components/cart-mismatch-banner';
import Footer from '@modules/layout/templates/footer';
import FreeShippingPriceNudge from '@modules/shipping/components/free-shipping-price-nudge';
import Navbar from '@modules/layout/components/nav-bar';
// import { Inter, Judson } from 'next/font/google';
// import Nav from '@modules/layout/templates/nav';
import { Inter, Judson } from 'next/font/google';
import ScrollProvider from '@modules/generic/scroll-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const judson = Judson({
	subsets: ['latin'],
	weight: ['400', '700'],
	variable: '--font-judson',
	display: 'swap',
});

export const metadata: Metadata = {
	title: "Abisaki's Farm",
	description: 'Pure Kenyan honey, coffee, and more.',
	metadataBase: new URL(getBaseURL()),
};

export default async function PageLayout(props: { children: React.ReactNode }) {
	const customer = await retrieveCustomer();
	const cart = await retrieveCart();
	let shippingOptions: StoreCartShippingOption[] = [];

	if (cart) {
		const { shipping_options } = await listCartOptions();

		shippingOptions = shipping_options;
	}

	return (
		<ScrollProvider>
			<div className={`${inter.variable} ${judson.variable} font-sans`}>
				{/* <Nav /> */}
				<Navbar />
				{customer && cart && <CartMismatchBanner customer={customer} cart={cart} />}
				{cart && (
					<FreeShippingPriceNudge variant="popup" cart={cart} shippingOptions={shippingOptions} />
				)}
				{props.children}
				<Footer />
			</div>
		</ScrollProvider>
	);
}

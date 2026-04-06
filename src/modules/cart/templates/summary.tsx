'use client';

import { Heading } from '@medusajs/ui';

import CartTotals from '@modules/common/components/cart-totals';
import Divider from '@modules/common/components/divider';
import DiscountCode from '@modules/checkout/components/discount-code';
import _LocalizedClientLink from '@modules/common/components/localized-client-link';
import { HttpTypes } from '@medusajs/types';
import { Button } from '@modules/common/components/button';
import { convertToLocale } from '@lib/util/money';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

type SummaryProps = {
	cart: HttpTypes.StoreCart & {
		promotions: HttpTypes.StorePromotion[];
	};
};

function getCheckoutStep(cart: HttpTypes.StoreCart) {
	if (!cart?.shipping_address?.address_1 || !cart.email) {
		return 'address';
	} else if (cart?.shipping_methods?.length === 0) {
		return 'delivery';
	} else {
		return 'payment';
	}
}

function WhatsAppInquiryButton({ cart }: { cart: HttpTypes.StoreCart }) {
	const message = `Hi! I'd like to order the following items:\n\n${cart.items
		?.map(
			(item) =>
				`- ${item.product_title} (x${item.quantity}) \u2014 ${cart.currency_code.toUpperCase()} ${item.unit_price}`,
		)
		.join(
			'\n',
		)}\n\nSubtotal: ${convertToLocale({ amount: cart.subtotal ?? 0, currency_code: cart.currency_code })}`;

	return (
		<a
			href={`https://wa.me/12368824656?text=${encodeURIComponent(message)}`}
			target="_blank"
			rel="noopener noreferrer"
			className="w-full"
		>
			<Button
				wrapperClass="px-6 py-2 !text-white font-semibold xs:mb-8 rounded-lg border border-green-700 w-full"
				primaryColor="bg-green-800 hover:bg-green-700"
				text="Inquire via WhatsApp"
				icon={faWhatsapp}
			/>
		</a>
	);
}

const Summary = ({ cart }: SummaryProps) => {
	const _step = getCheckoutStep(cart);

	return (
		<div className="flex flex-col gap-y-4">
			<Heading level="h2" className="text-4xl font-serif text-green-900">
				Summary
			</Heading>
			<DiscountCode cart={cart} />
			<Divider />
			<CartTotals totals={cart} />
			{/* TODO: Re-enable once checkout is complete */}
			{/* <LocalizedClientLink href={'/checkout?step=' + step} data-testid="checkout-button">
				<Button
					wrapperClass="px-6 py-2 !text-green-900 font-semibold xs:mb-8 rounded-lg border border-amber-300 w-full"
					primaryColor="bg-yellow-400 hover:bg-yellow-400/70"
					text="Go to checkout"
				/>
			</LocalizedClientLink> */}
			<WhatsAppInquiryButton cart={cart} />
		</div>
	);
};

export default Summary;

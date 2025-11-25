'use client';

import { Heading } from '@medusajs/ui';

import CartTotals from '@modules/common/components/cart-totals';
import Divider from '@modules/common/components/divider';
import DiscountCode from '@modules/checkout/components/discount-code';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { HttpTypes } from '@medusajs/types';
import { Button } from '@modules/common/components/button';

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

const Summary = ({ cart }: SummaryProps) => {
	const step = getCheckoutStep(cart);

	return (
		<div className="flex flex-col gap-y-4">
			<Heading level="h2" className="text-4xl font-serif text-green-900">
				Summary
			</Heading>
			<DiscountCode cart={cart} />
			<Divider />
			<CartTotals totals={cart} />
			<LocalizedClientLink href={'/checkout?step=' + step} data-testid="checkout-button">
				{/* <Button className="w-full h-10">Go to checkout</Button> */}
				<Button
					wrapperClass="px-6 py-2 !text-green-900 font-semibold xs:mb-8 rounded-lg border border-amber-300 w-full"
					primaryColor="bg-yellow-400 hover:bg-yellow-400/70"
					text="Go to checkout"
				/>
			</LocalizedClientLink>
		</div>
	);
};

export default Summary;

import { Heading } from '@medusajs/ui';

import ItemsPreviewTemplate from '@modules/cart/templates/preview';
import DiscountCode from '@modules/checkout/components/discount-code';
import CartTotals from '@modules/common/components/cart-totals';
import Divider from '@modules/common/components/divider';

const CheckoutSummary = ({ cart }: { cart: any }) => {
	return (
		<div className="sticky top-10 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
			<div className="w-full bg-yellow-100 flex flex-col">
				<Divider className="my-6 small:hidden" />
				<Heading
					level="h2"
					className="flex flex-row text-4xl font-serif text-green-900 font-bold items-baseline"
				>
					In your Cart
				</Heading>
				<Divider className="my-6" />
				<CartTotals totals={cart} />
				<ItemsPreviewTemplate cart={cart} />
				<div className="my-6">
					<DiscountCode cart={cart} />
				</div>
			</div>
		</div>
	);
};

export default CheckoutSummary;

import { convertToLocale } from '@lib/util/money';
import { HttpTypes } from '@medusajs/types';
import { Heading, Text } from '@medusajs/ui';

import Divider from '@modules/common/components/divider';

type ShippingDetailsProps = {
	order: HttpTypes.StoreOrder;
};

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
	return (
		<div>
			<Heading level="h2" className="flex flex-row text-4xl font-serif text-green-900 my-6">
				Delivery
			</Heading>
			<div className="flex md:flex-row flex-col items-start gap-x-8">
				<div className="flex flex-col w-1/3" data-testid="shipping-address-summary">
					<Text className="font-semibold text-base mb-1 text-green-900">Shipping Address</Text>
					<Text className="txt-medium text-ui-fg-subtle">
						{order.shipping_address?.first_name} {order.shipping_address?.last_name}
					</Text>
					<Text className="txt-medium text-ui-fg-subtle">
						{order.shipping_address?.address_1} {order.shipping_address?.address_2}
					</Text>
					<Text className="txt-medium text-ui-fg-subtle">
						{order.shipping_address?.postal_code}, {order.shipping_address?.city}
					</Text>
					<Text className="txt-medium text-ui-fg-subtle">
						{order.shipping_address?.country_code?.toUpperCase()}
					</Text>
				</div>
				{!!order?.shipping_address?.metadata?.dropoff_instructions && (
					<div className="flex-col md:hidden flex">
						<Text className="font-semibold text-base mb-1 text-green-900">
							Extra delivery information
						</Text>
						<Text className="txt-medium text-ui-fg-subtle">
							{order?.shipping_address?.metadata?.dropoff_instructions as string}
						</Text>
					</div>
				)}

				<div className="flex flex-col w-1/3 " data-testid="shipping-contact-summary">
					<Text className="font-semibold text-base mb-1 text-green-900">Contact</Text>
					<Text className="txt-medium text-ui-fg-subtle">{order.shipping_address?.phone}</Text>
					<Text className="txt-medium text-ui-fg-subtle">{order.email}</Text>
				</div>

				<div className="flex flex-col w-1/3" data-testid="shipping-method-summary">
					<Text className="font-semibold text-base mb-1 text-green-900">Method</Text>
					<Text className="txt-medium text-ui-fg-subtle">
						{(order as any).shipping_methods[0]?.name} (
						{convertToLocale({
							amount: order.shipping_methods?.[0].total ?? 0,
							currency_code: order.currency_code,
							minimumFractionDigits: 0,
							maximumFractionDigits: 0,
						})}
						)
					</Text>
				</div>
			</div>
			{!!order?.shipping_address?.metadata?.dropoff_instructions && (
				<div className="flex-col hidden md:flex mt-5">
					<Text className="font-semibold text-base mb-1 text-green-900">
						Extra delivery information
					</Text>
					<Text className="txt-medium text-ui-fg-subtle">
						{order?.shipping_address?.metadata?.dropoff_instructions as string}
					</Text>
				</div>
			)}
			<Divider className="mt-8" />
		</div>
	);
};

export default ShippingDetails;

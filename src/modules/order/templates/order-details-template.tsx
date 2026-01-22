'use client';

import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HttpTypes } from '@medusajs/types';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Help from '@modules/order/components/help';
import Items from '@modules/order/components/items';
import OrderDetails from '@modules/order/components/order-details';
import OrderSummary from '@modules/order/components/order-summary';
import ShippingDetails from '@modules/order/components/shipping-details';
import React from 'react';

type OrderDetailsTemplateProps = {
	order: HttpTypes.StoreOrder;
};

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({ order }) => {
	return (
		<div className="flex flex-col justify-center gap-y-4">
			<div className="flex gap-2 justify-between items-center">
				<h1 className="text-4xl text-green-900 font-serif">Order details</h1>
				<LocalizedClientLink
					href="/account/orders"
					// className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
					className="hover:bg-green-900 hover:!text-white !text-green-900 border border-green-900 px-1 py-1 rounded-md flex gap-1 md:gap-2 items-center"
					data-testid="back-to-overview-button"
				>
					<FontAwesomeIcon icon={faAngleLeft} /> Back to overview
				</LocalizedClientLink>
			</div>
			<div
				className="flex flex-col gap-4 h-full bg-yellow-100 w-full"
				data-testid="order-details-container"
			>
				<OrderDetails order={order} showStatus />
				<Items order={order} />
				<ShippingDetails order={order} />
				<OrderSummary order={order} />
				<Help />
			</div>
		</div>
	);
};

export default OrderDetailsTemplate;

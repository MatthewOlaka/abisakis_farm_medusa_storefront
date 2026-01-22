'use client';

import { setAddresses } from '@lib/data/cart';
import compareAddresses from '@lib/util/compare-addresses';
import { HttpTypes } from '@medusajs/types';
import { Heading, Text, useToggleState } from '@medusajs/ui';
import Divider from '@modules/common/components/divider';
import Spinner from '@modules/common/icons/spinner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import BillingAddress from '../billing_address';
import ErrorMessage from '../error-message';
import ShippingAddress from '../shipping-address';
import { SubmitButton } from '../submit-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faPencil } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@modules/common/components/button';

const Addresses = ({
	cart,
	customer,
}: {
	cart: HttpTypes.StoreCart | null;
	customer: HttpTypes.StoreCustomer | null;
}) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const isOpen = searchParams.get('step') === 'address';

	const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
		cart?.shipping_address && cart?.billing_address
			? compareAddresses(cart?.shipping_address, cart?.billing_address)
			: true,
	);
	console.log('cart?.shipping_address :', cart?.shipping_address);

	const handleEdit = () => {
		router.push(pathname + '?step=address');
	};

	const [message, formAction] = useActionState(setAddresses, null);

	return (
		<div className="">
			<div className="flex flex-row items-center justify-between mb-6">
				<Heading
					level="h2"
					className="flex flex-row text-green-900 font-serif text-3xl md:text-4xl font-bold gap-x-1 md:gap-x-2 items-center whitespace-nowrap"
				>
					Shipping Address
					{!isOpen && <FontAwesomeIcon icon={faCircleCheck} className="text-lg md:text-xl" />}
				</Heading>
				{!isOpen && cart?.shipping_address && (
					// <Text>
					// 	<button
					// 		onClick={handleEdit}
					// 		className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
					// 		data-testid="edit-address-button"
					// 	>
					// 		Edit
					// 	</button>
					// <div className="bg-red-500 flex flex-col justify-center w-full h-full items-center">
					<Button
						wrapperClass="hover:bg-green-900 hover:!text-white !text-green-900 border border-green-900 px-1 py-1 rounded-md flex gap-1 md:gap-2 items-center"
						primaryColor="bg-transparent"
						text="Edit"
						onClick={handleEdit}
						size="small"
						icon={faPencil}
					/>
					// </Text>
				)}
			</div>
			{isOpen ? (
				<form action={formAction}>
					<div className="pb-8">
						<ShippingAddress
							customer={customer}
							checked={sameAsBilling}
							onChange={toggleSameAsBilling}
							cart={cart}
						/>

						{!sameAsBilling && (
							<div>
								<Heading level="h2" className="text-3xl-regular gap-x-4 pb-6 pt-8">
									Billing address
								</Heading>

								<BillingAddress cart={cart} />
							</div>
						)}
						<SubmitButton
							className="mt-6 bg-green-900 hover:bg-green-800 text-white text-base shadow-lg rounded-lg md:px-10"
							// className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-green-900 text-lg shadow rounded-lg md:px-20"
							data-testid="submit-address-button"
						>
							Continue to delivery
						</SubmitButton>
						<ErrorMessage error={message} data-testid="address-error-message" />
					</div>
				</form>
			) : (
				<div>
					<div className="text-small-regular">
						{cart && cart.shipping_address ? (
							<div className="flex items-start gap-x-8">
								<div className="flex flex-col">
									<div className="flex flex-col md:flex-row items-start gap-x-1 w-full">
										<div className="flex flex-col w-full" data-testid="shipping-address-summary">
											<Text className="txt-medium-plus text-xl my-1 font-serif text-green-900">
												Shipping Address
											</Text>
											<Text className="txt-medium text-ui-fg-subtle">
												{cart.shipping_address.first_name} {cart.shipping_address.last_name}
											</Text>
											<Text className="txt-medium text-ui-fg-subtle">
												{cart.shipping_address.address_1} {cart.shipping_address.address_2}
											</Text>
											<Text className="txt-medium text-ui-fg-subtle">
												{cart.shipping_address.postal_code}, {cart.shipping_address.city}
											</Text>
											<Text className="txt-medium text-ui-fg-subtle">
												{cart.shipping_address.country_code?.toUpperCase()}
											</Text>
										</div>
										{!!cart?.shipping_address?.metadata?.dropoff_instructions && (
											<div className="flex-col flex md:hidden">
												<Text className="txt-medium-plus text-xl my-1 font-serif text-green-900">
													Extra delivery information
												</Text>
												<Text className="txt-medium text-ui-fg-subtle">
													{cart?.shipping_address?.metadata?.dropoff_instructions as String}
												</Text>
											</div>
										)}

										<div className="flex flex-col w-full" data-testid="billing-address-summary">
											<Text className="txt-medium-plus text-xl my-1 font-serif text-green-900">
												Billing Address
											</Text>

											{sameAsBilling ? (
												<Text className="txt-medium text-ui-fg-subtle">
													Billing and delivery address are the same.
												</Text>
											) : (
												<>
													<Text className="txt-medium text-ui-fg-subtle">
														{cart.billing_address?.first_name} {cart.billing_address?.last_name}
													</Text>
													<Text className="txt-medium text-ui-fg-subtle">
														{cart.billing_address?.address_1} {cart.billing_address?.address_2}
													</Text>
													<Text className="txt-medium text-ui-fg-subtle">
														{cart.billing_address?.postal_code}, {cart.billing_address?.city}
													</Text>
													<Text className="txt-medium text-ui-fg-subtle">
														{cart.billing_address?.country_code?.toUpperCase()}
													</Text>
												</>
											)}
										</div>

										<div className="flex flex-col w-full " data-testid="shipping-contact-summary">
											<Text className="txt-medium-plus text-xl my-1 font-serif text-green-900">
												Contact
											</Text>
											<Text className="txt-medium text-ui-fg-subtle">
												{cart.shipping_address.phone}
											</Text>
											<Text className="txt-medium text-ui-fg-subtle">{cart.email}</Text>
										</div>
									</div>
									{!!cart?.shipping_address?.metadata?.dropoff_instructions && (
										<div className="flex-col md:flex hidden">
											<Text className="txt-medium-plus text-xl my-1 font-serif text-green-900">
												Extra delivery information
											</Text>
											<Text className="txt-medium text-ui-fg-subtle">
												{cart?.shipping_address?.metadata?.dropoff_instructions as String}
											</Text>
										</div>
									)}
								</div>
							</div>
						) : (
							<div>
								<Spinner />
							</div>
						)}
					</div>
				</div>
			)}
			<Divider className="mt-8" />
		</div>
	);
};

export default Addresses;

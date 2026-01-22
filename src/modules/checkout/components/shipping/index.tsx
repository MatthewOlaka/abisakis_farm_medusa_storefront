'use client';

import { Radio, RadioGroup } from '@headlessui/react';
import { setShippingMethod } from '@lib/data/cart';
import { calculatePriceForShippingOption } from '@lib/data/fulfillment';
import { convertToLocale } from '@lib/util/money';
import { CheckCircleSolid, Loader } from '@medusajs/icons';
import { HttpTypes } from '@medusajs/types';
import { Button, clx, Heading, Text } from '@medusajs/ui';
import ErrorMessage from '@modules/checkout/components/error-message';
import Divider from '@modules/common/components/divider';
import MedusaRadio from '@modules/common/components/radio';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import { Button as EditButton } from '@modules/common/components/button';
import { faCircleCheck, faPencil, faStore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PICKUP_OPTION_ON = '__PICKUP_ON';
const PICKUP_OPTION_OFF = '__PICKUP_OFF';

type ShippingOptionWithZone = HttpTypes.StoreCartShippingOptionWithServiceZone;

type ShippingProps = {
	cart: HttpTypes.StoreCart;
	availableShippingMethods: ShippingOptionWithZone[] | null;
};

function formatAddress(address?: HttpTypes.StoreCartAddress) {
	if (!address) {
		return '';
	}

	let ret = '';

	if (address.address_1) {
		ret += ` ${address.address_1}`;
	}

	if (address.address_2) {
		ret += `, ${address.address_2}`;
	}

	if (address.postal_code) {
		ret += `, ${address.postal_code} ${address.city}`;
	}

	if (address.country_code) {
		ret += `, ${address.country_code.toUpperCase()}`;
	}

	return ret;
}

const isInternationalOption = (opt: ShippingOptionWithZone) =>
	opt.name.toLowerCase().includes('international') ||
	opt.type?.code?.toLowerCase?.() === 'international';

const inferScope = (cart: HttpTypes.StoreCart): 'nairobi' | 'outside' | 'international' => {
	const metaScope = (cart.shipping_address?.metadata as any)?.shipping_scope as
		| 'nairobi'
		| 'outside'
		| 'international'
		| undefined;

	if (metaScope) return metaScope;

	const cc = cart.shipping_address?.country_code?.toLowerCase();
	if (cc && cc !== 'ke') return 'international';

	const city = cart.shipping_address?.city?.toLowerCase();
	if (city && city !== 'nairobi') return 'outside';

	return 'nairobi';
};

const Shipping: React.FC<ShippingProps> = ({ cart, availableShippingMethods }) => {
	const scope = inferScope(cart);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingPrices, setIsLoadingPrices] = useState(true);

	const [showPickupOptions, setShowPickupOptions] = useState<string>(PICKUP_OPTION_OFF);
	const [calculatedPricesMap, setCalculatedPricesMap] = useState<Record<string, number>>({});
	const [error, setError] = useState<string | null>(null);
	const [shippingMethodId, setShippingMethodId] = useState<string | null>(
		cart.shipping_methods?.at(-1)?.shipping_option_id || null,
	);
	console.log('cart.shipping_methods :', cart.shipping_methods);

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const isOpen = searchParams.get('step') === 'delivery';

	// Partition available methods
	const allNonPickup = useMemo(
		() =>
			availableShippingMethods?.filter(
				(sm) => sm.service_zone?.fulfillment_set?.type !== 'pickup',
			) ?? [],
		[availableShippingMethods],
	);
	const allPickup = useMemo(
		() =>
			availableShippingMethods?.filter(
				(sm) => sm.service_zone?.fulfillment_set?.type === 'pickup',
			) ?? [],
		[availableShippingMethods],
	);

	// Scope-based filtering
	const visiblePickup = useMemo(() => (scope === 'nairobi' ? allPickup : []), [scope, allPickup]);

	const visibleShipping = useMemo(() => {
		if (!allNonPickup.length) return [];
		if (scope === 'international') {
			// Only "International"
			return allNonPickup.filter(isInternationalOption);
		}
		// KE scopes: exclude "International"
		return allNonPickup.filter((o) => !isInternationalOption(o));
	}, [scope, allNonPickup]);

	const hasPickupOptions = visiblePickup.length > 0;

	// When scope changes, ensure UI is consistent (e.g. deselect pickup if not allowed)
	useEffect(() => {
		if (scope !== 'nairobi') {
			setShowPickupOptions(PICKUP_OPTION_OFF);
			if (shippingMethodId && visibleShipping.every((m) => m.id !== shippingMethodId)) {
				setShippingMethodId(null);
			}
		}

		// Auto-pick a sensible default if nothing is selected
		if (!shippingMethodId) {
			const preferred =
				scope === 'international'
					? visibleShipping.find(isInternationalOption)
					: // prefer Express if available, else Standard, else first
						(visibleShipping.find((m) => m.type?.code === 'express') ??
						visibleShipping.find((m) => m.type?.code === 'standard') ??
						visibleShipping[0]);

			if (preferred?.id) {
				// Don’t await here to keep UI snappy; the Radio onChange will also call handleSetShippingMethod
				setShippingMethodId(preferred.id);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scope, visibleShipping]);

	// const _shippingMethods = availableShippingMethods?.filter(
	// 	(sm) => sm.service_zone?.fulfillment_set?.type !== 'pickup',
	// );
	// console.log('_shippingMethods :', _shippingMethods);

	// const _pickupMethods = availableShippingMethods?.filter(
	// 	(sm) => sm.service_zone?.fulfillment_set?.type === 'pickup',
	// );
	// console.log('_pickupMethods :', _pickupMethods);

	// const hasPickupOptions = !!_pickupMethods?.length;

	useEffect(() => {
		setIsLoadingPrices(true);

		if (visibleShipping?.length) {
			const promises = visibleShipping
				.filter((sm) => sm.price_type === 'calculated')
				.map((sm) => calculatePriceForShippingOption(sm.id, cart.id));

			if (promises.length) {
				Promise.allSettled(promises).then((res) => {
					const pricesMap: Record<string, number> = {};
					res
						.filter((r) => r.status === 'fulfilled')
						.forEach((p) => (pricesMap[p.value?.id || ''] = p.value?.amount!));

					setCalculatedPricesMap(pricesMap);
					setIsLoadingPrices(false);
				});
			}
		}

		if (visiblePickup?.find((m) => m.id === shippingMethodId)) {
			setShowPickupOptions(PICKUP_OPTION_ON);
		}
	}, [availableShippingMethods]);

	const handleEdit = () => {
		router.push(pathname + '?step=delivery', { scroll: false });
	};

	const handleSubmit = () => {
		router.push(pathname + '?step=payment', { scroll: false });
	};

	const handleSetShippingMethod = async (id: string, variant: 'shipping' | 'pickup') => {
		setError(null);

		if (variant === 'pickup') {
			setShowPickupOptions(PICKUP_OPTION_ON);
		} else {
			setShowPickupOptions(PICKUP_OPTION_OFF);
		}

		let currentId: string | null = null;
		setIsLoading(true);
		setShippingMethodId((prev) => {
			currentId = prev;
			return id;
		});

		await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
			.catch((err) => {
				setShippingMethodId(currentId);

				setError(err.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
		setError(null);
	}, [isOpen]);

	return (
		<div className="bg-yellow-100">
			<div className="flex flex-row items-center justify-between mb-6">
				<Heading
					level="h2"
					// className={clx('flex flex-row text-3xl-regular gap-x-2 items-baseline', {
					className={clx(
						'flex flex-row text-green-900 font-serif text-3xl md:text-4xl font-bold gap-x-2 items-center',
						{
							'opacity-50 pointer-events-none select-none':
								!isOpen && cart.shipping_methods?.length === 0,
						},
					)}
				>
					Delivery
					{!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
						<FontAwesomeIcon icon={faCircleCheck} className="text-lg md:text-xl" />
					)}
				</Heading>
				{!isOpen && cart?.shipping_address && cart?.billing_address && cart?.email && (
					<Text>
						<EditButton
							wrapperClass="hover:bg-green-900 hover:!text-white !text-green-900 border border-green-900 px-1 py-1 rounded-md flex gap-1 md:gap-2 items-center"
							primaryColor="bg-transparent"
							text="Edit"
							onClick={handleEdit}
							size="small"
							icon={faPencil}
						/>
					</Text>
				)}
			</div>
			{isOpen ? (
				<>
					<div className="grid">
						<div className="flex flex-col">
							<span className="font-medium txt-medium text-ui-fg-base">Shipping method</span>
							<span className="mb-4 text-ui-fg-muted txt-medium">
								Select how you would like your order delivered.
							</span>
						</div>
						<div data-testid="delivery-options-container">
							<div className="pb-8 md:pt-0 pt-2">
								{hasPickupOptions && (
									<RadioGroup
										value={showPickupOptions}
										onChange={(value) => {
											const id = visiblePickup.find((option) => !option.insufficient_inventory)?.id;

											if (id) {
												handleSetShippingMethod(id, 'pickup');
											}
										}}
									>
										<Radio
											value={PICKUP_OPTION_ON}
											data-testid="delivery-option-radio"
											className={clx(
												'flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:bg-yellow-200 hover:border-yellow-600',

												{
													'border-yellow-600 border-2 bg-yellow-400 hover:bg-yellow-400':
														showPickupOptions === PICKUP_OPTION_ON,
												},
											)}
										>
											<div className="flex items-center">
												<MedusaRadio checked={showPickupOptions === PICKUP_OPTION_ON} />
												<span className="text-base">Pick up your order</span>
											</div>
											<span className="justify-self-end text-ui-fg-base">-</span>
										</Radio>
									</RadioGroup>
								)}
								<RadioGroup
									value={shippingMethodId}
									onChange={(v) => {
										if (v) {
											return handleSetShippingMethod(v, 'shipping');
										}
									}}
								>
									{visibleShipping?.map((option) => {
										const isDisabled =
											option.price_type === 'calculated' &&
											!isLoadingPrices &&
											typeof calculatedPricesMap[option.id] !== 'number';
										return (
											<Radio
												key={option.id}
												value={option.id}
												data-testid="delivery-option-radio"
												disabled={isDisabled}
												className={clx(
													'flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2',
													option.id === shippingMethodId
														? 'border-yellow-600 border-2 bg-yellow-400'
														: 'border-ui-border-base hover:bg-yellow-200 hover:border-yellow-600',
													{
														// 'border-ui-border-interactive': option.id === shippingMethodId,
														'hover:shadow-brders-none cursor-not-allowed': isDisabled,
													},
												)}
											>
												<div className="flex items-center">
													<MedusaRadio checked={option.id === shippingMethodId} />
													<span className="text-base">{option.name}</span>
												</div>
												<span className="justify-self-end text-ui-fg-base">
													{option.price_type === 'flat' ? (
														convertToLocale({
															amount: option.amount!,
															currency_code: cart?.currency_code,
														})
													) : calculatedPricesMap[option.id] ? (
														convertToLocale({
															amount: calculatedPricesMap[option.id],
															currency_code: cart?.currency_code,
														})
													) : isLoadingPrices ? (
														<Loader />
													) : (
														'-'
													)}
												</span>
											</Radio>
										);
									})}
								</RadioGroup>
							</div>
						</div>
					</div>

					{showPickupOptions === PICKUP_OPTION_ON && (
						<div className="grid">
							<div className="flex flex-col">
								<span className="font-medium txt-medium text-ui-fg-base">Store</span>
								<span className="mb-4 text-ui-fg-muted txt-medium">Choose a store near you</span>
							</div>
							<div data-testid="delivery-options-container">
								<div className="pb-8 md:pt-0 pt-2">
									<RadioGroup
										value={shippingMethodId}
										onChange={(v) => {
											if (v) {
												return handleSetShippingMethod(v, 'pickup');
											}
										}}
									>
										{visiblePickup?.map((option) => {
											return (
												<Radio
													key={option.id}
													value={option.id}
													disabled={option.insufficient_inventory}
													data-testid="delivery-option-radio"
													className={clx(
														'flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active',
														option.id === shippingMethodId
															? 'border-yellow-600 border-2 bg-yellow-400'
															: 'border-ui-border-base hover:bg-yellow-200 hover:border-yellow-600',
														{
															// 'border-ui-border-interactive': option.id === shippingMethodId,
															'hover:shadow-brders-none cursor-not-allowed':
																option.insufficient_inventory,
														},
													)}
												>
													<div className="flex items-center gap-x-4">
														<FontAwesomeIcon icon={faStore} className="text-slate-900 text-2xl" />
														{/* <MedusaRadio checked={option.id === shippingMethodId} /> */}
														<div className="flex flex-col">
															<span className="text-base">{option.name}</span>
															<span className="text-sm text-slate-700">
																{formatAddress(
																	option.service_zone?.fulfillment_set?.location?.address,
																)}
															</span>
														</div>
													</div>
													<span className="justify-self-end text-ui-fg-base">
														{convertToLocale({
															amount: option.amount!,
															currency_code: cart?.currency_code,
														})}
													</span>
												</Radio>
											);
										})}
									</RadioGroup>
								</div>
							</div>
						</div>
					)}

					<div>
						<ErrorMessage error={error} data-testid="delivery-option-error-message" />
						<Button
							size="large"
							className="mt-6 bg-green-900 hover:bg-green-800 text-white text-base shadow-lg rounded-lg md:px-10"
							onClick={handleSubmit}
							isLoading={isLoading}
							disabled={!cart.shipping_methods?.[0]}
							data-testid="submit-delivery-option-button"
						>
							Continue to payment
						</Button>
					</div>
				</>
			) : (
				<div>
					<div className="text-small-regular">
						{cart && (cart.shipping_methods?.length ?? 0) > 0 && (
							<div className="flex flex-col w-1/3">
								<Text className="txt-medium-plus text-ui-fg-base mb-1">Method</Text>
								<Text className="txt-medium text-ui-fg-subtle">
									{cart.shipping_methods!.at(-1)!.name}{' '}
									{convertToLocale({
										amount: cart.shipping_methods!.at(-1)!.amount!,
										currency_code: cart?.currency_code,
									})}
								</Text>
							</div>
						)}
					</div>
				</div>
			)}
			<Divider className="mt-8" />
		</div>
	);
};

export default Shipping;

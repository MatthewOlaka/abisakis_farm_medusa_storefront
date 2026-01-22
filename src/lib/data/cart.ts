'use server';

import { sdk } from '@lib/config';
import medusaError from '@lib/util/medusa-error';
import { HttpTypes } from '@medusajs/types';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import {
	getAuthHeaders,
	getCacheOptions,
	getCacheTag,
	getCartId,
	removeCartId,
	setCartId,
} from './cookies';
import { getRegion } from './regions';

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string, fields?: string) {
	const id = cartId || (await getCartId());
	fields ??=
		'*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, *shipping_address, *billing_address, *shipping_methods, +shipping_methods.name';

	if (!id) {
		return null;
	}

	const headers = {
		...(await getAuthHeaders()),
	};

	const next = {
		...(await getCacheOptions('carts')),
	};

	return await sdk.client
		.fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
			method: 'GET',
			query: {
				fields,
			},
			headers,
			next,
			cache: 'force-cache',
		})
		.then(({ cart }: { cart: HttpTypes.StoreCart }) => cart)
		.catch(() => null);
}

export async function getOrSetCart(countryCode: string) {
	const region = await getRegion(countryCode);

	if (!region) {
		throw new Error(`Region not found for country code: ${countryCode}`);
	}

	let cart = await retrieveCart(undefined, 'id,region_id');

	const headers = {
		...(await getAuthHeaders()),
	};

	if (!cart) {
		const cartResp = await sdk.store.cart.create({ region_id: region.id }, {}, headers);
		cart = cartResp.cart;

		await setCartId(cart.id);

		const cartCacheTag = await getCacheTag('carts');
		revalidateTag(cartCacheTag);
	}

	if (cart && cart?.region_id !== region.id) {
		await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers);
		const cartCacheTag = await getCacheTag('carts');
		revalidateTag(cartCacheTag);
	}

	return cart;
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
	const cartId = await getCartId();

	if (!cartId) {
		throw new Error('No existing cart found, please create one before updating');
	}

	const headers = {
		...(await getAuthHeaders()),
	};

	return sdk.store.cart
		.update(cartId, data, {}, headers)
		.then(async ({ cart }: { cart: HttpTypes.StoreCart }) => {
			const cartCacheTag = await getCacheTag('carts');
			revalidateTag(cartCacheTag);

			const fulfillmentCacheTag = await getCacheTag('fulfillment');
			revalidateTag(fulfillmentCacheTag);

			return cart;
		})
		.catch(medusaError);
}

export async function addToCart({
	variantId,
	quantity,
	countryCode,
}: {
	variantId: string;
	quantity: number;
	countryCode: string;
}) {
	if (!variantId) {
		throw new Error('Missing variant ID when adding to cart');
	}

	const cart = await getOrSetCart(countryCode);

	if (!cart) {
		throw new Error('Error retrieving or creating cart');
	}

	const headers = {
		...(await getAuthHeaders()),
	};

	await sdk.store.cart
		.createLineItem(
			cart.id,
			{
				variant_id: variantId,
				quantity,
			},
			{},
			headers,
		)
		.then(async () => {
			const cartCacheTag = await getCacheTag('carts');
			revalidateTag(cartCacheTag);

			const fulfillmentCacheTag = await getCacheTag('fulfillment');
			revalidateTag(fulfillmentCacheTag);
		})
		.catch(medusaError);
}

export async function updateLineItem({ lineId, quantity }: { lineId: string; quantity: number }) {
	if (!lineId) {
		throw new Error('Missing lineItem ID when updating line item');
	}

	const cartId = await getCartId();

	if (!cartId) {
		throw new Error('Missing cart ID when updating line item');
	}

	const headers = {
		...(await getAuthHeaders()),
	};

	await sdk.store.cart
		.updateLineItem(cartId, lineId, { quantity }, {}, headers)
		.then(async () => {
			const cartCacheTag = await getCacheTag('carts');
			revalidateTag(cartCacheTag);

			const fulfillmentCacheTag = await getCacheTag('fulfillment');
			revalidateTag(fulfillmentCacheTag);
		})
		.catch(medusaError);
}

export async function deleteLineItem(lineId: string) {
	if (!lineId) {
		throw new Error('Missing lineItem ID when deleting line item');
	}

	const cartId = await getCartId();

	if (!cartId) {
		throw new Error('Missing cart ID when deleting line item');
	}

	const headers = {
		...(await getAuthHeaders()),
	};

	await sdk.store.cart
		.deleteLineItem(cartId, lineId, headers)
		.then(async () => {
			const cartCacheTag = await getCacheTag('carts');
			revalidateTag(cartCacheTag);

			const fulfillmentCacheTag = await getCacheTag('fulfillment');
			revalidateTag(fulfillmentCacheTag);
		})
		.catch(medusaError);
}

export async function setShippingMethod({
	cartId,
	shippingMethodId,
}: {
	cartId: string;
	shippingMethodId: string;
}) {
	const headers = {
		...(await getAuthHeaders()),
	};

	return sdk.store.cart
		.addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
		.then(async () => {
			const cartCacheTag = await getCacheTag('carts');
			revalidateTag(cartCacheTag);
		})
		.catch(medusaError);
}

export async function initiatePaymentSession(
	cart: HttpTypes.StoreCart,
	data: HttpTypes.StoreInitializePaymentSession,
) {
	const headers = {
		...(await getAuthHeaders()),
	};

	return sdk.store.payment
		.initiatePaymentSession(cart, data, {}, headers)
		.then(async (resp) => {
			const cartCacheTag = await getCacheTag('carts');
			revalidateTag(cartCacheTag);
			return resp;
		})
		.catch(medusaError);
}

export async function applyPromotions(codes: string[]) {
	const cartId = await getCartId();

	if (!cartId) {
		throw new Error('No existing cart found');
	}

	const headers = {
		...(await getAuthHeaders()),
	};

	return sdk.store.cart
		.update(cartId, { promo_codes: codes }, {}, headers)
		.then(async () => {
			const cartCacheTag = await getCacheTag('carts');
			revalidateTag(cartCacheTag);

			const fulfillmentCacheTag = await getCacheTag('fulfillment');
			revalidateTag(fulfillmentCacheTag);
		})
		.catch(medusaError);
}

export async function applyGiftCard(code: string) {
	//   const cartId = getCartId()
	//   if (!cartId) return "No cartId cookie found"
	//   try {
	//     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
	//       revalidateTag("cart")
	//     })
	//   } catch (error: any) {
	//     throw error
	//   }
}

export async function removeDiscount(code: string) {
	// const cartId = getCartId()
	// if (!cartId) return "No cartId cookie found"
	// try {
	//   await deleteDiscount(cartId, code)
	//   revalidateTag("cart")
	// } catch (error: any) {
	//   throw error
	// }
}

export async function removeGiftCard(
	codeToRemove: string,
	giftCards: any[],
	// giftCards: GiftCard[]
) {
	//   const cartId = getCartId()
	//   if (!cartId) return "No cartId cookie found"
	//   try {
	//     await updateCart(cartId, {
	//       gift_cards: [...giftCards]
	//         .filter((gc) => gc.code !== codeToRemove)
	//         .map((gc) => ({ code: gc.code })),
	//     }).then(() => {
	//       revalidateTag("cart")
	//     })
	//   } catch (error: any) {
	//     throw error
	//   }
}

export async function submitPromotionForm(currentState: unknown, formData: FormData) {
	const code = formData.get('code') as string;
	try {
		await applyPromotions([code]);
	} catch (e: any) {
		return e.message;
	}
}

// // TODO: Pass a POJO instead of a form entity here
// export async function setAddresses(currentState: unknown, formData: FormData) {
// 	try {
// 		if (!formData) {
// 			throw new Error('No form data found when setting addresses');
// 		}
// 		const cartId = getCartId();
// 		if (!cartId) {
// 			throw new Error('No existing cart found when setting addresses');
// 		}

// 		const data = {
// 			shipping_address: {
// 				first_name: formData.get('shipping_address.first_name'),
// 				last_name: formData.get('shipping_address.last_name'),
// 				address_1: formData.get('shipping_address.address_1'),
// 				address_2: '',
// 				company: formData.get('shipping_address.company'),
// 				postal_code: formData.get('shipping_address.postal_code'),
// 				city: formData.get('shipping_address.city'),
// 				country_code: formData.get('shipping_address.country_code'),
// 				province: formData.get('shipping_address.province'),
// 				phone: formData.get('shipping_address.phone'),
// 				metadata: {
// 					shipping_scope: formData.get('shipping_address.shipping_scope'),
// 					outside_city: formData.get('shipping_address.outside_city'),
// 					dropoff_instructions: formData.get('shipping_address.dropoff_instructions'),
// 				},
// 			},
// 			email: formData.get('email'),
// 		} as any;

// 		const sameAsBilling = formData.get('same_as_billing');
// 		if (sameAsBilling === 'on') data.billing_address = data.shipping_address;

// 		if (sameAsBilling !== 'on')
// 			data.billing_address = {
// 				first_name: formData.get('billing_address.first_name'),
// 				last_name: formData.get('billing_address.last_name'),
// 				address_1: formData.get('billing_address.address_1'),
// 				address_2: '',
// 				company: formData.get('billing_address.company'),
// 				postal_code: formData.get('billing_address.postal_code'),
// 				city: formData.get('billing_address.city'),
// 				country_code: formData.get('billing_address.country_code'),
// 				province: formData.get('billing_address.province'),
// 				phone: formData.get('billing_address.phone'),
// 			};
// 		await updateCart(data);
// 	} catch (e: any) {
// 		return e.message;
// 	}

// 	redirect(`/${formData.get('shipping_address.country_code')}/checkout?step=delivery`);
// }

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
	// we redirect after a successful update; keep this outside the try/catch so Next.js can handle it
	let effectiveCountry = 'ke';
	try {
		if (!formData) throw new Error('No form data found when setting addresses');

		const cartId = await getCartId();
		if (!cartId) throw new Error('No existing cart found when setting addresses');

		// helpers to safely read strings from FormData
		const s = (key: string) => {
			const v = formData.get(key);
			return typeof v === 'string' ? v.trim() : undefined;
		};

		type Scope = 'nairobi' | 'outside' | 'international';
		const shippingScope = (s('shipping_address.shipping_scope') as Scope) || 'nairobi';
		const outsideCity = s('shipping_address.outside_city');
		const dropoff = s('shipping_address.dropoff_instructions');

		// base shipping surface fields from the form
		const shipping_address: any = {
			first_name: s('shipping_address.first_name'),
			last_name: s('shipping_address.last_name'),
			address_1: s('shipping_address.address_1'),
			address_2: '', // keep your current behaviour
			company: s('shipping_address.company'),
			postal_code: s('shipping_address.postal_code'),
			city: s('shipping_address.city'),
			country_code: s('shipping_address.country_code'),
			province: s('shipping_address.province'),
			phone: s('shipping_address.phone'),
		};

		// enforce country/city by scope
		if (shippingScope === 'nairobi') {
			shipping_address.country_code = 'ke';
			shipping_address.city = 'Nairobi';
		} else if (shippingScope === 'outside') {
			shipping_address.country_code = 'ke';
			// if user selected a town, prefer it; otherwise keep whatever they typed
			if (outsideCity) shipping_address.city = outsideCity;
		} // 'international' → keep submitted country/city as-is

		// attach metadata (only set keys when present)
		const metadata: Record<string, any> = {};
		if (shippingScope) metadata.shipping_scope = shippingScope;
		if (outsideCity) metadata.outside_city = outsideCity;
		if (dropoff) metadata.dropoff_instructions = dropoff;
		shipping_address.metadata = metadata;

		const data: any = {
			shipping_address,
			email: s('email'),
		};

		const sameAsBilling = formData.get('same_as_billing');
		if (sameAsBilling === 'on') {
			data.billing_address = shipping_address;
		} else {
			data.billing_address = {
				first_name: s('billing_address.first_name'),
				last_name: s('billing_address.last_name'),
				address_1: s('billing_address.address_1'),
				address_2: '',
				company: s('billing_address.company'),
				postal_code: s('billing_address.postal_code'),
				city: s('billing_address.city'),
				country_code: s('billing_address.country_code'),
				province: s('billing_address.province'),
				phone: s('billing_address.phone'),
			};
		}

		await updateCart(data);

		// use the effective shipping country (after normalization) for the locale prefix
		effectiveCountry = (shipping_address.country_code || 'ke').toLowerCase();
	} catch (e: any) {
		return e.message;
	}

	redirect(`/${effectiveCountry}/checkout?step=delivery`);
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder() {
	const cartId = await getCartId();

	if (!cartId) {
		throw new Error('No existing cart found when placing an order');
	}

	// Completion is handled by the backend (e.g., Paystack webhook); no client-side complete here.
	return await retrieveCart(cartId, 'id');
}

// /**
//  * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
//  * @param cartId - optional - The ID of the cart to place an order for.
//  * @returns The cart object if the order was successful, or null if not.
//  */
// export async function placeOrder(cartId?: string) {
// 	const id = cartId || (await getCartId());

// 	if (!id) {
// 		throw new Error('No existing cart found when placing an order');
// 	}

// 	const baseHeaders = {
// 		...(await getAuthHeaders()),
// 	};
// 	const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

// 	const tryComplete = async (idempotencyKey: string) =>
// 		sdk.store.cart
// 			.complete(
// 				id,
// 				{},
// 				{
// 					...baseHeaders,
// 					'Idempotency-Key': idempotencyKey,
// 				},
// 			)
// 			.then(async (cartRes) => {
// 				const cartCacheTag = await getCacheTag('carts');
// 				revalidateTag(cartCacheTag);
// 				return cartRes;
// 			});

// 	const isConflictErr = (err: any) => {
// 		const msg = err?.message?.toLowerCase?.() || '';
// 		const status = err?.response?.status;
// 		return (
// 			status === 409 ||
// 			msg.includes('conflict') ||
// 			msg.includes('idempotency') ||
// 			msg.includes('another request')
// 		);
// 	};

// 	const lookupOrderByCart = async (activeKey?: string) => {
// 		try {
// 			const headerVariants: Record<string, string>[] = [];

// 			// prefer authenticated headers when present
// 			headerVariants.push({
// 				...baseHeaders,
// 				...(publishableKey ? { 'x-publishable-api-key': publishableKey } : {}),
// 				'X-Public-Access': 'true',
// 				...(activeKey ? { 'Idempotency-Key': activeKey } : {}),
// 			});
// 			// fall back to public-only if no auth cookie is set/allowed
// 			headerVariants.push({
// 				...(publishableKey ? { 'x-publishable-api-key': publishableKey } : {}),
// 				'X-Public-Access': 'true',
// 				...(activeKey ? { 'Idempotency-Key': activeKey } : {}),
// 			});
// 			// final fallback: only auth headers (some backends may reject public headers)
// 			headerVariants.push({
// 				...baseHeaders,
// 				...(activeKey ? { 'Idempotency-Key': activeKey } : {}),
// 			});

// 			for (const headers of headerVariants) {
// 				const orderLookup = await sdk.client
// 					.fetch<{ orders: any[] }>(`/store/orders`, {
// 						method: 'GET',
// 						query: { cart_id: id },
// 						headers,
// 						cache: 'no-store',
// 					})
// 					.catch((err: any) => {
// 						// swallow auth/public failures and try the next header set
// 						const status = err?.response?.status;
// 						if (status === 401 || status === 403) return null;
// 						throw err;
// 					});

// 				if (orderLookup?.orders?.length) {
// 					return orderLookup.orders[0];
// 				}
// 			}

// 			return null;
// 		} catch {
// 			return null;
// 		}
// 	};

// 	let cartRes: any;
// 	let lastErr: any = null;
// 	let idempotencyKey = `complete-${id}-${randomUUID()}`;

// 	const maxAttempts = 6;
// 	const baseDelayMs = 900;

// 	for (let attempt = 0; attempt < maxAttempts; attempt++) {
// 		try {
// 			cartRes = await tryComplete(idempotencyKey);
// 			break;
// 		} catch (err: any) {
// 			lastErr = err;

// 			if (!isConflictErr(err)) {
// 				medusaError(err);
// 			}

// 			const suggestedKey =
// 				err?.response?.headers?.['idempotency-key'] || err?.response?.data?.idempotency_key;
// 			// Keep using the same key unless the server suggests one (prevents spinning up parallel completions)
// 			idempotencyKey = suggestedKey || idempotencyKey;

// 			const delay = baseDelayMs + attempt * 500; // gentle incremental backoff
// 			await new Promise((resolve) => setTimeout(resolve, delay));
// 		}
// 	}

// 	if (!cartRes) {
// 		if (isConflictErr(lastErr)) {
// 			// see if an order was already created for this cart; if so, redirect to it
// 			const existingOrder = await lookupOrderByCart(idempotencyKey);
// 			if (existingOrder) {
// 				const countryCode = existingOrder.shipping_address?.country_code?.toLowerCase();
// 				const orderCacheTag = await getCacheTag('orders');
// 				revalidateTag(orderCacheTag);
// 				removeCartId();
// 				redirect(`/${countryCode}/order/${existingOrder.id}/confirmed`);
// 			}

// 			throw new Error('Your payment is still being finalized. Please wait a moment and try again.');
// 		}

// 		medusaError(lastErr);
// 	}

// 	const order =
// 		cartRes?.type === 'order'
// 			? cartRes.order
// 			: cartRes?.cart?.id
// 				? await lookupOrderByCart(idempotencyKey)
// 				: null;

// 	if (order) {
// 		const countryCode = order.shipping_address?.country_code?.toLowerCase();

// 		const orderCacheTag = await getCacheTag('orders');
// 		revalidateTag(orderCacheTag);

// 		removeCartId();
// 		redirect(`/${countryCode}/order/${order.id}/confirmed`);
// 	}

// 	return cartRes.cart;
// }

// /**
//  * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
//  * @param cartId - optional - The ID of the cart to place an order for.
//  * @returns The cart object if the order was successful, or null if not.
//  */
// export async function placeOrder(cartId?: string) {
// 	const id = cartId || (await getCartId());

// 	if (!id) {
// 		throw new Error('No existing cart found when placing an order');
// 	}

// 	const baseHeaders = {
// 		...(await getAuthHeaders()),
// 	};

// 	const tryComplete = async (idempotencyKey: string) => {
// 		return sdk.store.cart
// 			.complete(
// 				id,
// 				{},
// 				{
// 					...baseHeaders,
// 					'Idempotency-Key': idempotencyKey,
// 				},
// 			)
// 			.then(async (cartRes) => {
// 				const cartCacheTag = await getCacheTag('carts');
// 				revalidateTag(cartCacheTag);
// 				return cartRes;
// 			});
// 	};

// 	let cartRes;

// 	const isConflictErr = (err: any) => {
// 		const msg = err?.message?.toLowerCase?.() || '';
// 		const status = err?.response?.status;
// 		return (
// 			status === 409 ||
// 			msg.includes('conflict') ||
// 			msg.includes('idempotency') ||
// 			msg.includes('another request')
// 		);
// 	};

// 	let lastErr: any = null;
// 	let providedKey: string | undefined = undefined;

// 	for (let attempt = 0; attempt < 4; attempt++) {
// 		const key =
// 			providedKey || (attempt === 0 ? `complete-${id}` : `complete-${id}-${Date.now()}-${attempt}`);

// 		try {
// 			cartRes = await tryComplete(key);
// 			break;
// 		} catch (err: any) {
// 			lastErr = err;

// 			if (!isConflictErr(err)) {
// 				medusaError(err);
// 			}

// 			// capture idempotency key suggested by Medusa (if any) and retry with it
// 			providedKey =
// 				err?.response?.headers?.['idempotency-key'] ||
// 				err?.response?.data?.idempotency_key ||
// 				providedKey;

// 			// backoff before retrying conflicts
// 			await new Promise((resolve) => setTimeout(resolve, 900));
// 		}
// 	}

// 	if (!cartRes && lastErr) {
// 		if (isConflictErr(lastErr)) {
// 			try {
// 				// check if an order was already created (e.g., via webhook) to avoid blocking the user
// 				const orderLookup = await sdk.client
// 					.fetch<any>(`/store/orders`, {
// 						method: 'GET',
// 						query: { cart_id: id },
// 						headers: {
// 							...baseHeaders,
// 							// allow unauthenticated order lookup for guests when a cookie isn't present
// 							'X-Public-Access': 'true',
// 							// pass along the last seen idempotency key to correlate server-side if required
// 							...(providedKey ? { 'Idempotency-Key': providedKey } : {}),
// 						},
// 						cache: 'no-store',
// 					})
// 					.catch(() => null);

// 				const order = orderLookup?.orders?.[0];

// 				if (order) {
// 					const countryCode = order.shipping_address?.country_code?.toLowerCase();
// 					const orderCacheTag = await getCacheTag('orders');
// 					revalidateTag(orderCacheTag);
// 					removeCartId();
// 					redirect(`/${countryCode}/order/${order.id}/confirmed`);
// 				}
// 			} catch {
// 				// ignore and fall through
// 			}

// 			// If we still can't resolve, swallow the conflict to avoid surfacing an error in the UI.
// 			return null;
// 		}

// 		medusaError(lastErr);
// 	}

// 	if (cartRes?.type === 'order') {
// 		const countryCode = cartRes.order.shipping_address?.country_code?.toLowerCase();

// 		const orderCacheTag = await getCacheTag('orders');
// 		revalidateTag(orderCacheTag);

// 		removeCartId();
// 		redirect(`/${countryCode}/order/${cartRes?.order.id}/confirmed`);
// 	}

// 	return cartRes;
// }

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
	const cartId = await getCartId();
	const region = await getRegion(countryCode);

	if (!region) {
		throw new Error(`Region not found for country code: ${countryCode}`);
	}

	if (cartId) {
		await updateCart({ region_id: region.id });
		const cartCacheTag = await getCacheTag('carts');
		revalidateTag(cartCacheTag);
	}

	const regionCacheTag = await getCacheTag('regions');
	revalidateTag(regionCacheTag);

	const productsCacheTag = await getCacheTag('products');
	revalidateTag(productsCacheTag);

	redirect(`/${countryCode}${currentPath}`);
}

export async function listCartOptions() {
	const cartId = await getCartId();
	const headers = {
		...(await getAuthHeaders()),
	};
	const next = {
		...(await getCacheOptions('shippingOptions')),
	};

	return await sdk.client.fetch<{
		shipping_options: HttpTypes.StoreCartShippingOption[];
	}>('/store/shipping-options', {
		query: { cart_id: cartId },
		next,
		headers,
		cache: 'force-cache',
	});
}

// 'use client';

// import { isPaystack } from '@lib/constants';
// import { initiatePaymentSession, placeOrder } from '@lib/data/cart';
// import { HttpTypes } from '@medusajs/types';
// import { Button } from '@medusajs/ui';
// import React, { useEffect, useRef, useState } from 'react';
// import ErrorMessage from '../error-message';

// type PaymentButtonProps = {
// 	cart: HttpTypes.StoreCart;
// 	'data-testid': string;
// };

// const PaymentButton: React.FC<PaymentButtonProps> = ({ cart, 'data-testid': dataTestId }) => {
// 	const notReady =
// 		!cart ||
// 		!cart.shipping_address ||
// 		!cart.billing_address ||
// 		!cart.email ||
// 		(cart.shipping_methods?.length ?? 0) < 1;

// 	const [submitting, setSubmitting] = useState(false);
// 	const [errorMessage, setErrorMessage] = useState<string | null>(null);

// 	const paymentSessions = cart.payment_collection?.payment_sessions || [];
// 	const paystackSession =
// 		paymentSessions.find((s: any) => isPaystack(s.provider_id)) ||
// 		paymentSessions.find((s: any) => s.status === 'pending') ||
// 		paymentSessions[0] ||
// 		null;
// 	const isPaystackSession = isPaystack(paystackSession?.provider_id);

// 	const loadSessionData = async () => {
// 		if (!paystackSession?.provider_id) {
// 			return paystackSession;
// 		}

// 		const refreshed = await initiatePaymentSession(cart, {
// 			provider_id: paystackSession?.provider_id,
// 			data: {
// 				email: cart.email,
// 			},
// 		});

// 		const sessionFromResp =
// 			(refreshed as any)?.payment_session ||
// 			(refreshed as any)?.payment_sessions?.[0] ||
// 			(refreshed as any)?.paymentSession;

// 		return sessionFromResp || paystackSession;
// 	};

// 	const PaystackInlineButton = ({
// 		session,
// 		notReady,
// 	}: {
// 		session: HttpTypes.StorePaymentSession | null;
// 		notReady: boolean;
// 	}) => {
// 		const paystackRef = useRef<any>(null);
// 		const [psSubmitting, setPsSubmitting] = useState(false);

// 		useEffect(() => {
// 			console.log('Paystack session data:', {
// 				provider_id: session?.provider_id,
// 				status: session?.status,
// 				data: session?.data,
// 			});
// 		}, [session]);

// 		if (!session) return null;

// 		const accessCode =
// 			session.data?.paystackTxAccessCode ||
// 			session.data?.access_code ||
// 			session.data?.data?.paystackTxAccessCode;
// 		const authorizationUrl =
// 			session.data?.paystackTxAuthorizationUrl ||
// 			session.data?.authorization_url ||
// 			session.data?.redirect_url;

// 		// useEffect(() => {
// 		// 	console.log('Paystack session data:', {
// 		// 		provider_id: session.provider_id,
// 		// 		status: session.status,
// 		// 		data: session.data,
// 		// 	});
// 		// }, [session]);

// 		const handleClick = async () => {
// 			setPsSubmitting(true);
// 			setErrorMessage(null);

// 			try {
// 				if (authorizationUrl) {
// 					setPsSubmitting(false);
// 					window.location.href = String(authorizationUrl);
// 					return;
// 				}

// 				if (!accessCode) {
// 					throw new Error('Paystack transaction reference is missing.');
// 				}

// 				if (!paystackRef.current) {
// 					if (typeof window === 'undefined') {
// 						throw new Error('Paystack can only be initialized in the browser.');
// 					}
// 					// dynamically import to avoid SSR window errors
// 					const module = await import('@paystack/inline-js');
// 					const PaystackPop = module.default as any;
// 					paystackRef.current = new PaystackPop();
// 				}

// 				const paystack = paystackRef.current!;

// 				if (paystack?.resumeTransaction) {
// 					paystack.resumeTransaction(accessCode, {
// 						async onSuccess() {
// 							try {
// 								await placeOrder();
// 							} catch (err: any) {
// 								setErrorMessage(err.message || 'Unable to finalize order.');
// 							} finally {
// 								setPsSubmitting(false);
// 							}
// 						},
// 						onError(error: unknown) {
// 							setPsSubmitting(false);
// 							setErrorMessage((error as Error)?.message || 'Payment was not completed.');
// 						},
// 					});
// 				} else if (paystack?.newTransaction) {
// 					paystack.newTransaction({
// 						key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
// 						access_code: accessCode,
// 						email: cart.email || `${cart.shipping_address?.first_name || 'guest'}@checkout.local`,
// 						amount: Math.max(cart.total ?? 0, 0),
// 						async onSuccess() {
// 							try {
// 								await placeOrder();
// 							} catch (err: any) {
// 								setErrorMessage(err.message || 'Unable to finalize order.');
// 							} finally {
// 								setPsSubmitting(false);
// 							}
// 						},
// 						onCancel() {
// 							setPsSubmitting(false);
// 							setErrorMessage('Payment was cancelled.');
// 						},
// 					});
// 				} else {
// 					throw new Error('Paystack inline library not ready.');
// 				}
// 			} catch (err: any) {
// 				setPsSubmitting(false);
// 				setErrorMessage(err.message || 'Unable to start Paystack payment.');
// 			}
// 		};

// 		return (
// 			<Button
// 				disabled={notReady}
// 				onClick={handleClick}
// 				size="large"
// 				isLoading={psSubmitting}
// 				data-testid={dataTestId}
// 				className="bg-green-900 hover:bg-green-800 text-white text-base shadow-lg rounded-lg md:px-10"
// 			>
// 				Pay with Paystack
// 			</Button>
// 		);
// 	};

// 	const handlePayment = async () => {
// 		setSubmitting(true);
// 		setErrorMessage(null);
// 		let navigating = false;

// 		try {
// 			const res = (await placeOrder()) as any;

// 			const redirectUrl =
// 				res?.redirect_url ||
// 				res?.payment_session?.data?.authorization_url ||
// 				res?.payment_session?.data?.redirect_url;

// 			if (redirectUrl) {
// 				navigating = true;
// 				window.location.href = String(redirectUrl);
// 				return;
// 			}
// 		} catch (err: any) {
// 			setErrorMessage(err.message || 'Unable to place order.');
// 		} finally {
// 			if (!navigating) {
// 				setSubmitting(false);
// 			}
// 		}
// 	};

// 	return (
// 		<>
// 			{isPaystackSession ? (
// 				<PaystackInlineButton session={paystackSession} notReady={notReady} />
// 			) : (
// 				<Button
// 					disabled={notReady}
// 					onClick={handlePayment}
// 					size="large"
// 					isLoading={submitting}
// 					data-testid={dataTestId}
// 					className="bg-green-900 hover:bg-green-800 text-white text-base shadow-lg rounded-lg md:px-10"
// 				>
// 					Place order
// 				</Button>
// 			)}
// 			<ErrorMessage error={errorMessage} data-testid="payment-error-message" />
// 		</>
// 	);
// };

// export default PaymentButton;

'use client';

import { isManual, isPaystack, isStripe } from '@lib/constants';
import { placeOrder } from '@lib/data/cart';
import { HttpTypes } from '@medusajs/types';
import { Button } from '@medusajs/ui';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';

import ErrorMessage from '../error-message';
// import { PaystackButton } from 'react-paystack';

const PaystackButton = dynamic(() => import('react-paystack').then((mod) => mod.PaystackButton), {
	ssr: false,
});

type PaymentButtonProps = {
	cart: HttpTypes.StoreCart;
	'data-testid': string;
};

const PaymentButton: React.FC<PaymentButtonProps> = ({ cart, 'data-testid': dataTestId }) => {
	const notReady =
		!cart ||
		!cart.shipping_address ||
		!cart.billing_address ||
		!cart.email ||
		(cart.shipping_methods?.length ?? 0) < 1;

	const paymentSession = cart.payment_collection?.payment_sessions?.[0];

	switch (true) {
		case isStripe(paymentSession?.provider_id):
			return <StripePaymentButton notReady={notReady} cart={cart} data-testid={dataTestId} />;
		case isManual(paymentSession?.provider_id):
			return <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />;
		case isPaystack(paymentSession?.provider_id):
			return <PaystackPaymentButton notReady={notReady} session={paymentSession} cart={cart} />;
		default:
			return <Button disabled>Select a payment method</Button>;
	}
};

// const PaystackPaymentButton = ({
// 	session,
// 	notReady,
// 	cart,
// }: {
// 	session: HttpTypes.StorePaymentSession | undefined;
// 	notReady: boolean;
// 	cart: HttpTypes.StoreCart;
// }) => {
// 	const [isLaunching, setIsLaunching] = useState(false);
// 	const [errorMessage, setErrorMessage] = useState<string | null>(null);
// 	const [referenceSeed, setReferenceSeed] = useState(Date.now());

// 	const publicKey = 'pk_test_8a59cab1e57bca6b769729627cc3e39fa782c7ea';
// 	// process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY || '';
// 	const email = cart.email || `${cart.shipping_address?.first_name || 'guest'}@checkout.local`;
// 	const amount = Math.max(cart?.total ?? 0, 0);
// 	const currency = (cart.region?.currency_code || 'KES').toUpperCase();

// 	const initializePayment = usePaystackPayment({
// 		publicKey,
// 		email,
// 		amount,
// 		currency,
// 	});

// 	// const [submitting, setSubmitting] = useState(false);
// 	// const [errorMessage, setErrorMessage] = useState<string | null>(null);

// 	// const onPaymentCompleted = async () => {
// 	// 	await placeOrder()
// 	// 		.catch((err) => {
// 	// 			setErrorMessage(err.message);
// 	// 			console.log('Error occured mate: ', errorMessage);
// 	// 		})
// 	// 		.finally(() => {
// 	// 			setSubmitting(false);
// 	// 		});
// 	// };

// 	// If the session is not ready, we don't want to render the button
// 	if (notReady || !session) return null;

// 	if (!publicKey) {
// 		return <ErrorMessage error="Paystack public key is not configured." />;
// 	}

// 	const handlePayment = () => {
// 		if (isLaunching || notReady) return;
// 		setErrorMessage(null);
// 		setIsLaunching(true);

// 		// Generate a fresh unique reference per attempt to avoid Paystack "Duplicate Transaction Reference"
// 		const reference = `${session.id || cart.id || 'ps'}-${Date.now()}-${referenceSeed}`;
// 		setReferenceSeed((s) => s + 1);

// 		initializePayment({
// 			config: { reference, email, amount, currency },
// 			onSuccess: async () => {
// 				try {
// 					await placeOrder();
// 				} catch (err: any) {
// 					setErrorMessage(err?.message || 'Unable to finalize order after payment.');
// 				} finally {
// 					setIsLaunching(false);
// 				}
// 			},
// 			onClose: () => {
// 				setIsLaunching(false);
// 			},
// 		});
// 	};

// 	return (
// 		<div className="flex flex-col gap-2">
// 			<Button
// 				disabled={notReady || isLaunching}
// 				isLoading={isLaunching}
// 				onClick={handlePayment}
// 				size="large"
// 				data-testid="paystack-payment-button"
// 				className="bg-green-900 hover:bg-green-800 text-white text-base shadow-lg rounded-lg md:px-10"
// 			>
// 				Pay with Paystack
// 			</Button>
// 			<ErrorMessage error={errorMessage} data-testid="paystack-payment-error-message" />
// 		</div>
// 	);

// 	// return (
// 	// 	<PaystackButton
// 	// 		publicKey={PAYSTACK_PUBLIC_KEY}
// 	// 		email={cart?.email || ''}
// 	// 		amount={cart?.total || 0}
// 	// 		currency="KES"
// 	// 		reference={txRef}
// 	// 		text={submitting ? 'submitting' : 'New paystack button'}
// 	// 		onSuccess={onPaymentCompleted}
// 	// 	/>
// 	// );
// };

// const PaystackPaymentButton = ({
// 	session,
// 	notReady,
// }: {
// 	session: HttpTypes.StorePaymentSession | undefined;
// 	notReady: boolean;
// }) => {
// 	const paystackRef = useRef<InstanceType<typeof Paystack> | null>(null);
// 	const [isLaunching, setIsLaunching] = useState(false);
// 	const [errorMessage, setErrorMessage] = useState<string | null>(null);
// 	const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
// 	const [statusMessage, setStatusMessage] = useState<string | null>(null);
// 	const accessCode = session?.data.paystackTxAccessCode as string | undefined;

// 	useEffect(() => {
// 		// Pre-initialize Paystack so the iframe is mounted before the user clicks (prevents flicker).
// 		if (!accessCode) return;
// 		paystackRef.current = new Paystack();

// 		return () => {
// 			// Clean up any in-flight transaction when the component unmounts.
// 			paystackRef.current?.cancelTransaction?.(accessCode);
// 			paystackRef.current = null;
// 		};
// 	}, [accessCode]);

// 	// If the session is not ready, we don't want to render the button
// 	if (notReady || !session) return null;

// 	// Get the accessCode added to the session data by the Paystack plugin
// 	if (!accessCode) throw new Error('Transaction access code is not defined');

// 	const handlePaystack = () => {
// 		if (isLaunching) return;
// 		if (!paystackRef.current) {
// 			paystackRef.current = new Paystack();
// 		}

// 		setErrorMessage(null);
// 		setIsLaunching(true);

// 		try {
// 			paystackRef.current.resumeTransaction({
// 				accessCode,
// 				async onSuccess() {
// 					// Payment succeeded on Paystack; backend webhook should now finalize the cart/order.
// 					setAwaitingConfirmation(true);
// 					setStatusMessage('Payment received. Waiting for confirmation...');
// 					try {
// 						await placeOrder();
// 					} catch (err: any) {
// 						setErrorMessage(err?.message || 'Unable to finalize order on the server.');
// 					}
// 					setIsLaunching(false);
// 				},
// 				onCancel() {
// 					setIsLaunching(false);
// 					setErrorMessage('Payment was cancelled.');
// 				},
// 				onError(error: unknown) {
// 					setIsLaunching(false);
// 					setErrorMessage((error as Error)?.message || 'Payment was not completed.');
// 				},
// 			});
// 		} catch (err: any) {
// 			setIsLaunching(false);
// 			setErrorMessage(err?.message || 'Unable to start Paystack payment.');
// 		}
// 	};

// 	return (
// 		<div className="flex flex-col gap-2">
// 			<Button
// 				type="button"
// 				disabled={notReady || isLaunching || awaitingConfirmation}
// 				isLoading={isLaunching || awaitingConfirmation}
// 				onClick={handlePaystack}
// 				size="large"
// 				data-testid="paystack-payment-button"
// 				className="bg-green-900 hover:bg-green-800 text-white text-base shadow-lg rounded-lg md:px-10"
// 			>
// 				{awaitingConfirmation ? 'Waiting for confirmation…' : 'Pay with Paystack'}
// 			</Button>
// 			{statusMessage && <p className="text-sm text-green-900">{statusMessage}</p>}
// 			<ErrorMessage error={errorMessage} data-testid="paystack-payment-error-message" />
// 		</div>
// 	);
// };

// const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY || '';
const PAYSTACK_PUBLIC_KEY = 'pk_test_8a59cab1e57bca6b769729627cc3e39fa782c7ea';
// process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY || '';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

// process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY || '';
const PaystackPaymentButton = ({
	session,
	notReady,
	cart,
}: {
	session: HttpTypes.StorePaymentSession | undefined;
	notReady: boolean;
	cart: HttpTypes.StoreCart;
}) => {
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [statusMessage, setStatusMessage] = useState<string | null>(null);
	const [attempt, setAttempt] = useState(0);
	const [seed] = useState(() => Date.now());

	// Reset the attempt counter whenever the session or cart changes
	useEffect(() => {
		setAttempt(0);
	}, [session?.id, cart.id]);

	// Paystack expects smallest currency unit; ensure it's non-zero to avoid rejection.
	const amount = Math.max(cart.total ?? 0, 1);
	const email = cart.email || `${cart.shipping_address?.first_name || 'guest'}@checkout.local`;
	const currency = (cart.region?.currency_code || 'KES').toUpperCase();
	const baseReference =
		(session?.data as any)?.paystackTxRef ||
		(session?.data as any)?.paystackTxAccessCode ||
		session?.id ||
		cart.id ||
		'ps';
	const reference = useMemo(
		() => `${baseReference}-${seed}-${attempt}`,
		[baseReference, seed, attempt],
	);
	// Stable per attempt to avoid duplicate transaction references

	if (notReady || !session) return null;

	if (!PAYSTACK_PUBLIC_KEY) {
		return <ErrorMessage error="Paystack public key is not configured." />;
	}

	const handleSuccess = async () => {
		setSubmitting(true);
		setErrorMessage(null);
		setStatusMessage('Payment received. Finalizing your order...');

		try {
			const maxAttempts = 15;
			const delayMs = 1200;
			for (let i = 0; i < maxAttempts; i++) {
				const res = await fetch(`/store/orders?cart_id=${cart.id}`, {
					method: 'GET',
					headers: {
						accept: 'application/json',
						...(PUBLISHABLE_KEY ? { 'x-publishable-api-key': PUBLISHABLE_KEY } : {}),
						'X-Public-Access': 'true',
					},
					credentials: 'include',
				}).catch(() => null);

				if (res?.status === 401 || res?.status === 403) {
					setErrorMessage(
						'Unable to check order status (401). Ensure NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is set and /store/orders allows public access.',
					);
					break;
				}

				if (res?.ok) {
					const data = await res.json();
					const order = data?.orders?.[0];
					if (order) {
						const countryCode = order.shipping_address?.country_code?.toLowerCase?.() || '';
						if (countryCode && order.id) {
							window.location.href = `/${countryCode}/order/${order.id}/confirmed`;
							return;
						}
					}
				}

				await new Promise((resolve) => setTimeout(resolve, delayMs));
			}

			setErrorMessage(
				'Payment recorded. Waiting for order confirmation... Please refresh if it does not redirect.',
			);
		} catch (err: any) {
			setErrorMessage(err?.message || 'Payment recorded; awaiting confirmation.');
		} finally {
			setSubmitting(false);
			setAttempt((a) => a + 1);
		}
	};

	const handleClose = () => {
		setSubmitting(false);
		setAttempt((a) => a + 1);
		setStatusMessage(null);
	};

	return (
		<div className="flex flex-col gap-2">
			<PaystackButton
				key={reference}
				email={email}
				amount={amount}
				reference={String(reference)}
				publicKey={PAYSTACK_PUBLIC_KEY}
				currency={currency}
				text={submitting ? 'Waiting for confirmation…' : 'Pay with Paystack'}
				onSuccess={handleSuccess}
				onClose={handleClose}
				disabled={notReady || submitting}
				className="bg-green-900 hover:bg-green-800 text-white text-base shadow-lg rounded-lg md:px-10 px-6 py-3 disabled:opacity-60"
			/>
			{statusMessage && <p className="text-sm text-green-900">{statusMessage}</p>}
			<ErrorMessage error={errorMessage} data-testid="paystack-payment-error-message" />
		</div>
	);
};

const StripePaymentButton = ({
	cart,
	notReady,
	'data-testid': dataTestId,
}: {
	cart: HttpTypes.StoreCart;
	notReady: boolean;
	'data-testid'?: string;
}) => {
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const onPaymentCompleted = async () => {
		await placeOrder()
			.catch((err) => {
				setErrorMessage(err.message);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const stripe = useStripe();
	const elements = useElements();
	const card = elements?.getElement('card');

	const session = cart.payment_collection?.payment_sessions?.find((s) => s.status === 'pending');

	const disabled = !stripe || !elements ? true : false;

	const handlePayment = async () => {
		setSubmitting(true);

		if (!stripe || !elements || !card || !cart) {
			setSubmitting(false);
			return;
		}

		await stripe
			.confirmCardPayment(session?.data.client_secret as string, {
				payment_method: {
					card: card,
					billing_details: {
						name: cart.billing_address?.first_name + ' ' + cart.billing_address?.last_name,
						address: {
							city: cart.billing_address?.city ?? undefined,
							country: cart.billing_address?.country_code ?? undefined,
							line1: cart.billing_address?.address_1 ?? undefined,
							line2: cart.billing_address?.address_2 ?? undefined,
							postal_code: cart.billing_address?.postal_code ?? undefined,
							state: cart.billing_address?.province ?? undefined,
						},
						email: cart.email,
						phone: cart.billing_address?.phone ?? undefined,
					},
				},
			})
			.then(({ error, paymentIntent }) => {
				if (error) {
					const pi = error.payment_intent;

					if ((pi && pi.status === 'requires_capture') || (pi && pi.status === 'succeeded')) {
						onPaymentCompleted();
					}

					setErrorMessage(error.message || null);
					return;
				}

				if (
					(paymentIntent && paymentIntent.status === 'requires_capture') ||
					paymentIntent.status === 'succeeded'
				) {
					return onPaymentCompleted();
				}

				return;
			});
	};

	return (
		<>
			<Button
				disabled={disabled || notReady}
				onClick={handlePayment}
				size="large"
				isLoading={submitting}
				data-testid={dataTestId}
				className="bg-green-900 hover:bg-green-800 text-white text-base shadow-lg rounded-lg md:px-10"
			>
				Place order
			</Button>
			<ErrorMessage error={errorMessage} data-testid="stripe-payment-error-message" />
		</>
	);
};

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const onPaymentCompleted = async () => {
		await placeOrder()
			.catch((err) => {
				setErrorMessage(err.message);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const handlePayment = () => {
		setSubmitting(true);

		onPaymentCompleted();
	};

	return (
		<>
			<Button
				disabled={notReady}
				isLoading={submitting}
				onClick={handlePayment}
				size="large"
				data-testid="submit-order-button"
				className="bg-green-900 hover:bg-green-800 text-white text-base shadow-lg rounded-lg md:px-10"
			>
				Place order
			</Button>
			<ErrorMessage error={errorMessage} data-testid="manual-payment-error-message" />
		</>
	);
};

export default PaymentButton;

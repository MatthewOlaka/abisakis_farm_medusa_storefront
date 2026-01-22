'use client';

import { faCircleCheck, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RadioGroup } from '@headlessui/react';
import { paymentInfoMap } from '@lib/constants';
import { initiatePaymentSession } from '@lib/data/cart';
import { Button, Container, Heading, Text, clx } from '@medusajs/ui';
import ErrorMessage from '@modules/checkout/components/error-message';
import PaymentContainer from '@modules/checkout/components/payment-container';
import Divider from '@modules/common/components/divider';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button as EditButton } from '@modules/common/components/button';

const Payment = ({
	cart,
	availablePaymentMethods,
}: {
	cart: any;
	availablePaymentMethods: any[];
}) => {
	const activeSession = cart.payment_collection?.payment_sessions?.find(
		(paymentSession: any) => paymentSession.status === 'pending',
	);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
		activeSession?.provider_id ?? '',
	);

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const isOpen = searchParams.get('step') === 'payment';

	useEffect(() => {
		// default to the active session or the first available method
		if (!selectedPaymentMethod && availablePaymentMethods?.length) {
			setSelectedPaymentMethod(activeSession?.provider_id ?? availablePaymentMethods[0].id);
		}
	}, [activeSession?.provider_id, availablePaymentMethods, selectedPaymentMethod]);

	const setPaymentMethod = async (method: string) => {
		setError(null);
		setSelectedPaymentMethod(method);
		try {
			await initiatePaymentSession(cart, {
				provider_id: method,
				data: {
					email: cart?.email,
				},
			});
		} catch (err: any) {
			setError(err.message);
		}
	};

	const paidByGiftcard = cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0;

	const paymentReady =
		((activeSession || selectedPaymentMethod) && cart?.shipping_methods.length !== 0) ||
		paidByGiftcard;

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams);
			params.set(name, value);

			return params.toString();
		},
		[searchParams],
	);

	const handleEdit = () => {
		router.push(pathname + '?' + createQueryString('step', 'payment'), {
			scroll: false,
		});
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const checkActiveSession = activeSession?.provider_id === selectedPaymentMethod;

			if (!checkActiveSession) {
				await initiatePaymentSession(cart, {
					provider_id: selectedPaymentMethod,
					data: {
						email: cart?.email,
					},
				});
			}

			return router.push(pathname + '?' + createQueryString('step', 'review'), {
				scroll: false,
			});
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		setError(null);
	}, [isOpen]);

	return (
		<div className="bg-yellow-100">
			<div className="flex flex-row items-center justify-between mb-6">
				<Heading
					level="h2"
					className={clx(
						'flex flex-row text-green-900 font-serif text-3xl md:text-4xl font-bold gap-x-2 items-center',
						{
							'opacity-50 pointer-events-none select-none': !isOpen && !paymentReady,
						},
					)}
				>
					Payment
					{!isOpen && paymentReady && (
						<FontAwesomeIcon icon={faCircleCheck} className="text-lg md:text-xl" />
					)}
				</Heading>
				{!isOpen && paymentReady && (
					<EditButton
						wrapperClass="hover:bg-green-900 hover:!text-white !text-green-900 border border-green-900 px-1 py-1 rounded-md flex gap-1 md:gap-2 items-center"
						primaryColor="bg-transparent"
						text="Edit"
						onClick={handleEdit}
						size="small"
						icon={faPencil}
					/>
				)}
			</div>
			<div>
				<div className={isOpen ? 'block' : 'hidden'}>
					{!paidByGiftcard && availablePaymentMethods?.length && (
						<>
							<RadioGroup
								value={selectedPaymentMethod}
								onChange={(value: string) => setPaymentMethod(value)}
							>
								{availablePaymentMethods.map((paymentMethod) => (
									<div key={paymentMethod.id}>
										<PaymentContainer
											paymentInfoMap={paymentInfoMap}
											paymentProviderId={paymentMethod.id}
											selectedPaymentOptionId={selectedPaymentMethod}
										/>
									</div>
								))}
							</RadioGroup>
						</>
					)}

					{paidByGiftcard && (
						<div className="flex flex-col w-1/3">
							<Text className="txt-medium-plus text-ui-fg-base mb-1">Payment method</Text>
							<Text className="txt-medium text-ui-fg-subtle" data-testid="payment-method-summary">
								Gift card
							</Text>
						</div>
					)}

					<ErrorMessage error={error} data-testid="payment-method-error-message" />

					<Button
						size="large"
						className="mt-6 bg-green-900 hover:bg-green-800 text-white text-base shadow-lg rounded-lg md:px-10"
						onClick={handleSubmit}
						isLoading={isLoading}
						disabled={!selectedPaymentMethod && !paidByGiftcard}
						data-testid="submit-payment-button"
					>
						Continue to review
					</Button>
				</div>

				<div className={isOpen ? 'hidden' : 'block'}>
					{cart && paymentReady && (activeSession || selectedPaymentMethod) ? (
						<div className="flex items-start gap-x-1 w-full">
							<div className="flex flex-col w-1/3">
								<Text className="txt-medium-plus text-ui-fg-base mb-1">Payment method</Text>
								<Text className="txt-medium text-ui-fg-subtle" data-testid="payment-method-summary">
									{paymentInfoMap[activeSession?.provider_id ?? selectedPaymentMethod]?.title ||
										activeSession?.provider_id ||
										selectedPaymentMethod}
								</Text>
							</div>
							<div className="flex flex-col w-1/3">
								<Text className="txt-medium-plus text-ui-fg-base mb-1">Payment details</Text>
								<div
									className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
									data-testid="payment-details-summary"
								>
									<Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
										{paymentInfoMap[selectedPaymentMethod]?.icon ||
											paymentInfoMap[activeSession?.provider_id ?? '']?.icon}
									</Container>
									<Text>
										{paymentInfoMap[selectedPaymentMethod]?.title ||
											paymentInfoMap[activeSession?.provider_id ?? '']?.title}
									</Text>
								</div>
							</div>
						</div>
					) : paidByGiftcard ? (
						<div className="flex flex-col w-1/3">
							<Text className="txt-medium-plus text-ui-fg-base mb-1">Payment method</Text>
							<Text className="txt-medium text-ui-fg-subtle" data-testid="payment-method-summary">
								Gift card
							</Text>
						</div>
					) : null}
				</div>
			</div>
			<Divider className="mt-8" />
		</div>
	);
};

export default Payment;

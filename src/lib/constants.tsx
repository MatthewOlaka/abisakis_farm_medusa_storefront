import React from 'react';
import { CreditCard } from '@medusajs/icons';

import Ideal from '@modules/common/icons/ideal';
import Bancontact from '@modules/common/icons/bancontact';
import PayPal from '@modules/common/icons/paypal';
import { ICategory } from 'types/global';

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<string, { title: string; icon: React.JSX.Element }> = {
	// paystack: {
	// 	title: 'Paystack',
	// 	icon: <CreditCard />,
	// },
	pp_paystack: {
		title: 'Paystack',
		icon: <CreditCard />,
	},
	// pp_paystack_paystack: {
	// 	title: 'Paystack',
	// 	icon: <CreditCard />,
	// },
	pp_stripe_stripe: {
		title: 'Credit card',
		icon: <CreditCard />,
	},
	'pp_stripe-ideal_stripe': {
		title: 'iDeal',
		icon: <Ideal />,
	},
	'pp_stripe-bancontact_stripe': {
		title: 'Bancontact',
		icon: <Bancontact />,
	},
	pp_paypal_paypal: {
		title: 'PayPal',
		icon: <PayPal />,
	},
	pp_system_default: {
		title: 'Manual Payment',
		icon: <CreditCard />,
	},
	// manual: {
	// 	title: 'Manual Payment',
	// 	icon: <CreditCard />,
	// },
	// Add more payment providers here
};

// This only checks if it is native stripe for card payments, it ignores the other stripe-based providers
export const isStripe = (providerId?: string) => {
	return providerId?.startsWith('pp_stripe_');
};
// export const isPaystack = (providerId?: string) => {
// 	return !!providerId && providerId.toLowerCase().includes('paystack');
// };
export const isPaystack = (providerId?: string) => {
	return providerId?.startsWith('pp_paystack');
};

export const isPaypal = (providerId?: string) => {
	return providerId?.startsWith('pp_paypal');
};
export const isManual = (providerId?: string) => {
	return providerId?.startsWith('pp_system_default');
};

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
	'krw',
	'jpy',
	'vnd',
	'clp',
	'pyg',
	'xaf',
	'xof',
	'bif',
	'djf',
	'gnf',
	'kmf',
	'mga',
	'rwf',
	'xpf',
	'htg',
	'vuv',
	'xag',
	'xdr',
	'xau',
	'kes',
];

export const categories: ICategory[] = ['bundle', 'honey', 'coffee', 'more'];
export const categoryLabels: Record<ICategory, string> = {
	bundle: 'Bundles',
	honey: 'Honey',
	coffee: 'Coffee',
	more: 'More',
};
export const categoryImages: Record<ICategory, string> = {
	bundle: '/images/YDbag1.png',
	honey: '/images/honeyComb.png',
	coffee: '/images/roastedBeans.png',
	more: '/images/avocados.png',
};

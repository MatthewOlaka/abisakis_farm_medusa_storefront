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

//Generic images
export const HERO_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/generic/Hero.jpeg';
export const BRANCH_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/generic/branch.png';
export const CHERRY_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/generic/cherry.png';
export const BEE_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/generic/bee.png';
export const BEE_MAILBOX_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/generic/beeMailbox.png';
export const CHILLI_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/generic/chilli.png';
export const COFFEE_BEAN_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/generic/coffeeBean.png';
export const COFFEE_MUG_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/generic/coffeeMug.png';
export const HONEY_COMB_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/generic/honeyComb.png';
export const HONEY_SPOON_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/generic/honeySpoon.png';
export const ROASTED_BEANS_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/generic/roastedBeans.png';
export const BUNDLE_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/generic/bundle1.png';
export const AVOCADOS_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/generic/avocados.png';

//Product images
export const HONEY_JAR_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/products/honeyJar1.png';
export const BAG_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/products/YDbag1.png';
export const CAYENNE_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/products/YDCayenne.png';
export const COFFEE_BAG_1_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/products/YDcoffeeBag1.png';
export const COFFEE_BAG_2_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/products/YDcoffeeBag2.png';
export const PAPRIKA_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/products/YDPaprika.png';
export const SQUEEZE_BOTTLE_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/products/YDSqueezeBottle.png';

export const categories: ICategory[] = ['bundle', 'honey', 'coffee', 'more'];
export const categoryLabels: Record<ICategory, string> = {
	bundle: 'Bundles',
	honey: 'Honey',
	coffee: 'Coffee',
	more: 'More',
};
export const categoryImages: Record<ICategory, string> = {
	bundle: BUNDLE_IMAGE_URL,
	honey: HONEY_COMB_IMAGE_URL,
	coffee: ROASTED_BEANS_IMAGE_URL,
	more: AVOCADOS_IMAGE_URL,
};

export const MAP_CENTER = { lat: 0.9941949, lng: 35.1327557 };

export const MAP_PERIMETER = [
	{ lat: 0.9966, lng: 35.1323 },
	{ lat: 0.997, lng: 35.1337 },
	{ lat: 0.9918, lng: 35.1339 },
	{ lat: 0.9915, lng: 35.1312 },
];

export const MAP_MARKERS = [
	{
		title: 'Bee hives',
		position: { lat: 0.996162, lng: 35.132909 },
		description:
			'Area for uncolonized hives and where new colonies are introduced before moving them across the farm.',
		imageSrc:
			'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/map/hives.jpg',
	},
	{
		title: 'Cluster 1',
		position: { lat: 0.995779, lng: 35.132868 },
		description:
			'Upper coffee cluster near blue gum trees, mixing Batian and Ruiru 11, interplanted with macadamia and close to nearby hives.',
		imageSrc:
			'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/map/cluster1.jpg',
	},
	{
		title: 'Drying Beds',
		position: { lat: 0.99512, lng: 35.13232 },
		description:
			'Raised drying beds where coffee is carefully sun-dried, protected from unwanted aromas, and covered during rain to preserve quality.',
		imageSrc:
			'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/map/beds.jpg',
	},
	{
		title: 'Factory',
		position: { lat: 0.9948, lng: 35.13232 },
		description:
			'Our processing hub where coffee is pulped, washed, processed, and prepared for storage or packaging with care.',
		imageSrc:
			'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/slideshow/carefulPulping.jpg',
	},
	{
		title: 'Poultry housing',
		position: { lat: 0.994767, lng: 35.13215 },
		description:
			'Home to our chickens, mainly broilers with some kienyeji, raised with care as part of our integrated farm system.',
		imageSrc:
			'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/map/poultry.jpg',
	},
	{
		title: 'Villa',
		position: { lat: 0.995179, lng: 35.132842 },
		description:
			'Our home on the farm where we live and work, sadly not open to guests, unless you come bearing gifts or food for Matthew.',
		imageSrc:
			'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/map/villa.jpg',
	},
	{
		title: 'Avocado trees',
		position: { lat: 0.9947, lng: 35.132845 },
		description:
			'A grove of avocado trees growing alongside the farm, adding diversity, shade, and seasonal fruit to our landscape.',
		imageSrc:
			'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/landing/avocado.jpeg',
	},
	{
		title: 'Apiary',
		position: { lat: 0.9948, lng: 35.13355 },
		description:
			'Main apiary where most hives are kept and honey is harvested, supporting pollination across the farm.',
		imageSrc:
			'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/map/apiary.jpg',
	},
	{
		title: 'Cluster 2',
		position: { lat: 0.995274, lng: 35.133355 },
		description:
			'Coffee cluster mainly Batian, surrounded by flowering plants and located close to the apiary and villa.',
		imageSrc:
			'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/map/cluster2.jpg',
	},
	{
		title: 'Cluster 3',
		position: { lat: 0.9939, lng: 35.132706 },
		description:
			'A balanced mix of Batian and Ruiru 11 coffee trees, interplanted with macadamia for diversity and soil health.',
		imageSrc:
			'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/map/cluster3.jpg',
	},
	{
		title: 'Cluster 4',
		position: { lat: 0.9932, lng: 35.132706 },
		description:
			'Similar to Cluster 3, with Batian and Ruiru 11 interplanted with macadamia, supporting consistent and diverse production.',
		imageSrc:
			'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/map/cluster4.jpg',
	},
	{
		title: 'Cluster 5',
		position: { lat: 0.992103, lng: 35.132579 },
		description:
			'Our fully organic coffee section, grown without synthetic inputs and managed with natural, sustainable farming practices.',
		imageSrc:
			'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/map/cluster5.jpg',
	},
];

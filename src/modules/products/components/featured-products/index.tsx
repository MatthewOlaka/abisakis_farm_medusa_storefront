'use server';

import { listProducts } from '@lib/data/products';
import { getRegion } from '@lib/data/regions';
import { getCategoryByHandle } from '@lib/data/categories';
import { HttpTypes } from '@medusajs/types';
import Title from '@modules/common/components/title';
import ItemCard from '../item-card';

type Props = {
	countryCode: string;
	categoryHandle: string;
	title?: string;
	titleWrapperClass?: string;
	gridClassName?: string;
};

function formatPrice(p: HttpTypes.StoreProduct) {
	const v = p.variants?.[0]?.calculated_price;
	if (!v) return '';
	const amount =
		typeof v.calculated_amount === 'number'
			? v.calculated_amount
			: Number(v.calculated_amount ?? 0);
	const code = v.currency_code?.toUpperCase() || 'USD';
	try {
		return new Intl.NumberFormat(undefined, { style: 'currency', currency: code }).format(amount);
	} catch {
		return `${code} ${amount}`;
	}
}

export default async function FeaturedProducts({
	countryCode,
	categoryHandle,
	title = 'Featured Products',
	titleWrapperClass,
	gridClassName,
}: Props) {
	const region = await getRegion(countryCode);
	if (!region) return null;

	const category = await getCategoryByHandle(categoryHandle);
	if (!category?.id) return null;

	const fields =
		'id,title,handle,thumbnail,*variants.calculated_price,+variants.inventory_quantity,*tags,+images';

	const { response } = await listProducts({
		countryCode,
		queryParams: {
			category_id: [category.id],
			fields,
			limit: 3,
			is_giftcard: false,
		},
	});

	const products = response.products || [];
	if (products.length === 0) return null;

	const isBestSeller = (p: HttpTypes.StoreProduct) =>
		Array.isArray(p.tags) && p.tags.some((t) => t?.value?.toLowerCase() === 'bestseller');

	return (
		<div className="w-full">
			<Title title={title} wrapperClass={titleWrapperClass} />
			<div
				className={
					gridClassName ??
					'mt-40 flex w-full flex-col items-center justify-center gap-20 md:flex-row md:gap-5 lg:gap-20'
				}
			>
				{products.slice(0, 3).map((p) => (
					<ItemCard
						key={p.id}
						id={p.variants?.[0]?.id || ''}
						title={p.title}
						price={formatPrice(p)}
						imageSrc={p.thumbnail || p.images?.[0]?.url || '/placeholder.svg'}
						href={`/${countryCode}/products/${p.handle}`}
						bestSeller={isBestSeller(p)}
					/>
				))}
			</div>
		</div>
	);
}

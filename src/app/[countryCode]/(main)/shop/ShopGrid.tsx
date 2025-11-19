import { listProducts } from '@lib/data/products';
import { getRegion } from '@lib/data/regions';
import { getCategoryByHandle } from '@lib/data/categories';
import ItemCard from '@modules/products/components/item-card';

// Accepts Medusa's BaseCalculatedPriceSet-like shape
function fmt(price?: {
	calculated_amount?: number | string | null;
	currency_code?: string | null;
}) {
	if (!price || price.calculated_amount == null || !price.currency_code) return '';

	const amount =
		typeof price.calculated_amount === 'number'
			? price.calculated_amount
			: Number(price.calculated_amount);

	try {
		return new Intl.NumberFormat(undefined, {
			style: 'currency',
			currency: price.currency_code.toUpperCase(),
		}).format(amount);
	} catch {
		return `${(price.currency_code || 'USD').toUpperCase()} ${amount}`;
	}
}

export default async function ShopGrid({
	countryCode,
	category,
}: {
	countryCode: string;
	category: string;
}) {
	const region = await getRegion(countryCode);

	// Ask for exactly what the Product page needs too (price, tags, images)
	const fields = 'id,title,handle,thumbnail,*variants.calculated_price,+tags,+images';
	const query: Record<string, any> = {
		fields,
		limit: 60,
		is_giftcard: false,
		region_id: region?.id,
	};

	// "more" = all products. Others = resolve category by handle and filter
	if (category !== 'more') {
		const cat = await getCategoryByHandle(category);
		if (cat?.id) query.category_id = [cat.id];
	}

	const { response } = await listProducts({ countryCode, queryParams: query });
	const products = response.products || [];

	return (
		<div className="flex w-full justify-center">
			{/* <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-52"> */}
			<div className="xs:mt-40 xs:gap-y-32 mt-20 grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4l">
				{products.map((p) => (
					<ItemCard
						key={p.id}
						id={p.variants?.[0]?.id || ''} // variant id for add-to-cart
						title={p.title}
						price={fmt(p.variants?.[0]?.calculated_price)}
						imageSrc={p.thumbnail || p.images?.[0]?.url || '/placeholder.svg'}
						href={`/${countryCode}/products/${p.handle}`}
						bestSeller={
							Array.isArray(p.tags) && p.tags.some((t) => t?.value?.toLowerCase() === 'bestseller')
						}
					/>
				))}
			</div>
		</div>
	);
}

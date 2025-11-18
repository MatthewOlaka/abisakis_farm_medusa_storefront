// import { listProducts } from '@lib/data/products';
// import { getRegion } from '@lib/data/regions';
// import { HttpTypes } from '@medusajs/types';
// import Product from '../product-preview';
// // import ItemCard from '../item-card';

// type RelatedProductsProps = {
// 	product: HttpTypes.StoreProduct;
// 	countryCode: string;
// };

// export default async function RelatedProducts({ product, countryCode }: RelatedProductsProps) {
// 	await new Promise((r) => setTimeout(r, 1200));
// 	const region = await getRegion(countryCode);

// 	if (!region) {
// 		return null;
// 	}

// 	// edit this function to define your related products logic
// 	const queryParams: HttpTypes.StoreProductListParams = {};
// 	if (region?.id) {
// 		queryParams.region_id = region.id;
// 	}
// 	if (product.collection_id) {
// 		queryParams.collection_id = [product.collection_id];
// 	}
// 	if (product.tags) {
// 		queryParams.tag_id = product.tags.map((t) => t.id).filter(Boolean) as string[];
// 	}
// 	queryParams.is_giftcard = false;

// 	const products = await listProducts({
// 		queryParams,
// 		countryCode,
// 	}).then(({ response }) => {
// 		return response.products.filter((responseProduct) => responseProduct.id !== product.id);
// 	});
// 	console.log('products :', products);

// 	if (!products.length) {
// 		return null;
// 	}

// 	return (
// 		<div className="product-page-constraint">
// 			<div className="flex flex-col items-center text-center mb-16">
// 				<span className="text-base-regular text-gray-600 mb-6">Related products</span>
// 				<p className="text-2xl-regular text-ui-fg-base max-w-lg">
// 					You might also want to check out these products.
// 				</p>
// 			</div>

// 			<ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
// 				{products.map((product) => (
// 					<li key={product.id}>
// 						<Product region={region} product={product} />
// 						{/* <ItemCard
// 										id={rp.id}
// 										key={rp.id}
// 										title={rp.title}
// 										price={rp.price ?? ''}
// 										imageSrc={rp.image_src ?? '/placeholder.png'}
// 										href={rp.href ?? `/shop/${rp.id}`}
// 										bestSeller={rp.best_seller}
// 									/> */}
// 					</li>
// 				))}
// 			</ul>
// 		</div>
// 	);
// }
import { listProducts } from '@lib/data/products';
import { getRegion } from '@lib/data/regions';
import { HttpTypes } from '@medusajs/types';
import ItemCard from '../item-card'; // ⬅️ adjust path if needed

type RelatedProductsProps = {
	product: HttpTypes.StoreProduct;
	countryCode: string;
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

export default async function RelatedProducts({ product, countryCode }: RelatedProductsProps) {
	const region = await getRegion(countryCode);
	if (!region) return null;

	const q: HttpTypes.StoreProductListParams = {
		is_giftcard: false,
		limit: 8,
		// keep fields minimal like your working version
		fields:
			'id,title,handle,thumbnail,*variants.calculated_price,+variants.inventory_quantity,*tags',
	};

	const catId = product.categories?.[0]?.id;
	if (catId) q.category_id = [catId];
	else if (product.collection_id) q.collection_id = [product.collection_id];
	else if (product.tags?.length) q.tag_id = product.tags.map((t) => t.id!).filter(Boolean);

	const products = await listProducts({ countryCode, queryParams: q }).then(({ response }) =>
		(response.products || []).filter((p) => p.id !== product.id),
	);

	const isBestSeller = (p: HttpTypes.StoreProduct) =>
		Array.isArray(p.tags) && p.tags.some((t) => t?.value?.toLowerCase() === 'bestseller');

	console.log('products in itemcard:', products);
	if (products.length === 0) {
		const { response } = await listProducts({
			countryCode,
			queryParams: { limit: 8, fields: q.fields, is_giftcard: false },
		});
		const any = (response.products || []).filter((p) => p.id !== product.id);
		if (any.length === 0) return null;
		console.log('any :', any);

		return (
			<Section>
				<div className="flex flex-col md:flex-row gap-28 md:gap-8 w-full justify-center pt-16">
					{any.slice(0, 3).map((p) => (
						<li key={p.id} className="flex justify-center">
							<ItemCard
								id={p.variants?.[0]?.id || ''}
								title={p.title}
								price={formatPrice(p)}
								imageSrc={p.thumbnail || '/placeholder.svg'}
								href={`/${countryCode}/products/${p.handle}`}
								bestSeller={isBestSeller(p)}
								// bestSeller={p.tags?.some((tag) => tag.value === 'bestseller')}
							/>
						</li>
					))}
				</div>
			</Section>
		);
	}

	return (
		<Section>
			<div className="flex flex-col md:flex-row gap-28 md:gap-8 w-full justify-center pt-16">
				{products.slice(0, 3).map((p) => (
					<li key={p.id} className="flex justify-center">
						<ItemCard
							id={p.variants?.[0]?.id || ''}
							title={p.title}
							price={formatPrice(p)}
							imageSrc={p.thumbnail || '/placeholder.svg'}
							href={`/${countryCode}/products/${p.handle}`}
							bestSeller={isBestSeller(p)}
						/>
					</li>
				))}
			</div>
		</Section>
	);
}

function Section({ children }: React.PropsWithChildren) {
	return (
		<div className="max-w-7xl">
			<div className="mb-16 flex flex-col items-center text-center">
				{/* <span className="mb-6 text-base-regular text-gray-600">{title}</span> */}
				<p className="text-3xl max-w-lg text-green-900 font-serif font-bold leading-9">
					You might also want to check out these products.
				</p>
			</div>
			{children}
		</div>
	);
}

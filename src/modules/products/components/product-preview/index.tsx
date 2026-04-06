import { Text } from '@medusajs/ui';
import { listProducts } from '@lib/data/products';
import { getProductPrice } from '@lib/util/get-product-price';
import { HttpTypes } from '@medusajs/types';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Thumbnail from '../thumbnail';
import PreviewPrice from './price';
import { isProductOutOfStock } from '@lib/util/product';

export default async function ProductPreview({
	product,
	isFeatured,
	region,
}: {
	product: HttpTypes.StoreProduct;
	isFeatured?: boolean;
	region: HttpTypes.StoreRegion;
}) {
	const pricedProduct = await listProducts({
		regionId: region.id,
		queryParams: { id: [product.id!] },
	}).then(({ response }) => response.products[0]);

	if (!pricedProduct) {
		return null;
	}

	const { cheapestPrice } = getProductPrice({
		product,
	});

	const outOfStock = isProductOutOfStock(pricedProduct);

	return (
		<LocalizedClientLink href={`/products/${product.handle}`} className="group">
			<div data-testid="product-wrapper" className="relative">
				<div className={outOfStock ? 'grayscale opacity-70' : ''}>
					<Thumbnail
						thumbnail={product.thumbnail}
						images={product.images}
						size="full"
						isFeatured={isFeatured}
					/>
				</div>
				{outOfStock && (
					<div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
						Out of Stock
					</div>
				)}
				<div className="flex txt-compact-medium mt-4 justify-between">
					<Text className="text-ui-fg-subtle" data-testid="product-title">
						{product.title}
					</Text>
					<div className="flex items-center gap-x-2">
						{outOfStock ? (
							<Text className="text-red-600 font-semibold">Out of Stock</Text>
						) : (
							cheapestPrice && <PreviewPrice price={cheapestPrice} />
						)}
					</div>
				</div>
			</div>
		</LocalizedClientLink>
	);
}

import { getBaseURL } from '@lib/util/env';
import { HttpTypes } from '@medusajs/types';

type Props = {
	product: HttpTypes.StoreProduct;
	countryCode: string;
};

/**
 * Product JSON-LD structured data for Google rich results.
 */
export default function ProductJsonLd({ product, countryCode }: Props) {
	const baseUrl = getBaseURL();
	const variant = product.variants?.[0];
	const price = variant?.calculated_price?.calculated_amount;
	const currency = variant?.calculated_price?.currency_code?.toUpperCase() || 'KES';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.title,
		description: product.description || product.title,
		image: product.thumbnail || product.images?.[0]?.url,
		url: `${baseUrl}/${countryCode}/products/${product.handle}`,
		brand: {
			'@type': 'Brand',
			name: "Abisaki's Farm",
		},
		...(price != null && {
			offers: {
				'@type': 'Offer',
				url: `${baseUrl}/${countryCode}/products/${product.handle}`,
				priceCurrency: currency,
				price: price,
				availability:
					variant?.manage_inventory && (variant?.inventory_quantity ?? 0) <= 0
						? 'https://schema.org/OutOfStock'
						: 'https://schema.org/InStock',
			},
		}),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}

import { listProducts } from '@lib/data/products';
import { getRegion, listRegions } from '@lib/data/regions';
import RelatedProducts from '@modules/products/components/related-products';
import ProductClient from '@modules/products/prod';
import SkeletonRelatedProducts from '@modules/skeletons/templates/skeleton-related-products';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type Props = {
	params: Promise<{ countryCode: string; handle: string }>;
};

export async function generateStaticParams() {
	try {
		const countryCodes = await listRegions().then((regions) =>
			regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat(),
		);

		if (!countryCodes) {
			return [];
		}

		const promises = countryCodes.map(async (country) => {
			const { response } = await listProducts({
				countryCode: country,
				queryParams: { limit: 100, fields: 'handle' },
			});

			return {
				country,
				products: response.products,
			};
		});

		const countryProducts = await Promise.all(promises);

		return countryProducts
			.flatMap((countryData) =>
				countryData.products.map((product) => ({
					countryCode: countryData.country,
					handle: product.handle,
				})),
			)
			.filter((param) => param.handle);
	} catch (error) {
		console.error(
			`Failed to generate static paths for product pages: ${
				error instanceof Error ? error.message : 'Unknown error'
			}.`,
		);
		return [];
	}
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const params = await props.params;
	console.log('params :', params);
	const { handle } = params;
	const region = await getRegion(params.countryCode);

	if (!region) {
		notFound();
	}

	const product = await listProducts({
		countryCode: params.countryCode,
		queryParams: { handle },
	}).then(({ response }) => response.products[0]);

	if (!product) {
		notFound();
	}

	return {
		title: `${product.title} | Medusa Store`,
		description: `${product.title}`,
		openGraph: {
			title: `${product.title} | Medusa Store`,
			description: `${product.title}`,
			images: product.thumbnail ? [product.thumbnail] : [],
		},
	};
}

export default async function ProductPage(props: Props) {
	const params = await props.params;
	const region = await getRegion(params.countryCode);

	if (!region) {
		notFound();
	}

	const pricedProduct = await listProducts({
		countryCode: params.countryCode,
		queryParams: {
			handle: params.handle, // ask for categories + a bit of ancestry for breadcrumbs if you want
			fields:
				'*categories, *categories.parent_category, *categories.parent_category.parent_category, *variants.calculated_price,+variants.inventory_quantity,+metadata,+tags',
		},
	}).then(({ response }) => response.products[0]);

	if (!pricedProduct) {
		notFound();
	}

	const relatedNode = (
		<Suspense fallback={<SkeletonRelatedProducts />}>
			<RelatedProducts product={pricedProduct} countryCode={params.countryCode} />
		</Suspense>
	);

	return (
		// <ProductTemplate product={pricedProduct} region={region} countryCode={params.countryCode} />
		<ProductClient
			product={pricedProduct}
			region={region}
			countryCode={params.countryCode}
			relatedProducts={relatedNode}
		/>
	);
}

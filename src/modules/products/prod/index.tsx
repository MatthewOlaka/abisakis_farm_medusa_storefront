'use client';
import React, { useMemo, useState } from 'react';
import { notFound } from 'next/navigation';
import { HttpTypes } from '@medusajs/types';
import Link from 'next/link';
import ProductGallery from '../components/product-gallery';
import QuantityPicker from '../components/quantity-picker';
import { addToCart } from '@lib/data/cart';
import { toast } from 'sonner';

type ProductTemplateProps = {
	product: HttpTypes.StoreProduct;
	region: HttpTypes.StoreRegion;
	countryCode: string;
	relatedProducts: React.ReactNode;
};

const ProductClient: React.FC<ProductTemplateProps> = ({
	product,
	// region,
	countryCode,
	relatedProducts,
}) => {
	const filteredImages = (product.images ?? []).map((image) => image.url);
	const price = product.variants
		? product.variants[0].calculated_price?.calculated_amount?.toString()
		: '';
	const currency = product.variants ? product.variants[0].calculated_price?.currency_code : '';
	const isBestSeller = product.tags?.some((tag) => tag.value === 'bestseller');
	const extendedDescription = product.metadata
		? (product.metadata['extended_description'] as string)
		: null;
	const [purchaceQty, setPurchaseQty] = useState(1);
	const [isAdding, setIsAdding] = useState(false);

	const inStock = useMemo(() => {
		// If we don't manage inventory, we can always add to cart
		if (product.variants && !product.variants[0].manage_inventory) {
			return true;
		}

		// If we allow back orders on the variant, we can add to cart
		if (product.variants && product.variants[0]?.allow_backorder) {
			return true;
		}

		// If there is inventory available, we can add to cart
		if (
			product.variants &&
			product.variants[0]?.manage_inventory &&
			(product.variants[0]?.inventory_quantity || 0) > 0
		) {
			return true;
		}

		// Otherwise, we can't add to cart
		return false;
	}, [product]);

	// add the selected variant to the cart
	const handleAddToCart = async () => {
		if (product.variants && !product.variants[0]?.id) return null;

		setIsAdding(true);

		const { error } = await addToCart({
			variantId: product.variants ? product?.variants[0].id : '',
			quantity: purchaceQty,
			countryCode,
		});

		if (error) {
			toast.error(error);
		} else {
			toast.success('Added to cart');
		}

		setIsAdding(false);
	};

	if (!product || !product.id) {
		return notFound();
	}

	return (
		// <>
		// 	<div
		// 		className="content-container flex flex-col small:flex-row small:items-start py-6 relative"
		// 		data-testid="product-container"
		// 	>
		// 		<div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
		// 			<ProductInfo product={product} />
		// 			<ProductTabs product={product} />
		// 		</div>
		// 		<div className="block w-full relative">
		// 			<ImageGallery images={product?.images || []} />
		// 		</div>
		// 		<div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
		// 			<ProductOnboardingCta />
		// 			<Suspense fallback={<ProductActions disabled={true} product={product} region={region} />}>
		// 				<ProductActionsWrapper id={product.id} region={region} />
		// 			</Suspense>
		// 		</div>
		// 	</div>
		// 	<div className="content-container my-16 small:my-32" data-testid="related-products-container">
		// 		<Suspense fallback={<SkeletonRelatedProducts />}>
		// 			<RelatedProducts product={product} countryCode={countryCode} />
		// 		</Suspense>
		// 	</div>
		// </>

		<main className="px-4 py-10">
			<div className="mx-auto w-full max-w-4xl">
				{product.categories && product.categories.length > 0 ? (
					<Link
						href={{ pathname: '/shop', query: { c: product.categories[0].name, s: '1' } }}
						// href={'/shop'}
						className="text-sm text-green-900 hover:underline"
					>
						← Back to Shop
					</Link>
				) : (
					<Link href={'/shop'} className="text-sm text-green-900 hover:underline">
						← Back to Shop
					</Link>
				)}

				<div className="xs:mt-15 mt-10 flex flex-col items-center justify-center gap-10 md:flex-row">
					<div
						className={`xs:mt-5 flex justify-center gap-6 ${!inStock ? 'grayscale opacity-70' : ''}`}
					>
						<ProductGallery
							mainSrc={product.thumbnail ?? product.images?.[0].url ?? '/placeholder.svg'}
							alt={product.title}
							thumbs={filteredImages}
							// Example: explicit height so Next/Image with `fill` has a sized positioned parent
							mainBoxClass="relative h-[400px] w-full max-w-[300px]"
							mainSizes="(max-width:768px) 90vw, 400px"
						/>
					</div>

					<div className="flex h-[450px] w-full max-w-96 rounded-xl bg-green-900 mx-5">
						<div className="flex h-full w-full flex-col items-center justify-around">
							{isBestSeller ? (
								<p className="inline-block bg-gradient-to-b from-white via-white/50 to-transparent bg-clip-text font-serif text-7xl font-bold text-transparent [-webkit-text-fill-color:transparent]">
									Best seller
								</p>
							) : (
								<div className="h-0" />
							)}

							<p className="font-serif text-3xl font-bold text-yellow-200">{product.title}</p>
							{!inStock ? (
								<p className="font-serif text-xl text-red-400 font-semibold">Out of Stock</p>
							) : (
								<p className="font-serif text-xl text-white">
									{currency?.toUpperCase() + ' ' + price}
								</p>
							)}
							<p className="text-md mx-5 mb-5 text-center text-white">{product.description}</p>

							<div className="flex w-full flex-col items-center">
								{inStock && (
									<QuantityPicker setQty={setPurchaseQty} qty={purchaceQty} min={1} max={20} />
								)}
								<button
									disabled={!inStock || isAdding}
									onClick={handleAddToCart}
									className={`text-1xl mb-6 flex h-12 w-full max-w-80 items-center justify-center rounded-md font-medium ${
										!inStock
											? 'bg-gray-400 text-gray-700 cursor-not-allowed'
											: 'bg-yellow-500 text-green-900 hover:bg-amber-400'
									}`}
								>
									{!inStock ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add To Cart'}
								</button>
							</div>
						</div>
					</div>
				</div>

				{extendedDescription && (
					<div className="xs:mx-10 mx-3 mb-15">
						<p className="xs:mb-3 mb-5 text-center font-serif text-3xl font-bold text-green-900 md:text-start">
							Description
						</p>
						<p className="text-center text-green-900 md:text-start">{extendedDescription}</p>
					</div>
				)}

				<div
					className="content-container my-16 small:my-32"
					data-testid="related-products-container"
				>
					{relatedProducts}
				</div>
			</div>
		</main>
	);
};

export default ProductClient;

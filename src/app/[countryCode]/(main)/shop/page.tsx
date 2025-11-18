import { type Metadata } from 'next';
import { getRegion } from '@lib/data/regions';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ShopFilters from './ShopFilters';
import GridSkeleton from '@modules/skeletons/components/skeleton-shop-grid';
import ShopGrid from './ShopGrid';
import ShopIntro, { ICategory } from '@modules/shop/shop-intro';
import MountReveal from '@modules/generic/mount-reveal.tsx';
import ShopScrollManager from './ShopScrollManager';
import ShopSectionText from './ShopSectionText';
import ShopCTA from './ShopCTA';

export const metadata: Metadata = {
	title: 'Shop | Abisaki’s Farm',
	description: 'Browse all products by category.',
};

type PageProps = {
	params: { countryCode: string };
	searchParams?: { c?: string };
};

export default async function Page({ params, searchParams }: PageProps) {
	const [{ countryCode }, sp] = await Promise.all([params, searchParams]);

	const category = (sp?.c ?? 'bundle').toLowerCase();
	const region = await getRegion(countryCode);
	if (!region) notFound();

	return (
		<section className="px-4 py-10">
			<ShopIntro />
			{/* <h1 className="mb-6 text-center font-serif text-5xl font-bold text-green-900">
				Abisaki’s Shop
			</h1> */}
			<MountReveal>
				<ShopScrollManager anchor="#shop-filters" offset={80} threshold={40} />
				<ShopFilters active={category} />

				<ShopSectionText active={category as ICategory} />

				{/* Key by category so Suspense refires when it changes */}
				<div className="mt-10">
					<Suspense key={category} fallback={<GridSkeleton />}>
						{/* Server component fetches, formats, and renders ItemCards */}
						<ShopGrid countryCode={countryCode} category={category} />
					</Suspense>
				</div>
			</MountReveal>
			<ShopCTA />
		</section>
	);
}

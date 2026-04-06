import { Metadata } from 'next';

import FeaturedProducts from '@modules/home/components/featured-products';
import Hero from '@modules/home/components/hero';
import { listCollections } from '@lib/data/collections';
import { getRegion } from '@lib/data/regions';
import Landing from '@modules/home/components/landing';

export const metadata: Metadata = {
	title: "Abisaki's Farm | Pure Kenyan Honey, Coffee & More",
	description: 'Discover pure Kenyan honey, artisan coffee, and farm-fresh products from Abisaki\'s Farm.',
	openGraph: {
		title: "Abisaki's Farm | Pure Kenyan Honey, Coffee & More",
		description: 'Discover pure Kenyan honey, artisan coffee, and farm-fresh products from Abisaki\'s Farm.',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: "Abisaki's Farm | Pure Kenyan Honey, Coffee & More",
		description: 'Discover pure Kenyan honey, artisan coffee, and farm-fresh products from Abisaki\'s Farm.',
	},
};

export default async function Home(props: { params: Promise<{ countryCode: string }> }) {
	const params = await props.params;

	const { countryCode } = params;

	const region = await getRegion(countryCode);

	const { collections } = await listCollections({
		fields: 'id, handle, title',
	});

	if (!collections || !region) {
		return null;
	}

	return (
		<>
			<Landing />
			{/* <Hero />
			<div className="py-12">
				<ul className="flex flex-col gap-x-6">
					<FeaturedProducts collections={collections} region={region} />
				</ul>
			</div> */}
		</>
	);
}

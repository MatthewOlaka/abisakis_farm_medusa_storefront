import FeaturedProducts from '@modules/products/components/featured-products';
import { Metadata } from 'next';
import HoneyClient from './HoneyClient';

export const metadata: Metadata = {
	title: "Honey | Abisaki's Farm",
	description: 'Pure, raw Kenyan honey harvested with care from Abisaki\'s Farm. Natural, unprocessed, and straight from the hive.',
	openGraph: {
		title: "Honey | Abisaki's Farm",
		description: 'Pure Kenyan honey from Abisaki\'s Farm.',
	},
};

type PageProps = {
	params: { countryCode: string };
};

export default async function HoneyPage({ params }: PageProps) {
	const { countryCode } = params;

	return (
		<HoneyClient
			featured={
				<FeaturedProducts
					countryCode={countryCode}
					categoryHandle='honey'
					title="Featured Products"
					titleWrapperClass="-mt-[40vh] text-center xs:text-start"
					gridClassName="mt-40 flex w-full flex-col items-center justify-center gap-20 md:flex-row md:gap-5 lg:gap-20"
				/>
			}
		/>
	);
}

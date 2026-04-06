import FeaturedProducts from '@modules/products/components/featured-products';
import { Metadata } from 'next';
import CoffeeClient from './CoffeeClient';

export const metadata: Metadata = {
	title: "Coffee | Abisaki's Farm",
	description: 'Discover our premium Kenyan coffee — hand-picked, sun-dried, and roasted to perfection at Abisaki\'s Farm.',
	openGraph: {
		title: "Coffee | Abisaki's Farm",
		description: 'Premium Kenyan coffee from Abisaki\'s Farm.',
	},
};

type PageProps = {
	params: { countryCode: string };
};

export default async function CoffeePage({ params }: PageProps) {
	const { countryCode } = params;

	return (
		<CoffeeClient
			featured={
				<FeaturedProducts
					countryCode={countryCode}
					categoryHandle="coffee"
					title="Featured Products"
					titleWrapperClass="mt-30 text-center xs:text-start"
					gridClassName="mt-40 flex w-full flex-col items-center justify-center gap-20 md:flex-row md:gap-5 lg:gap-20"
				/>
			}
		/>
	);
}

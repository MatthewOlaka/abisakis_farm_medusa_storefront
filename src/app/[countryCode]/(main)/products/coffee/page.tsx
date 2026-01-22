import FeaturedProducts from '@modules/products/components/featured-products';
import CoffeeClient from './CoffeeClient';

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

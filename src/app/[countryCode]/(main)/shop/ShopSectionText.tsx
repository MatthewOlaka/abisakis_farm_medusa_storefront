'use client';

import { ICategory } from 'types/global';

const CATEGORY_LABEL: Record<ICategory, string> = {
	bundle: 'Bundles',
	honey: 'Honey',
	coffee: 'Coffee',
	more: 'More',
};

const CATEGORY_DESCRIPTION: Record<ICategory, string> = {
	bundle: 'Curated sets of our best-sellers - perfect for gifting, sharing, and saving.',
	honey:
		'Treat yourself to nature’s sweetest gift - pure, enriching, nourishing, refined honey straight from the hive.',
	coffee:
		'Small-batch, aromatic roasts - rich, balanced, and crafted for espresso, pour-over, and everything in between.',
	more: 'Spices, snacks, and pantry extras - little upgrades that make every cup and bite shine.',
};

interface IProps {
	active: ICategory;
}

// export default function ShopSectionText({ active }: { active: string }) {
export default function ShopSectionText(props: IProps) {
	const { active } = props;
	return (
		<div className="flex w-full flex-col justify-center items-center mt-10 md:mt-16">
			{/* Heading + description */}
			<div className="max-w-xl">
				<h2 className="text-center font-serif text-5xl md:text-7xl font-bold text-green-900">
					{CATEGORY_LABEL[active]}
				</h2>
				<p className="text-sm xs:text-xl mt-5 max-w-170 text-center font-sans text-green-900">
					{CATEGORY_DESCRIPTION[active]}
				</p>
			</div>
		</div>
	);
}

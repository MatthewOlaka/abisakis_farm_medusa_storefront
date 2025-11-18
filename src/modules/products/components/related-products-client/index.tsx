// 'use client';

// import ItemCard from '../item-card'; // ⬅️ adjust path if needed

// type CardItem = {
// 	id: string;
// 	title: string;
// 	price: string;
// 	imageSrc: string;
// 	href: string;
// 	bestSeller?: boolean;
// };

// export default function RelatedProductsClient({ items }: { items: CardItem[] }) {
// 	if (!items.length) return null;

// 	return (
// 		<div className="product-page-constraint">
// 			<div className="mb-16 flex flex-col items-center text-center">
// 				<span className="mb-6 text-base-regular text-gray-600">Related products</span>
// 				<p className="text-2xl-regular text-ui-fg-base max-w-lg">
// 					You might also want to check out these products.
// 				</p>
// 			</div>

// 			<ul className="grid grid-cols-1 small:grid-cols-3 gap-x-6 gap-y-8">
// 				{items.map((it) => (
// 					<li key={it.id} className="flex justify-center">
// 						<ItemCard
// 							id={it.id}
// 							title={it.title}
// 							price={it.price}
// 							imageSrc={it.imageSrc}
// 							href={it.href}
// 							bestSeller={it.bestSeller}
// 						/>
// 					</li>
// 				))}
// 			</ul>
// 		</div>
// 	);
// }

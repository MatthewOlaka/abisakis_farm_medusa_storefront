'use client';

// import { addToCart } from '@/lib/cart/actions';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { MouseEvent, useState } from 'react';
// import { useCartMini } from '../hooks/cart';

interface IProps {
	id: string;
	title: string;
	price: string;
	imageSrc: string;
	href?: string;
	bestSeller?: boolean;
	outOfStock?: boolean;
	wrapperClass?: string;
	imageClass?: string;
}

const ItemCard = ({
	id,
	title,
	price,
	imageSrc,
	href,
	bestSeller,
	outOfStock,
	wrapperClass = '',
	imageClass = '',
}: IProps) => {
	const [adding, setAdding] = useState(false);
	// const { openWithItem } = useCartMini();
	const router = useRouter(); // ←
	const pathname = usePathname(); // ←

	// async function onAddClick(e: MouseEvent) {
	// 	e.preventDefault();
	// 	e.stopPropagation();
	// 	if (adding || outOfStock) return;

	// 	try {
	// 		setAdding(true);
	// 		const data = await addToCart(id, 1);

	// 		if (data?.justAdded) {
	// 			openWithItem({
	// 				id: data.justAdded.id,
	// 				title: data.justAdded.title,
	// 				image_src: data.justAdded.image_src,
	// 				quantity: data.justAdded.quantity,
	// 				unit_price: data.justAdded.unit_price,
	// 				count: data.count,
	// 			});
	// 		}

	// 		if (typeof window !== 'undefined') {
	// 			window.dispatchEvent(new CustomEvent('cart:count', { detail: data.count }));
	// 		}

	// 		// If we're on the cart page, force a server re-fetch
	// 		if (pathname === '/cart') {
	// 			router.refresh(); // 👈 re-renders /cart server component with fresh data
	// 		}
	// 	} catch (err) {
	// 		alert((err as Error).message || 'Unable to add to cart');
	// 	} finally {
	// 		setAdding(false);
	// 	}
	// }

	return (
		<a href={href ?? '#'} className="no-underline">
			<div
				className={[
					'group relative flex h-50 w-60 flex-col justify-end rounded-2xl',
					'bg-primary-200 transition-colors duration-300 hover:bg-yellow-400',
					'shadow-sm',
					wrapperClass,
				].join(' ')}
			>
				<div className="flex w-full items-center justify-around">
					{bestSeller && (
						<h1 className="text-brown-700 mt-7 h-50 rotate-180 font-serif text-4xl font-bold opacity-60 [writing-mode:vertical-lr]">
							Best seller
						</h1>
					)}

					<div className={`flex w-full flex-col ${bestSeller ? 'mr-10' : ''}`}>
						{/* Image wrapper = transform target */}
						<div
							className={[
								'relative -mt-12 h-55 w-full',
								'transform-gpu transition-transform duration-300 ease-[cubic-bezier(.2,.6,.2,1)]',
								// lift and grow on hover
								'group-hover:-translate-y-2 group-hover:scale-[1.06]',
								imageClass,
								outOfStock ? 'grayscale' : '',
							].join(' ')}
						>
							<Image
								src={imageSrc}
								alt={title || 'Featured Product'}
								fill
								priority
								className="pointer-events-none mt-5 object-contain"
								onError={(e) => {
									(e.target as HTMLImageElement).style.display = 'none';
								}}
							/>
						</div>

						<div
							className={[
								'grid w-full grid-cols-[1fr_auto] items-end gap-3',
								// pick a height that fits 2 lines + price comfortably
								'h-20 pb-3 sm:h-24',
								bestSeller ? '' : 'px-5',
							].join(' ')}
						>
							{/* Left: title + price */}
							<div className="flex flex-col justify-end">
								<h2
									className={[
										bestSeller ? 'w-35' : 'w-40',
										'line-clamp-2 font-serif text-xl leading-5',
										// no fixed height here — let it be 1 or 2 lines naturally
									].join(' ')}
								>
									{title}
								</h2>
								<p className="mt-1 font-serif text-green-900">
									{outOfStock ? 'Coming Soon' : price}
								</p>
							</div>

							{/* Right: icon button */}
							<button
								// onClick={onAddClick}
								disabled={adding || !!outOfStock}
								aria-label="Add to cart"
								className={[
									'flex h-10 w-10 items-center justify-center rounded-full bg-green-900',
									'transition-all duration-300 hover:scale-115 hover:bg-green-700',
									outOfStock ? 'hidden' : 'block',
									adding ? 'cursor-not-allowed opacity-60' : '',
								].join(' ')}
							>
								<FontAwesomeIcon icon={faCartPlus} className="text-xl text-white" />
							</button>
						</div>
					</div>

					{bestSeller && <h1 className="[writing-mode:vertical-lr]"> </h1>}
				</div>
			</div>
		</a>
	);
};

export default ItemCard;

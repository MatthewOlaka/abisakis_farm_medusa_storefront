'use client';

import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner } from '@lib/components/ui/spinner';
import { addToCart } from '@lib/data/cart';
import Image from 'next/image';
import { useState } from 'react';
// import { usePathname, useRouter } from 'next/navigation';
// import { MouseEvent, useState } from 'react';

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
	console.log('imageSrc :', imageSrc);

	const [isAdding, setIsAdding] = useState(false);
	// add the selected variant to the cart
	const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (!id) return null;

		setIsAdding(true);

		await addToCart({
			variantId: id,
			quantity: 1,
			countryCode: 'ke',
		});

		setIsAdding(false);
	};

	return (
		<a href={href ?? '#'} className="no-underline">
			<div
				className={[
					'group relative flex h-52 w-60 flex-col justify-end rounded-2xl',
					'bg-yellow-200 transition-colors duration-300 hover:bg-yellow-400',
					'shadow-sm',
					wrapperClass,
				].join(' ')}
			>
				<div className="flex w-full items-center justify-around">
					{bestSeller && (
						<h1 className="text-brown-700 mt-7 h-48 rotate-180 font-serif text-4xl font-bold opacity-60 [writing-mode:vertical-lr]">
							Best seller
						</h1>
					)}

					<div className={`flex w-full flex-col ${bestSeller ? 'mr-10' : ''}`}>
						{/* Image wrapper = transform target */}
						<div
							className={[
								'relative -mt-12 h-56 w-full',
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
										bestSeller ? 'w-36' : 'w-40',
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
								onClick={handleAddToCart}
								disabled={isAdding || !!outOfStock}
								aria-label="Add to cart"
								className={[
									'flex h-10 w-10 items-center justify-center rounded-full bg-green-900',
									'transition-all duration-300 hover:scale-110 hover:bg-green-700',
									outOfStock ? 'hidden' : 'block',
									isAdding ? 'cursor-not-allowed opacity-60' : '',
								].join(' ')}
							>
								{isAdding ? (
									<Spinner className="text-white" />
								) : (
									<FontAwesomeIcon icon={faCartPlus} className="text-xl text-white" />
								)}
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

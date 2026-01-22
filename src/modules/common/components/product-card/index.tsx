import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface IProps {
	idx: string;
	title: string;
	src: string;
	onHoverChange?: (hovering: boolean) => void;
	active?: boolean; // true when this card is the hovered one
	wrapperClass?: string;
	href?: string; // link to product page
}

const ProductCard = ({
	idx,
	title,
	src,
	onHoverChange,
	active = false,
	wrapperClass,
	href,
}: IProps) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const [isTouch, setIsTouch] = useState(false);

	useEffect(() => {
		const touch =
			(typeof window !== 'undefined' &&
				(window.matchMedia?.('(hover: none), (pointer: coarse)').matches ||
					navigator.maxTouchPoints > 0)) ||
			false;
		setIsTouch(touch);
	}, []);

	// Click/tap outside should clear the active (overlay) state
	useEffect(() => {
		if (!active) return;
		const handleOutside = (ev: Event) => {
			if (!rootRef.current) return;
			// ignore clicks inside this card
			if (rootRef.current.contains(ev.target as Node)) return;
			onHoverChange?.(false);
		};
		document.addEventListener('pointerdown', handleOutside);
		document.addEventListener('keydown', (e: any) => e.key === 'Escape' && handleOutside(e));
		return () => {
			document.removeEventListener('pointerdown', handleOutside);
			document.removeEventListener('keydown', (e: any) => e.key === 'Escape' && handleOutside(e));
		};
	}, [active, onHoverChange]);

	const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
		if (!isTouch) return; // desktop: let the link work
		if (!active) {
			// first tap on touch: arm the card + show overlay
			e.preventDefault();
			onHoverChange?.(true);
		}
		// second tap while active: allow navigation
	};

	const handleKeyDown: React.KeyboardEventHandler<HTMLAnchorElement> = (e) => {
		// optional keyboard support for touch devices
		if (!isTouch) return;
		if (!active && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			onHoverChange?.(true);
		}
	};

	return (
		<a
			href={href || '/shop'}
			className="no-underline"
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			// aria-pressed={active}
		>
			<div
				ref={rootRef}
				className={[
					'group relative cursor-pointer [perspective:1200px]',
					active ? 'z-[60]' : 'z-10',
					wrapperClass || '',
				].join(' ')}
				onMouseEnter={() => !isTouch && onHoverChange?.(true)}
				onMouseLeave={() => !isTouch && onHoverChange?.(false)}
			>
				{/* 3D panel */}
				<div
					className={[
						'relative mt-10 h-96 w-64 overflow-hidden rounded-sm shadow-lg',
						'[transform-origin:bottom_left] transform-gpu [transform-style:preserve-3d]',
						'transition-transform duration-500 ease-[cubic-bezier(.2,.6,.2,1)]',
						// Use parent-driven "active" for both desktop (hoveredIdx) and mobile (first tap)
						active
							? 'scale-105 [transform:rotateX(8deg)_rotateY(-6deg)_translate3d(0,-10px,26px)] shadow-[0_20px_60px_rgba(255,255,255,0.45)] ring-2 ring-white/70'
							: 'group-hover:[transform:rotateX(8deg)_rotateY(-6deg)_translate3d(0,-10px,26px)]',
					].join(' ')}
				>
					<Image
						src={src}
						alt={title}
						fill
						sizes="208px"
						className={[
							'pointer-events-none object-cover transition-transform duration-500',
							active
								? 'translate-y-[-2px] scale-[1.05]'
								: 'group-hover:translate-y-[-2px] group-hover:scale-[1.05]',
						].join(' ')}
					/>

					<div className="absolute inset-0 flex items-start justify-center">
						<h1
							className={[
								'absolute z-200 w-full text-center font-serif text-2xl font-bold tracking-tighter whitespace-nowrap !text-white backdrop-blur-sm transition-opacity duration-500',
								active ? 'opacity-100' : 'opacity-0',
							].join(' ')}
						>
							Click to explore
						</h1>
					</div>

					{/* vignette */}
					<div
						className={[
							'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500',
							'[background:radial-gradient(140%_90%_at_0%_100%,rgba(0,0,0,.28),transparent_70%)]',
							active ? 'opacity-100' : 'group-hover:opacity-100',
						].join(' ')}
					/>
				</div>

				{/* caption */}
				<div
					className={[
						'flex items-center justify-center text-center',
						'transform-gpu will-change-transform',
						'transition-transform duration-[800ms] ease-[cubic-bezier(.2,.6,.2,1)]',
						active ? 'translate-y-0' : 'translate-y-2',
					].join(' ')}
				>
					<h1
						className={`${active ? '!text-amber-400' : '!text-green-900'} font-serif text-5xl font-bold -tracking-widest`}
					>
						{idx}
					</h1>
					<p className={`${active ? 'text-white' : 'text-gray-900'} font-serif text-2xl`}>
						{title}
					</p>
				</div>
			</div>
		</a>
	);
};

export default ProductCard;

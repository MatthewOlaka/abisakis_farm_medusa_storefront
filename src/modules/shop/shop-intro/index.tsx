// app/shop/ShopClient.tsx  (CLIENT)
'use client';

import {
	BAG_IMAGE_URL,
	CAYENNE_IMAGE_URL,
	COFFEE_BAG_1_IMAGE_URL,
	HONEY_JAR_IMAGE_URL,
	PAPRIKA_IMAGE_URL,
	SQUEEZE_BOTTLE_IMAGE_URL,
} from '@lib/constants';
import useParallax from '@lib/hooks/useParallax';
import { useHomeIntro } from '@modules/layout/components/home-intro';
import ScrollDownIndicator from '@modules/common/components/scroll-down-indicator';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef } from 'react';

const SHOP_INTRO_IMAGE_IDS = [
	'shop-coffee-bag',
	'shop-cayenne',
	'shop-paprika',
	'shop-squeeze-bottle',
	'shop-honey-jar',
	'shop-bag',
] as const;

export type ICategory = 'bundle' | 'honey' | 'coffee' | 'more';

export default function ShopIntro() {
	const scopeRef = useRef<HTMLDivElement | null>(null);
	const { isActive: isIntroActive, markReady } = useHomeIntro();
	const introAssetsLoadedRef = useRef<Set<string>>(new Set());
	const introRevealQueuedRef = useRef(false);
	const markReadyRef = useRef(markReady);

	useEffect(() => {
		markReadyRef.current = markReady;
	}, [markReady]);

	const queueIntroReveal = () => {
		if (introRevealQueuedRef.current) return;
		introRevealQueuedRef.current = true;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				markReadyRef.current();
			});
		});
	};

	const settleIntroAsset = (assetId: (typeof SHOP_INTRO_IMAGE_IDS)[number]) => {
		if (!isIntroActive || introRevealQueuedRef.current) return;
		introAssetsLoadedRef.current.add(assetId);
		if (introAssetsLoadedRef.current.size !== SHOP_INTRO_IMAGE_IDS.length) return;
		queueIntroReveal();
	};

	// Fallback timer – dismiss splash after 4.5s even if images are slow
	useEffect(() => {
		if (!isIntroActive) return;
		const fallbackTimer = window.setTimeout(() => {
			queueIntroReveal();
		}, 4500);
		return () => window.clearTimeout(fallbackTimer);
	}, [isIntroActive]);

	// useParallax();
	useParallax(scopeRef, { selector: '[data-speed]', axis: 'y' });

	useLayoutEffect(() => {
		if (
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		)
			return;
		const ctx = gsap.context(() => {
			gsap.set('.drop-bag', { y: -120, autoAlpha: 0, filter: 'blur(6px)' });
			gsap.set('.drop-item', { y: -160, autoAlpha: 0, filter: 'blur(8px)' });
			const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
			tl.to('.drop-bag', {
				y: 0,
				autoAlpha: 1,
				filter: 'blur(0px)',
				duration: 0.9,
			});
			tl.to(
				'.drop-item',
				{
					y: 0,
					autoAlpha: 1,
					filter: 'blur(0px)',
					duration: 0.5,
					stagger: 0.08,
				},
				'-=0.35',
			);
		}, scopeRef);
		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={scopeRef}
			className="relative overflow-x-hidden py-1 min-h-[750px] xs:min-h-[950px]"
		>
			<div className='bg-yellow-200 xs:h-[200px] mx-auto flex h-[130px] w-full max-w-4xl items-center justify-center rounded-2xl px-1 xs:px-5'>
				<h1 className="xs:text-7xl sm:text-8xl xs:-top-0 z-50 m-auto mt-5 mb-5 w-full text-center font-serif text-[55px] leading-0 font-bold whitespace-nowrap text-green-900 md:text-9xl">
					Abisaki&apos;s Shop
				</h1>
			</div>
			<ScrollDownIndicator className="mx-auto scale-75 md:scale-75" />
			{/* Hero with absolute items */}
			<div className='-mt-20' data-scroll data-scroll-speed="-0.15">
				{/* Coffee bag (item) */}
				<div
					// data-scroll
					// data-scroll-speed="1"
					data-speed="-0.2"
					className="xs:h-80 absolute z-10 mt-10 h-60 w-full overflow-x-hidden overflow-y-hidden will-change-transform"
				>
					<div className="drop-item absolute inset-0">
						<Image
							// src="/images/YDcoffeeBag1.png"
							src={COFFEE_BAG_1_IMAGE_URL}
							alt="Coffee Bag"
							fill
							priority
							className="object-contain"
							onLoad={() => settleIntroAsset('shop-coffee-bag')}
							onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; settleIntroAsset('shop-coffee-bag'); }}
						/>
					</div>
				</div>

				{/* Cayenne (item) */}
				<div className="xs:h-40 xs:ml-10 absolute z-10 mt-36 ml-6 h-24 w-full overflow-x-hidden overflow-y-hidden will-change-transform [backface-visibility:hidden]">
					<div className="drop-item absolute inset-0 rotate-6 [transform:translateZ(0)]">
						<Image
							// src="/images/YDCayenne.png"
							src={CAYENNE_IMAGE_URL}
							alt="Cayenne Pepper"
							fill
							priority
							className="object-contain rotate-6"
							onLoad={() => settleIntroAsset('shop-cayenne')}
							onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; settleIntroAsset('shop-cayenne'); }}
						/>
					</div>
				</div>

				{/* Paprika (item) */}
				<div
					// data-scroll
					// data-scroll-speed="1"
					data-speed="-0.1"
					className="xs:h-40 xs:ml-24 absolute z-10 mt-32 ml-16 h-28 w-full overflow-x-hidden overflow-y-hidden will-change-transform [backface-visibility:hidden]"
				>
					<div className="drop-item absolute inset-0 rotate-6 [transform:translateZ(0)]">
						<Image
							// src="/images/YDPaprika.png"
							src={PAPRIKA_IMAGE_URL}
							alt="Paprika"
							fill
							priority
							className="object-contain rotate-6"
							onLoad={() => settleIntroAsset('shop-paprika')}
							onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; settleIntroAsset('shop-paprika'); }}
						/>
					</div>
				</div>

				{/* Squeeze bottle (item) */}
				<div className="xs:h-40 xs:-ml-2 absolute z-10 mt-32 -ml-4 h-28 w-full overflow-x-hidden overflow-y-hidden will-change-transform [backface-visibility:hidden]">
					<div className="drop-item absolute inset-0 [transform:translateZ(0)]">
						<Image
							// src="/images/YDSqueezeBottle.png"
							src={SQUEEZE_BOTTLE_IMAGE_URL}
							alt="Honey Squeeze Bottle"
							fill
							priority
							className="object-contain -rotate-6"
							onLoad={() => settleIntroAsset('shop-squeeze-bottle')}
							onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; settleIntroAsset('shop-squeeze-bottle'); }}
						/>
					</div>
				</div>

				{/* Honey jar (item) */}
				<div
					data-speed="-0.1"
					className="xs:h-52 xs:-ml-16 absolute z-10 mt-28 -ml-16 h-28 w-full  overflow-x-hidden overflow-y-hidden will-change-transform"
				>
					<div className="drop-item absolute inset-0 ">
						<Image
							// src="/images/honeyJar1.png"
							src={HONEY_JAR_IMAGE_URL}
							alt="Honey Jar"
							fill
							priority
							className="object-contain -rotate-12"
							onLoad={() => settleIntroAsset('shop-honey-jar')}
							onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; settleIntroAsset('shop-honey-jar'); }}
						/>
					</div>
				</div>

				{/* Open shopping bag (drops first) */}
				<div
					data-speed="0.15"
					className="xs:h-[450px] absolute z-10 -ml-2 xs:-ml-0 mt-20 h-80 w-full overflow-x-hidden overflow-y-hidden will-change-transform"
				>
					<div className="drop-bag absolute inset-0">
						<Image
							// src="/images/YDbag1.png"
							src={BAG_IMAGE_URL}
							alt="Open Shopping Bag"
							fill
							priority
							className="object-contain pointer-events-none"
							onLoad={() => settleIntroAsset('shop-bag')}
							onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; settleIntroAsset('shop-bag'); }}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

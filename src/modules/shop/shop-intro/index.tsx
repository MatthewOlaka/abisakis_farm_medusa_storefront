// app/shop/ShopClient.tsx  (CLIENT)
'use client';

import useParallax from '@lib/hooks/useParallax';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';

export type ICategory = 'bundle' | 'honey' | 'coffee' | 'more';

export default function ShopIntro() {
	const scopeRef = useRef<HTMLDivElement | null>(null);

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
			className="relative overflow-x-hidden py-1 min-h-[700px] xs:min-h-[800px] md:min-h-[900px]"
		>
			<h1 className="xs:text-7xl xs:-top-0 z-50 m-auto md:mt-20 mb-5 w-full text-center font-serif text-[55px] leading-0 font-bold whitespace-nowrap text-green-900 md:text-8xl">
				Abisaki&apos;s Shop
			</h1>
			{/* Hero with absolute items */}
			<div data-scroll data-scroll-speed="-0.15">
				{/* Coffee bag (item) */}
				<div
					// data-scroll
					// data-scroll-speed="1"
					data-speed="-0.2"
					className="xs:h-80 absolute z-10 mt-10 h-60 w-full overflow-x-hidden overflow-y-hidden will-change-transform"
				>
					<div className="drop-item absolute inset-0">
						<Image
							src="/images/YDcoffeeBag1.png"
							alt="Coffee Bag"
							fill
							priority
							className="object-contain"
							onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
						/>
					</div>
				</div>

				{/* Cayenne (item) */}
				<div className="xs:h-40 xs:ml-10 absolute z-10 mt-36 ml-6 h-24 w-full overflow-x-hidden overflow-y-hidden will-change-transform [backface-visibility:hidden]">
					<div className="drop-item absolute inset-0 rotate-6 [transform:translateZ(0)]">
						<Image
							src="/images/YDCayenne.png"
							alt="Cayenne Pepper"
							fill
							priority
							className="object-contain rotate-6"
							onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
						/>
					</div>
				</div>

				{/* Paprika (item) */}
				<div
					// data-scroll
					// data-scroll-speed="1"
					data-speed="-0.1"
					className="xs:h-40 xs:ml-24 absolute z-10 mt-36 ml-16 h-28 w-full overflow-x-hidden overflow-y-hidden will-change-transform [backface-visibility:hidden]"
				>
					<div className="drop-item absolute inset-0 rotate-6 [transform:translateZ(0)]">
						<Image
							src="/images/YDPaprika.png"
							alt="Paprika"
							fill
							priority
							className="object-contain rotate-6"
							onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
						/>
					</div>
				</div>

				{/* Squeeze bottle (item) */}
				<div className="xs:h-40 xs:-ml-2 absolute z-10 mt-32 -ml-4 h-28 w-full overflow-x-hidden overflow-y-hidden will-change-transform [backface-visibility:hidden]">
					<div className="drop-item absolute inset-0 [transform:translateZ(0)]">
						<Image
							src="/images/YDSqueezeBottle.png"
							alt="Honey Squeeze Bottle"
							fill
							priority
							className="object-contain -rotate-6"
							onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
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
							src="/images/honeyJar1.png"
							alt="Honey Jar"
							fill
							priority
							className="object-contain -rotate-12"
							onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
						/>
					</div>
				</div>

				{/* Open shopping bag (drops first) */}
				<div
					data-speed="0.15"
					className="xs:h-[450px] absolute z-10 mt-20 h-80 w-full overflow-x-hidden overflow-y-hidden will-change-transform"
				>
					<div className="drop-bag absolute inset-0">
						<Image
							src="/images/YDbag1.png"
							alt="Open Shopping Bag"
							fill
							priority
							className="object-contain pointer-events-none"
							onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

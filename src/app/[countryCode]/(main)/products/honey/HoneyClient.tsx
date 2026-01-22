'use client';

import React from 'react';
import CurvyMarqueeText from '@modules/common/components/curvy-marquee-text';
import CurvyScrollPipe from '@modules/common/components/curvy-scroll-pipe';
import ExploreProductsBanner from '@modules/common/components/explore-products-banner';
import ScrollDownIndicator from '@modules/common/components/scroll-down-indicator';
import TimelineText from '@modules/common/components/timeline-text';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';

export default function HoneyClient({ featured }: { featured: React.ReactNode }) {
	const jarWrapRef = useRef<HTMLDivElement | null>(null);
	const pipeStarted = useRef(false);

	useLayoutEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		let tl: GSAPTimeline | null = null;

		gsap.set(jarWrapRef.current, {
			rotation: 20,
			rotateX: 10,
			x: -100,
			y: 0,
			scale: 1,
			transformOrigin: '50% 85%',
			transformPerspective: 800,
			force3D: true,
			z: 0.01,
			willChange: 'transform',
		});

		const travelY = () => window.innerHeight * 0.7;

		if (jarWrapRef.current) {
			tl = gsap.timeline({
				scrollTrigger: {
					trigger: document.documentElement,
					start: 0,
					end: '+=70%',
					scrub: 0.6,
					fastScrollEnd: true,
					onLeave: () => {
						if (!pipeStarted.current) {
							pipeStarted.current = true;
						}
					},
					onUpdate: (self) => {
						if (!pipeStarted.current && self.progress >= 1) {
							pipeStarted.current = true;
						}
					},
				},
				defaults: { ease: 'none' },
			});

			tl.to(jarWrapRef.current, {
				y: travelY,
				rotation: 0,
				rotateX: 0,
				x: 0,
				scale: 1.2,
			});
		}

		return () => {
			tl?.scrollTrigger?.kill();
			tl?.kill();
		};
	}, []);

	return (
		<section className="mx-auto flex w-full max-w-7xl flex-col justify-center py-5">
			<div className="px-5">
				<div className="bg-yellow-200 xs:h-[200px] mx-auto flex h-[150px] w-full max-w-4xl items-center justify-center rounded-2xl px-5">
					<div className="xs:flex-row xs:items-center relative flex h-full w-full max-w-[750px] flex-col-reverse !justify-evenly overflow-hidden">
						<div className="motion-safe:animate-levitate xs:mt-20 xs:w-30 relative h-10 w-10 overflow-x-hidden md:w-60">
							<Image
								src="/images/bee.png"
								alt="Bee 1"
								fill
								priority
								className="object-contain"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
						<h1 className="xs:text-8xl xs:-top-0 xs:left-5 relative -top-6 z-50 w-full text-center font-serif text-[60px] leading-0 font-bold whitespace-nowrap text-green-900 md:text-9xl">
							Our Honey
						</h1>
						<div className="flex w-full justify-end">
							<div className="xs:h-25 xs:w-25 xs:right-10 relative -top-5 right-0 h-20 w-20">
								<Image
									src="/images/honeyComb.png"
									alt="Honey Comb"
									fill
									priority
									className="object-cover"
									onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="relative flex justify-center overflow-x-clip overflow-y-visible">
				<div
					ref={jarWrapRef}
					className="xs:h-96 xs:-mt-20 relative -mt-10 h-96 w-full [transform:translateZ(0)] overflow-x-hidden overflow-y-visible will-change-transform [backface-visibility:hidden] z-10"
				>
					<Image
						src="/images/honeyJar1.png"
						alt="Honey Jar"
						fill
						priority
						className="relative overflow-x-hidden overflow-y-visible object-contain"
						onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
					/>
				</div>
				<div className="motion-safe:animate-levitate absolute mt-40 ml-60 h-10 w-10 scale-x-[-1] overflow-x-hidden">
					<Image
						src="/images/bee.png"
						alt="Bee 2"
						fill
						priority
						className="object-contain"
						onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
					/>
				</div>
			</div>

			<div className="mt-10 sm:hidden">
				<CurvyMarqueeText
					text="Pure • Natural • Sweet • The Abisaki Way"
					speedSec={13}
					direction="left"
					fontSize={52}
					curveHeight={25}
					className="mt-0 stroke-yellow-500 font-bold tracking-[4px] text-yellow-500"
				/>
			</div>

			<div className="hidden sm:block">
				<CurvyMarqueeText
					text="Pure • Natural • Sweet • The Abisaki Way"
					speedSec={18}
					direction="left"
					fontSize={36}
					curveHeight={55}
					className="mt-50 stroke-yellow-500 font-bold text-yellow-500"
				/>
			</div>
			<ScrollDownIndicator className="mx-auto mt-8 sm:mt-10" />
			<div className="-mt-10">
				<TimelineText
					idx="01"
					title="Lorem Ipsum"
					description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt quos
					aliquid,Incidunt quos aliquid quos aliquid,Incidunt quos aliquid ipsum
					dolor sit amet."
					className="xs:mt-[62vh] xs:ml-10 left-1/2 mt-[65vh] -translate-x-1/2"
				/>
				<TimelineText
					idx="02"
					title="Lorem Ipsum"
					description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt quos
					aliquid,Incidunt quos aliquid quos aliquid,Incidunt quos aliquid ipsum
					dolor sit amet."
					className="xs:mt-[98vh] xs:-ml-10 left-1/2 mt-[100vh] -translate-x-1/2"
				/>

				<TimelineText
					idx="03"
					title="Lorem Ipsum"
					description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt quos
					aliquid,Incidunt quos aliquid quos aliquid,Incidunt quos aliquid ipsum
					dolor sit amet."
					className="xs:mt-[132vh] xs:ml-10 left-1/2 mt-[135vh] -translate-x-1/2"
				/>
				<TimelineText
					idx="04"
					title="Lorem Ipsum"
					description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt quos
					aliquid,Incidunt quos aliquid quos aliquid,Incidunt quos aliquid ipsum
					dolor sit amet."
					className="xs:mt-[169vh] xs:-ml-10 left-1/2 mt-[170vh] -translate-x-1/2"
				/>
				<div className="overflox-x-hidden mt-10 sm:hidden">
					<CurvyScrollPipe
						active={true}
						d="M1933.316,1529.3s11.654,118.137,0,123.155c-108.008,46.5-810.076,301.466-810.076,628.968,0,362.28,233.438,486.332,689.425,809.241s913.482,424.424,913.482,842.722-428.06,499.133-913.482,830.468-689.425,446.455-689.425,819.938,689.425,673.992,689.425,673.992,913.482,405.6,913.482,859.809c0,408.791-752.338,839.488-863.839,962.333-84.4,87.522-33.129,388.875-36.129,492.731"
						viewBox="0 0 1603.907 7083.421"
						pathTransform="translate(-1122.74 -1529.252)"
						strokeWidth={22}
						strokeLinecap="round"
						startColor="#54390a"
						endColor="#efc907"
						trackColor="#e5e7eb"
						minHeightVh={260}
						svgHeightVh={160}
						preserveAspect="xMidYMin meet"
						dialLead={15}
					/>
				</div>
				<div className="overflox-x-hidden hidden sm:block">
					<CurvyScrollPipe
						active={true}
						d="M1933.316,1529.3s11.654,118.137,0,123.155c-108.008,46.5-810.076,301.466-810.076,628.968,0,362.28,233.438,486.332,689.425,809.241s913.482,424.424,913.482,842.722-428.06,499.133-913.482,830.468-689.425,446.455-689.425,819.938,689.425,673.992,689.425,673.992,913.482,405.6,913.482,859.809c0,408.791-752.338,839.488-863.839,962.333-84.4,87.522-33.129,388.875-36.129,492.731"
						viewBox="0 0 1603.907 7083.421"
						pathTransform="translate(-1122.74 -1529.252)"
						strokeWidth={25}
						strokeLinecap="round"
						startColor="#54390a"
						endColor="#efc907"
						trackColor="#e5e7eb"
						minHeightVh={260}
						svgHeightVh={160}
						preserveAspect="xMidYMin meet"
						dialLead={15}
					/>
				</div>
			</div>
			{featured}
			<div className="overflox-x-hidden xs:py-52 flex w-full justify-center px-10 py-32">
				<ExploreProductsBanner />
			</div>
		</section>
	);
}

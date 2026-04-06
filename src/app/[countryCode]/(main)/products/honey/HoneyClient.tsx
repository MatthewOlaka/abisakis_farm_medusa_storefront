/* eslint-disable prettier/prettier */
'use client';

import React from 'react';
import CurvyMarqueeText from '@modules/common/components/curvy-marquee-text';
import CurvyScrollPipe from '@modules/common/components/curvy-scroll-pipe';
import ExploreProductsBanner from '@modules/common/components/explore-products-banner';
import { useHomeIntro } from '@modules/layout/components/home-intro';
import ScrollDownIndicator from '@modules/common/components/scroll-down-indicator';
import TimelineText from '@modules/common/components/timeline-text';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { HIVE_IMAGE_URL } from '@modules/home/components/landing';
import { BEE_IMAGE_URL, HONEY_COMB_IMAGE_URL, HONEY_JAR_IMAGE_URL } from '@lib/constants';

const HONEY_INTRO_IMAGE_IDS = ['honey-title-bee', 'honey-comb', 'honey-jar'] as const;

export default function HoneyClient({ featured }: { featured: React.ReactNode }) {
	const { isActive: isIntroActive, markReady } = useHomeIntro();
	const sectionRef = useRef<HTMLElement | null>(null);
	const jarWrapRef = useRef<HTMLDivElement | null>(null);
	const pipeStarted = useRef(false);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const introAssetsLoadedRef = useRef<Set<string>>(new Set());
	const introRevealQueuedRef = useRef(false);
	const markReadyRef = useRef(markReady);

	const STAGE_1_IMAGE_URL = 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/honey/steps/honey-stage1.jpg';
	const STAGE_3_IMAGE_URL = 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/honey/steps/honey-stage3.jpg';
	// const STAGE_4_IMAGE_URL = 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/honey/steps/honey-stage4v2.jpg';
	const STAGE_4_IMAGE_URL = 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/honey/steps/honey-stage4v1.jpeg';
	// const STAGE_4_IMAGE_URL = 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/honey/steps/honey-stage4.jpeg';

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

	const settleIntroAsset = (assetId: (typeof HONEY_INTRO_IMAGE_IDS)[number]) => {
		if (!isIntroActive || introRevealQueuedRef.current) return;

		introAssetsLoadedRef.current.add(assetId);
		if (introAssetsLoadedRef.current.size !== HONEY_INTRO_IMAGE_IDS.length) return;

		queueIntroReveal();
	};

	useEffect(() => {
		if (!isIntroActive) return;

		introAssetsLoadedRef.current = new Set();
		introRevealQueuedRef.current = false;

		const fallbackTimer = window.setTimeout(() => {
			queueIntroReveal();
		}, 4500);

		return () => {
			window.clearTimeout(fallbackTimer);
		};
	}, [isIntroActive]);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 639px)');
		const updateViewport = () => setIsSmallScreen(mediaQuery.matches);

		updateViewport();
		mediaQuery.addEventListener('change', updateViewport);

		return () => {
			mediaQuery.removeEventListener('change', updateViewport);
		};
	}, []);

	useLayoutEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const ctx = gsap.context(() => {
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
				const tl = gsap.timeline({
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

			const povImages = gsap.utils.toArray<HTMLElement>('[data-pov-image]');

			if (povImages.length > 0) {
				gsap.set(povImages, {
					autoAlpha: 0,
					y: 24,
					willChange: 'transform, opacity',
				});

				povImages.forEach((povImage) => {
					gsap.to(povImage, {
						autoAlpha: 1,
						y: 0,
						duration: 0.8,
						ease: 'power2.out',
						scrollTrigger: {
							trigger: povImage,
							start: 'top 30%',
							once: true,
						},
					});
				});
			}
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			className="mx-auto flex w-full max-w-7xl flex-col justify-center py-5"
		>
			<div className="px-5">
				<div className="bg-yellow-200 xs:h-[200px] mx-auto flex h-[150px] w-full max-w-4xl items-center justify-center rounded-2xl px-5">
					<div className="xs:flex-row xs:items-center relative flex h-full w-full max-w-[750px] flex-col-reverse !justify-evenly overflow-hidden">
						<div className="motion-safe:animate-levitate xs:mt-20 xs:w-30 relative h-10 w-10 overflow-x-hidden md:w-60">
							<Image
								// src="/images/bee.png"
								src={BEE_IMAGE_URL}
								alt="Bee 1"
								fill
								priority
								sizes="(max-width: 768px) 40px, 240px"
								className="object-contain"
								onLoad={() => settleIntroAsset('honey-title-bee')}
								onError={(e) => {
									(e.target as HTMLImageElement).style.display = 'none';
									settleIntroAsset('honey-title-bee');
								}}
							/>
						</div>
						<h1 className="xs:text-8xl xs:-top-0 xs:left-5 relative -top-6 z-50 w-full text-center font-serif text-[60px] leading-0 font-bold whitespace-nowrap text-green-900 md:text-9xl">
							Our Honey
						</h1>
						<div className="flex w-full justify-end">
							<div className="xs:h-25 xs:w-25 xs:right-10 relative -top-5 right-0 h-20 w-20">
								<Image
									// src="/images/honeyComb.png"
									src={HONEY_COMB_IMAGE_URL}
									alt="Honey Comb"
									fill
									sizes="(max-width: 768px) 80px, 100px"
									className="object-cover"
									onLoad={() => settleIntroAsset('honey-comb')}
									onError={(e) => {
										(e.target as HTMLImageElement).style.display = 'none';
										settleIntroAsset('honey-comb');
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="relative flex justify-center overflow-x-clip overflow-y-visible">
				<div
					ref={jarWrapRef}
					className="xs:h-96 xs:-mt-20 relative -mt-10 h-72 w-full [transform:translateZ(0)] overflow-x-hidden overflow-y-visible will-change-transform [backface-visibility:hidden] z-10"
				>
					<Image
						// src="/images/honeyJar1.png"
						src={HONEY_JAR_IMAGE_URL}
						alt="Honey Jar"
						fill
						priority
						sizes="(max-width: 768px) 100vw, 896px"
						className="relative overflow-x-hidden overflow-y-visible object-contain"
						onLoad={() => settleIntroAsset('honey-jar')}
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = 'none';
							settleIntroAsset('honey-jar');
						}}
					/>
				</div>
				<div
					style={{ animationDelay: '0.5s' }}
					className="motion-safe:animate-levitate absolute mt-40 ml-60 h-10 w-10 overflow-x-hidden"
				>
					<Image
						// src="/images/bee.png"
						src={BEE_IMAGE_URL}
						alt="Bee 2"
						fill
						loading="lazy"
						sizes="40px"
						className="object-contain scale-x-[-1]"
						onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
					/>
				</div>
			</div>

			<div className={isSmallScreen ? 'mt-10' : ''}>
				<CurvyMarqueeText
					text="Pure • Natural • Sweet • The Abisaki Way"
					speedSec={isSmallScreen ? 13 : 18}
					direction="left"
					fontSize={isSmallScreen ? 52 : 36}
					curveHeight={isSmallScreen ? 25 : 55}
					className={
						isSmallScreen
							? 'mt-0 stroke-yellow-500 font-bold tracking-[4px] text-yellow-500'
							: 'mt-50 stroke-yellow-500 font-bold text-yellow-500'
					}
				/>
			</div>
			<ScrollDownIndicator className="mx-auto mt-8 sm:mt-10" />
			{/* Content sections */}
			<div className="-mt-10 mb-10 xs:mb-0">
				<div
					data-pov-image
					className="md:block hidden h-72 w-52 xl:h-80 xl:w-60 absolute z-50 -rotate-3 -ml-64 lg:-ml-96 mt-[55vh] left-1/2 -translate-x-1/2"
				>
					<Image
						src={STAGE_1_IMAGE_URL}
						alt="POV"
						fill
						loading="lazy"
						sizes="240px"
						className="rounded-sm object-cover"
						onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
					/>
				</div>
				<TimelineText
					idx="01"
					title="Nurture the bees"
					description="Our hives are cared for with patience and respect. Bees are part of the land, not just workers, and we ensure they thrive naturally."
					className="xs:mt-[62vh] ml-7 xs:ml-20 left-1/2 mt-[57vh] -translate-x-1/2"
				/>

				<div
					data-pov-image
					className="md:block hidden h-72 w-52 xl:h-80 xl:w-60 absolute z-50 rotate-3 mt-[92vh] ml-64 lg:ml-96 left-1/2 -translate-x-1/2"
				>
					<Image
						src={HIVE_IMAGE_URL}
						alt="POV"
						fill
						loading="lazy"
						sizes="240px"
						className="rounded-sm object-cover"
						onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
					/>
				</div>
				<TimelineText
					idx="02"
					title="Collect with care"
					description="Our honey is harvested only when it’s ready, fully capped by the bees, to preserve flavour, nutrients, and purity."
					className="xs:mt-[98vh] -ml-7 xs:-ml-20 left-1/2 mt-[92vh] -translate-x-1/2"
				/>

				<div
					data-pov-image
					className="md:block hidden h-72 w-52 xl:h-80 xl:w-60 absolute z-50 -rotate-3 -ml-64 lg:-ml-96 mt-[130vh] left-1/2 -translate-x-1/2"
				>
					<Image
						src={STAGE_3_IMAGE_URL}
						alt="POV"
						fill
						loading="lazy"
						sizes="240px"
						className="rounded-sm object-cover"
						onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
					/>
				</div>
				<TimelineText
					idx="03"
					title="Filter mindfully"
					description="We gently separate our honey from the comb, take it to the office where it is warmed in a double container in small batches to remove the impurities(venom from bee sting, dust), without rushing or over-handling."
					className="xs:mt-[128vh] ml-7 xs:ml-20 left-1/2 mt-[127vh] -translate-x-1/2"
				/>

				<div
					data-pov-image
					className="md:block hidden h-72 w-52 xl:h-80 xl:w-60 absolute z-50 rotate-3 mt-[162vh] ml-64 lg:ml-96 left-1/2 -translate-x-1/2"
				>
					<Image
						src={STAGE_4_IMAGE_URL}
						alt="POV"
						fill
						loading="lazy"
						sizes="240px"
						className="rounded-sm object-cover"
						onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
					/>
				</div>
				<TimelineText
					idx="04"
					title="Bottle & enjoy"
					description="Every jar carries the care of the hive and the land. When you taste it, you taste the dedication of the bees and the people who nurtured them."
					className="xs:mt-[169vh] -ml-7 xs:-ml-20 left-1/2 mt-[163vh] -translate-x-1/2"
				/>
				<div className={`overflox-x-hidden ${isSmallScreen ? 'mt-10' : ''}`}>
					<CurvyScrollPipe
						active={true}
						d="M1933.316,1529.3s11.654,118.137,0,123.155c-108.008,46.5-810.076,301.466-810.076,628.968,0,362.28,233.438,486.332,689.425,809.241s913.482,424.424,913.482,842.722-428.06,499.133-913.482,830.468-689.425,446.455-689.425,819.938,689.425,673.992,689.425,673.992,913.482,405.6,913.482,859.809c0,408.791-752.338,839.488-863.839,962.333-84.4,87.522-33.129,388.875-36.129,492.731"
						viewBox="0 0 1603.907 7083.421"
						pathTransform="translate(-1122.74 -1529.252)"
						strokeWidth={isSmallScreen ? 22 : 25}
						strokeLinecap="round"
						startColor="#54390a"
						endColor="#efc907"
						trackColor="#e5e7eb"
						// minHeightVh={260}
						minHeightVh={isSmallScreen ? 240 : 260}
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

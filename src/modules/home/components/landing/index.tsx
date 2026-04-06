'use client';

import {
	BEE_IMAGE_URL,
	BRANCH_IMAGE_URL,
	CHERRY_IMAGE_URL,
	CHILLI_IMAGE_URL,
	COFFEE_BAG_1_IMAGE_URL,
	HERO_IMAGE_URL,
	HONEY_JAR_IMAGE_URL,
	MAP_CENTER,
	MAP_MARKERS,
	MAP_PERIMETER,
} from '@lib/constants';
import useParallax from '@lib/hooks/useParallax';
import BlobText from '@modules/common/components/blob-text';
import MapCard from '@modules/common/components/map-card';
import ProductCard from '@modules/common/components/product-card';
import ScrollDownIndicator from '@modules/common/components/scroll-down-indicator';
import Title from '@modules/common/components/title';
import { useHomeIntro } from '@modules/layout/components/home-intro';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState, type SyntheticEvent } from 'react';

// Disable SSR for BlobText to avoid hydration mismatches.
const BlobTextNoSSR = dynamic(() => import('@modules/common/components/blob-text'), {
	ssr: false,
});

// Landing folder
const MOM_LANDING_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/landing/momLanding.jpeg';
const POV_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/landing/POV.jpeg';
const COFFEE_FARM_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/landing/coffeeFarm.jpeg';
export const HIVE_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/landing/hive.jpeg';
const AVOCADO_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/landing/avocado.jpeg';
const BASKET_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/landing/basket.png';
const FLOWER_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/landing/flower.png';

const SMILE_1_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/landing/smiles1.png';
const SMILE_2_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/landing/smiles2.png';
const SMILE_3_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/landing/smiles3.png';

const GROUP_SMILE_1_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/landing/framedGroupPic.png';
const GROUP_SMILE_2_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/landing/smiles4.png';

const HOME_INTRO_IMAGE_IDS = [
	'hero-honey-jar',
	'hero-chilli',
	'hero-coffee-bag',
	'hero-bee-left',
	'hero-bee-right',
	'hero-main-image',
] as const;

// export default function Landing() {
const Landing = () => {
	const router = useRouter();
	const { isActive: isHomeIntroActive, markReady } = useHomeIntro();
	const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
	const introAssetsLoadedRef = useRef<Set<string>>(new Set());
	const introRevealQueuedRef = useRef(false);
	const markReadyRef = useRef(markReady);

	const sectionRef = useRef<HTMLDivElement | null>(null);
	const contentSectionRef = useRef<HTMLDivElement | null>(null);
	const wrapRef = useRef<HTMLDivElement | null>(null); // animated width/scale/y
	const heroContainerRef = useRef<HTMLDivElement | null>(null); // hero trigger point
	//TODO: is imgRef needed?
	const imgRef = useRef<HTMLImageElement | null>(null); // animate brightness
	const overlayRef = useRef<HTMLDivElement | null>(null); // fades in later
	const ctaRef = useRef<HTMLDivElement | null>(null); // CTA fades in later
	// const heroText1Ref = useRef<HTMLDivElement | null>(null); // text above the hero
	// const heroText1MobileRef = useRef<HTMLDivElement | null>(null); // text above the hero (mobile)
	// const heroText2Ref = useRef<HTMLDivElement | null>(null); // text inside the image
	const stickyRef = useRef<HTMLDivElement | null>(null);
	const pathRef = useRef<SVGPathElement | null>(null);
	const mapSectionRef = useRef<HTMLDivElement | null>(null);
	const flagSvgRef = useRef<SVGSVGElement | null>(null);

	// Refs for the stats cards (30+ acres, 1900m elevation, 100% farm fresh)
	const acresCardRef = useRef<HTMLDivElement | null>(null);
	const elevationCardRef = useRef<HTMLDivElement | null>(null);
	const farmFreshCardRef1 = useRef<HTMLDivElement | null>(null);
	const farmFreshCardRef2 = useRef<HTMLDivElement | null>(null);

	// Refs for lower-section image reveals
	const momLandingImageRef = useRef<HTMLDivElement | null>(null);
	const povImageRef = useRef<HTMLDivElement | null>(null);
	const flowerImageRef = useRef<HTMLDivElement | null>(null);
	const beeOneRef = useRef<HTMLDivElement | null>(null);
	const beeTwoRef = useRef<HTMLDivElement | null>(null);

	// helpers
	const _vhAdd = (n: number) => () => `+=${window.innerHeight * (n / 100)}`;
	const _preEnd = () => (sectionRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;

	useParallax(contentSectionRef, { selector: '[data-speed]', axis: 'y' });

	useEffect(() => {
		markReadyRef.current = markReady;
	}, [markReady]);

	const queueHomeIntroReveal = () => {
		if (introRevealQueuedRef.current) return;

		introRevealQueuedRef.current = true;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				markReadyRef.current();
			});
		});
	};

	const settleHomeIntroAsset = (assetId: (typeof HOME_INTRO_IMAGE_IDS)[number]) => {
		if (!isHomeIntroActive || introRevealQueuedRef.current) return;

		introAssetsLoadedRef.current.add(assetId);
		if (introAssetsLoadedRef.current.size !== HOME_INTRO_IMAGE_IDS.length) return;

		queueHomeIntroReveal();
	};

	const hideBrokenImage = (event: SyntheticEvent<HTMLImageElement>) => {
		event.currentTarget.style.display = 'none';
	};

	useEffect(() => {
		if (!isHomeIntroActive) return;

		introAssetsLoadedRef.current = new Set();
		introRevealQueuedRef.current = false;

		const fallbackTimer = window.setTimeout(() => {
			queueHomeIntroReveal();
		}, 4500);

		return () => {
			window.clearTimeout(fallbackTimer);
		};
	}, [isHomeIntroActive]);

	useLayoutEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const ctx = gsap.context(() => {
			const mm = gsap.matchMedia();

			// --- DESKTOP: smooth pinned scene ---
			mm.add('(min-width: 1px)', () => {
				if (!heroContainerRef.current || !wrapRef.current || !overlayRef.current || !ctaRef.current)
					return;

				// Initial states - start at normal size
				gsap.set(wrapRef.current, {
					// width: 500,
					// height: 200,
					position: 'relative',
					left: 'auto',
					top: 'auto',
				});
				gsap.set(overlayRef.current, { opacity: 0 });
				gsap.set(ctaRef.current, { opacity: 0, y: 24, pointerEvents: 'none' });

				// MAIN PINNED SCENE - expands hero to fullscreen
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: heroContainerRef.current,
						start: 'top center',
						end: '+=800vh',
						pin: true,
						pinSpacing: true,
						scrub: 1.5,
						fastScrollEnd: true,
						invalidateOnRefresh: true,
					},
					defaults: { ease: 'none' },
				});

				// Pre-animate: move to center before expansion starts (duration 0)
				tl.to(
					wrapRef.current,
					{
						position: 'fixed',
						top: '50%',
						left: '50%',
						xPercent: -50,
						yPercent: -50,
						duration: 0,
					},
					0,
				)
					// Then: expand to fullscreen from center (0 to 0.7)
					.to(
						wrapRef.current,
						{
							width: '100vw',
							height: '110vh',
							duration: 0.7,
						},
						0,
					)
					.to(overlayRef.current, { opacity: 0.6, duration: 0.7 }, 0)
					// Second: fade in CTA after image expansion (starting at 0.7)
					.to(
						ctaRef.current,
						{
							opacity: 1,
							y: 0,
							pointerEvents: 'auto',
							duration: 1,
							ease: 'power2.out',
						},
						0.7,
					);

				return () => {
					tl.scrollTrigger?.kill();
					tl.kill();
				};
			}); // Your map draw timeline can stay (or leave as you had it)
			if (mapSectionRef.current && stickyRef.current && pathRef.current) {
				const MAP_DRAW_SCROLL_DISTANCE_PX = 1100;
				const MAP_PIN_SCROLL_DISTANCE_PX = 660;
				const MAP_DRAW_START = 'top 55%';
				//not top top because i want some padding cause of nav bar
				const MAP_PIN_START = 'top 3%';
				const len = pathRef.current.getTotalLength();
				gsap.set(pathRef.current, {
					strokeDasharray: len,
					strokeDashoffset: len,
					opacity: 1,
				});
				if (flagSvgRef.current) gsap.set(flagSvgRef.current, { opacity: 0 });

				gsap
					.timeline({
						scrollTrigger: {
							trigger: stickyRef.current,
							start: MAP_DRAW_START,
							end: `+=${MAP_DRAW_SCROLL_DISTANCE_PX}`,
							scrub: 0.6,
							invalidateOnRefresh: true,
						},
						defaults: { ease: 'none' },
					})
					.to(pathRef.current, { strokeDashoffset: 0, duration: 0.75 }, 0)
					.to(flagSvgRef.current, { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.75)
					.to(pathRef.current, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0.75);

				ScrollTrigger.create({
					trigger: stickyRef.current,
					start: MAP_PIN_START,
					end: `+=${MAP_PIN_SCROLL_DISTANCE_PX}`,
					pin: true,
					pinSpacing: true,
					invalidateOnRefresh: true,
				});
			}

			// Animate the stats cards (30+ acres, 1900m elevation, 100% farm fresh) on scroll
			if (
				acresCardRef.current &&
				elevationCardRef.current &&
				farmFreshCardRef1.current &&
				farmFreshCardRef2
			) {
				// Set initial state
				gsap.set(
					[
						acresCardRef.current,
						elevationCardRef.current,
						farmFreshCardRef1.current,
						farmFreshCardRef2.current,
					],
					{
						opacity: 0,
						y: 30,
					},
				);

				// Create animation timeline
				gsap
					.timeline({
						scrollTrigger: {
							trigger: acresCardRef.current,
							start: 'top 80%',
							end: 'top 20%',
							scrub: false,
						},
					})
					.to(acresCardRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0)
					.to(
						elevationCardRef.current,
						{ opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
						0.1,
					)
					.to(
						farmFreshCardRef1.current,
						{ opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
						0.2,
					)
					.to(
						farmFreshCardRef2.current,
						{ opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
						0.2,
					);
			}

			const lowerRevealTargets = [
				{ element: momLandingImageRef.current, delay: 0, y: 100 },
				{ element: povImageRef.current, delay: 0, y: 100 },
				{ element: flowerImageRef.current, delay: 0, y: 30 },
				{ element: beeOneRef.current, delay: 0.1, y: 0 },
				{ element: beeTwoRef.current, delay: 0.15, y: 0 },
			];

			lowerRevealTargets.forEach(({ element, delay, y }) => {
				if (!element) return;

				gsap.set(element, { opacity: 0, y });
				gsap.to(element, {
					opacity: 1,
					y: 0,
					duration: 0.6,
					ease: 'power2.out',
					delay,
					scrollTrigger: {
						trigger: element,
						start: 'top 65%',
						end: 'top 20%',
						scrub: false,
					},
				});
			});

			ScrollTrigger.refresh();
		});

		return () => {
			ctx.revert();
		};
	}, []);

	return (
		<section className="overflow-x-hidden ">
			{/* <div className="h-60 w-full bg-amber-500"></div> */}
			<div className="h-10 w-full md:h-20 "></div>
			<div className="flex flex-col items-center w-full px-2">
				<div className="bg-yellow-200 flex items-center text-center w-full justify-center font-bold font-serif text-7xl xs:text-[120px] md:text-[150px]  text-green-900 uppercase p-10 max-w-6xl rounded-3xl tracking-tighter leading-[60px] xs:leading-[110px]">
					<h1 className="z-10">
						Abisaki&rsquo;s <br /> farm
					</h1>
				</div>
				<div className="flex">
					<div className="-mt-24 xs:-mt-40 h-40 right-[120px] xs:h-52 md:h-64 xs:right-48 md:right-60 absolute z-10 w-full will-change-transform">
						<Image
							// src="/images/honeyJar1.png"
							src={HONEY_JAR_IMAGE_URL}
							alt="Honey Jar"
							fill
							priority
							className="object-contain -rotate-12"
							onLoad={() => settleHomeIntroAsset('hero-honey-jar')}
							onError={(event) => {
								hideBrokenImage(event);
								settleHomeIntroAsset('hero-honey-jar');
							}}
						/>
					</div>
					<div className="-mt-14 xs:-mt-16 md:-mt-14 h-16 xs:h-20 md:h-24 right-2 md:right-0 absolute w-full will-change-transform">
						<Image
							// src="/images/chilli.png"
							src={CHILLI_IMAGE_URL}
							alt="Chilli"
							fill
							priority
							className="object-contain rotate-12"
							onLoad={() => settleHomeIntroAsset('hero-chilli')}
							onError={(event) => {
								hideBrokenImage(event);
								settleHomeIntroAsset('hero-chilli');
							}}
						/>
					</div>
					<div className="-mt-32 xs:-mt-44 md:-mt-48 h-56 w-32 ml-64 xs:h-56 md:h-72 xs:w-60 xs:ml-[400px] md:ml-[500px] z-10 will-change-transform overflow-x-clip">
						<Image
							// src="/images/YDcoffeeBag1.png"
							src={COFFEE_BAG_1_IMAGE_URL}
							alt="Coffee Bag"
							fill
							priority
							className="object-contain rotate-12 mr-96"
							onLoad={() => settleHomeIntroAsset('hero-coffee-bag')}
							onError={(event) => {
								hideBrokenImage(event);
								settleHomeIntroAsset('hero-coffee-bag');
							}}
						/>
					</div>
				</div>
				<div className="mt-4 md:mt-36">
					<p className="text-center text-green-900 font-serif text-2xl md:text-4xl leading-tight font-bold">
						Nurturing nature&rsquo;s gift of life as
						<br /> each new season unfolds
					</p>
				</div>
				<div className="flex w-full justify-center">
					<div className="motion-safe:animate-levitate mt-5 md:mt-10 mr-72 md:mr-[650px] absolute h-10 w-10 md:w-16 md:h-16 will-change-transform">
						<Image
							// src="/images/bee.png"
							src={BEE_IMAGE_URL}
							alt="Bee 1"
							fill
							priority
							className="object-cover"
							onLoad={() => settleHomeIntroAsset('hero-bee-left')}
							onError={(event) => {
								hideBrokenImage(event);
								settleHomeIntroAsset('hero-bee-left');
							}}
						/>
					</div>
					{/* <p>Bar</p> */}
					<div
						className="motion-safe:animate-levitate ml-64 md:ml-[750px] -mt-20 absolute h-10 w-10 md:h-16 md:w-16 will-change-transform"
						style={{ animationDelay: '0.5s' }}
					>
						<Image
							// src="/images/bee.png"
							src={BEE_IMAGE_URL}
							alt="Bee 2"
							fill
							priority
							className="object-cover scale-x-[-1]"
							onLoad={() => settleHomeIntroAsset('hero-bee-right')}
							onError={(event) => {
								hideBrokenImage(event);
								settleHomeIntroAsset('hero-bee-right');
							}}
						/>
					</div>
				</div>
				{/* <div className="w-96 h-1 bg-green-800 mt-36"></div> */}
				<div ref={heroContainerRef} className="mt-36 md:mt-56 z-100 flex justify-center">
					<div
						ref={wrapRef}
						className="relative h-40 w-[300px] md:h-[200px] md:w-[500px] will-change-transform"
						style={{
							transformOrigin: '50% 50%',
							left: 0,
							top: 0,
						}}
					>
						<Image
							ref={imgRef}
							// src="/images/Hero.jpg"
							src={HERO_IMAGE_URL}
							alt="Hero"
							fill
							priority
							className="object-cover rounded-lg"
							onLoad={() => settleHomeIntroAsset('hero-main-image')}
							onError={(event) => {
								hideBrokenImage(event);
								settleHomeIntroAsset('hero-main-image');
							}}
						/>
						{/* Overlay that fades in during scroll */}
						<div
							ref={overlayRef}
							className="absolute inset-0 bg-black rounded-lg"
							style={{ opacity: 0 }}
						/>
						{/* CTA content that fades in during scroll */}
						<div
							ref={ctaRef}
							className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-lg pointer-events-none"
							style={{ opacity: 0, pointerEvents: 'none' }}
						>
							<p className="text-white text-3xl md:text-6xl font-serif leading-tight text-center max-w-4xl font-bold">
								Explore our premium collection of farm-fresh products
							</p>
							<button
								onClick={() => router.push('/shop')}
								className="mt-0 md:mt-20 px-20 py-2 md:py-3 bg-yellow-500 text-green-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors pointer-events-auto text-md md:text-2xl"
								style={{ pointerEvents: 'auto' }}
							>
								Shop Now
							</button>
						</div>

						<div className="relative md:absolute mt-[85vh] md:mt-[70vh] left-1/2 -translate-x-1/2">
							<ScrollDownIndicator className="mx-auto mt-8 sm:mt-40 scale-75 md:scale-100" />
						</div>
					</div>
				</div>
				{/* Top one */}
				<div className="absolute mt-[650px] sm:mt-[750px] md:mt-[1050px] left-1/2 -translate-x-1/2">
					<ScrollDownIndicator className="mx-auto scale-75 md:scale-100" />
				</div>
			</div>

			{/* Content continues */}
			<section
				ref={contentSectionRef}
				className="z-[100] mx-auto flex max-w-7xl flex-col items-center py-24 mt-[50vh] md:mt-[55vh]"
			>
				{/* <div className="xs:min-h-[2150px] h-full w-full overflow-hidden md:min-h-[2500px]"> */}
				<div className="min-h-[3200px] xs:min-h-[3600px] h-full w-full overflow-hidden md:min-h-[3700px]">
					<div className="flex w-full justify-end">
						<div className="xs:-mt-[100px] xs:mr-16 xs:h-[450px] xs:w-64 absolute z-50 mt-[550px] mr-0 flex h-[350px] w-full overflow-hidden">
							<Image
								// src="/images/editedBranch.png"
								src={BRANCH_IMAGE_URL}
								alt="Branch"
								fill
								priority
								className="xs:ml-0 xs:rotate-0 xs:object-cover ml-16 rotate-90 object-contain"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
						<h3 className="z-50 mb-4 ml-5 flex w-full items-start font-serif text-6xl font-semibold text-green-900 md:text-7xl">
							Abisaki&apos;s
							<br />
							philosophy
						</h3>
					</div>
					<div className="xs:min-h-[100px] relative min-h-[610px] w-full justify-center">
						<div
							ref={momLandingImageRef}
							className="xs:h-72 xs:w-52 absolute z-50 h-60 w-44 rotate-3 md:mt-20 md:h-[400px] md:w-[300px] xl:ml-16"
						>
							<Image
								src={MOM_LANDING_IMAGE_URL}
								alt="Abisaki"
								fill
								priority
								className="xs:ml-5 ml-10 rounded-sm object-cover"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
						<div
							data-speed="0.35"
							className="xs:scale-50 xs:-mt-40 xs:mr-32 absolute top-0 right-0 z-50 mt-[400px] mr-32 h-16 w-16 scale-40"
						>
							<Image
								// src="/images/cherry.png"
								src={CHERRY_IMAGE_URL}
								alt="Cherry 1"
								fill
								priority
								className="object-cover"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
						<div
							data-speed="0.2"
							className="xs:scale-50 xs:mt-52 xs:mr-20 absolute top-0 right-0 z-50 mt-[620px] mr-10 h-16 w-16 scale-40"
						>
							<Image
								// src="/images/cherry.png"
								src={CHERRY_IMAGE_URL}
								alt="Cherry 2"
								fill
								priority
								className="object-cover"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
						<div
							data-speed="0.2"
							className="xs:scale-50 xs:mr-36 xs:mb-52 absolute right-0 bottom-0 z-100 mr-20 -mb-52 h-16 w-16 scale-40"
						>
							<Image
								// src="/images/cherry.png"
								src={CHERRY_IMAGE_URL}
								alt="Cherry 3"
								fill
								priority
								className="object-cover"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
						<div className="flex w-full justify-center md:ml-8">
							<BlobText
								title="A happy environment fosters fruitful results"
								description="Abisaki leads with love and care, guided by her vision of honest, nourishing food grown with integrity. What began as a family dream has blossomed into a farm rooted in quality, where every harvest reflects patience, respect, and heart."
								style="left"
								scale="scale-400"
								staticId="blob-philosophy-left"
								className="xs:mt-80 xs:ml-52 mt-64 ml-32 flex w-full justify-center md:mt-96"
							/>
						</div>
					</div>
					<div className="relative flex w-full items-center mt-[200px] xs:mt-[50px]">
						<div className="flex flex-1 justify-center">
							<BlobText
								title="Purity over volume"
								description="At Abisaki’s Farm, quality comes first. Every crop is grown with intention, the soil respected, the process mindful, and the growth unhurried. Good food takes time, and we honor that journey from seed to table."
								style="right"
								// scale="scale-220 md:scale-100"
								// className="mt-40 ml-10 md:mt-0"
								scale="scale-400"
								staticId="blob-story-right"
								className="xs:mt-80 ml-20 flex w-full justify-center md:mt-96"
							/>
						</div>
						<div className="xs:mt-10 h-52 w-[250px] xs:h-80 xs:w-[390px] xlarge:w-[450px] xlarge:h-96 absolute right-0 mr-0 z-50 mt-[600px] flex -translate-y-1/2 justify-end">
							<Image
								// src="/images/finalBasket.png"
								src={BASKET_IMAGE_URL}
								alt="Coffee Basket"
								fill
								priority
								className="rounded-sm object-cover"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
					</div>
					<div className="relative w-full justify-center">
						<div
							ref={povImageRef}
							className="xs:h-72 xs:w-52 absolute z-50 h-60 w-44 -rotate-3 mt-[450px] xs:mt-[90px] md:-mt-10 md:h-[400px] md:w-[300px] xl:ml-16"
						>
							<Image
								// src="/images/POV.jpg"
								src={POV_IMAGE_URL}
								alt="POV"
								fill
								priority
								className="ml-32 xs:ml-5 rounded-sm object-cover"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
						<div className="flex w-full justify-center -h-[600px]">
							<BlobText
								title="Purposeful growth"
								description="We let nature set the pace. Through regenerative farming, we grow only when the land and systems are ready. Each expansion is a mindful step, ensuring sustainability and harmony between soil, people, and produce."
								style="center"
								scale="scale-400"
								staticId="blob-values-center"
								className="xs:ml-52 mt-64 xs:mt-[400px] flex w-full justify-center"
							/>
							<div
								ref={flowerImageRef}
								className="xs:left-auto xs:right-0 absolute right-0 bottom-0 left-5 z-50 h-52 w-52 xs:h-60 xs:w-60 md:h-72 md:w-72"
							>
								<Image
									// src="/images/flower.png"
									src={FLOWER_IMAGE_URL}
									alt="Flower"
									fill
									priority
									className="mt-[710px] xs:mt-56 xs:scale-x-100 -scale-x-100 transform object-cover md:mt-60"
									onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
								/>
							</div>
							<div
								ref={beeOneRef}
								className="motion-safe:animate-levitate xs:left-auto xs:right-0 md:h-15 md:w-16 h-10 w-10 absolute right-0 bottom-0 left-5 z-50 will-change-transform"
							>
								<Image
									// src="/images/bee.png"
									src={BEE_IMAGE_URL}
									alt="Bee 1"
									fill
									priority
									className="mt-[600px] xs:mt-52 xs:ml-0 ml-32 object-cover md:mt-52 scale-x-[-1]"
									onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
								/>
							</div>
							<div
								ref={beeTwoRef}
								style={{ animationDelay: '0.5s' }}
								className="motion-safe:animate-levitate xs:left-auto xs:right-0 md:h-20 md:w-20 absolute right-0 bottom-0 left-0 z-50 h-10 w-10 will-change-transform"
							>
								<Image
									// src="/images/bee.png"
									src={BEE_IMAGE_URL}
									alt="Bee 2"
									fill
									priority
									className="mt-[700px] xs:mt-10 xs:-ml-40 ml-5 object-cover md:mt-32 md:-ml-55"
									onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
								/>
							</div>
						</div>
					</div>
					<div className="relative flex w-full items-center">
						<div className="flex flex-1 justify-center">
							<BlobText
								title="Ownership & Care"
								description="Our team ensures every product meets our high standards. Skilled, empowered, and dedicated, they handle each stage of production with care. From planting to packaging, we focus on safe, traceable, and responsibly grown farm produce."
								style="right"
								scale="scale-400"
								staticId="blob-story-right"
								// className="xs:mt-0 mt-60 ml-20 flex w-full justify-center"
								className="xs:mt-0 -mt-20 ml-20 flex w-full justify-center"
							/>
						</div>
						<div className="mt-[900px] overflow-clip">
							{/* Trio smiling */}
							<div
								data-speed="-0.2"
								className="h-[410px] w-full md:h-[460px] md:w-[250px] lg:h-[680px] lg:w-[350px] absolute right-20 md:right-0 md:left-10 mt-[810px] md:mt-[1000px] z-20"
							>
								<Image
									// src="/images/smiles.png"
									src={SMILE_1_IMAGE_URL}
									alt="smiles"
									fill
									priority
									className="rounded-sm object-contain md:object-cover -rotate-3"
									onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
								/>
							</div>
							<div>
								{/* Grandma */}
								<div
									className="h-[400px] w-full  md:h-[460px] md:w-[250px] lg:h-[680px] lg:w-[350px] absolute left-72 md:left-1/2 -translate-x-1/2 mt-[900px] md:mt-[1100px] z-10"
									data-speed="-0.225"
								>
									<Image
										// src="/images/smiles-3.png"
										src={SMILE_3_IMAGE_URL}
										alt="smiles"
										fill
										priority
										className="rounded-sm object-contain md:object-cover rotate-6 md:rotate-0"
										onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
									/>
								</div>
								<h2 className="absolute left-1/2 -translate-x-1/2 mt-[270px] md:mt-[300px] lg:mt-[400px] text-3xl md:text-4xl lg:text-[45px] font-serif font-bold text-green-900 text-center">
									{'Smile a little'}
								</h2>
							</div>
							{/* Cherry picking smile */}
							<div
								data-speed="-0.10"
								className="h-[450px] w-full md:h-[460px] md:w-[250px] lg:h-[680px] lg:w-[350px] absolute right-0 md:right-10 mt-[740px] md:mt-[550px] z-50 md:z-10"
							>
								<Image
									// src="/images/smiles-2.png"
									src={SMILE_2_IMAGE_URL}
									alt="smiles"
									fill
									priority
									className="rounded-sm object-contain md:object-cover -rotate-3 md:rotate-3"
									onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
								/>
							</div>
						</div>
					</div>
				</div>
				{/* Pinned/sticky block under your navbar (h-20 ≈ 80px) */}
				{/* <div ref={mapSectionRef} className="h-[180vh]"> */}
				<div
					ref={mapSectionRef}
					className="mt-10 xs:mt-0 mr-6"
					// className="mt-10 xs:mt-0 mr-6 h-[170vh] min-h-[1300px] md:h-[150vh]"
				>
					<div ref={stickyRef} className="z-10">
						<div className="mx-auto max-w-7xl px-4 pt-12">
							<Title title="Our Farm" />
							<div className="relative mx-auto mt-20 h-[407px] w-[343px]">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="370.814"
									height="472.064"
									viewBox="0 0 370.814 472.064"
								>
									<path
										ref={pathRef}
										data-name="Path 14"
										d="M1813.427,910.862l60.651-58.907s-1.708,2.272-1.36,4.173,2.968,3.682,4.129,2.947,2.045-3.359,4.316-2.947-3.828-2.467,6.251,0,12.652,4.42,11.483,4.733-2.914,1.018-1.86,2.874,3.022,3.2,1.86,4.342-1.6,1.714-1.86,4.245-2.036,5.928,0,11.185,5.541,6.181,6.676,8.375,1.107,3.043,0,4.527,1.763,2.093,3.512,3.591,9.9-.508,11.631,0,15.929-.1,17.179,0,8.737.984,11,1.545,4.92.787,6.391,2,.736,3.684,2.054,3.245,2.627-2.352,3.406,0,38.121,25.065,40.632,27.423,1.755,4.837,2.942,4.63a19.84,19.84,0,0,1,5.962,0c1.558.392,12.9,1.354,14.214,0s1.09-1.372,3.494,0,2.879,1.907,5.41,1.9,11.483,3.2,13.214,2.5,2.623-.664,4.808,0,7.182,2.537,10.015,1.834,6.5,1.546,7.9,1.862,1.436,3.4,3.167,1.376.586-4.1,5.974-9.475,2.436-1.271,6.619-8.638.977-1.373,5.284-4.639,9.515-4.88,13.245-6.448,5.246-1.621,7.293-3.023,15.756-6.112,17.335-7.7-.556-3.039,1.778,0,5.156,4.039,6.029,5.792,2.316-.151,3.788,1.912,1.718,4.8,3.536,5.575,2.982,2,4.735,2,12.815-.178,14.4-2,.83.2,2.842,0,2.564.48,4.555,0,2.673-.994,4.945,0,2.382,2.706,4.173,0,3.735-3.493,1.782,0-23.256,35.03-24.585,36.782-15.275,13.737-16.381,17.089-1.523,8.307-1.726,11.649.227,156.9,1.373,158.868,24.607,30.395,24.816,32.139.6,4.31,0,6-4.312,5.184-4.865,6.827-5.192,6.416-6.6,5.781-3.259-3.754-3.554-1.789,2.155,4.07,0,3.63-.812,2.218-1.712,3.991-1.718,1.542-4.007,1.873-6.133.274-4.08,2.089-.559,2.767-1.373,4.409-2.83-3.06-3.833-2.188-6.143-.3-4.488,2.188,4.572,3.971,2.589,5.558-8.33,4.661-9.38,7.082-6.2-5.216-14.737,2.719-8,8.382-6.613,9.9-.1,1.923,0,3.889.768,4.626,2.648,3.091-2.7,2.733-2.648,4.659-2.391,5.411-2.458,10.369-2.739-3.721-7.174,3.331-.451,3.839-1.534,8.331-6.554,15.3-7.092,17.543-6.433,9.44-6.992,11.88-3.84,10.275-6.547,15.993-11.312,5.2-11.329,7.724-67.126-49.714-68.7-49,2.091-4.744,0-5.028-7.4-.09-6.879-1.409-2.525-3.7-1.348-5.025,5.457-.974,5.182-3.638-.392-11.606-2.062-12.309-164.848-93.32-166.166-93.32-3.649-2.323-5.87-1.523.548-16.245,0-17.778,2.8-21.505,2.256-23.829-3.439-6.7-2.256-9.111,7.16-10.024,7.679-12.221,1.567-8.1,2.547-10.6,5.136-1.868,6.369-3.205,1.394-3.642,0-4.765,5.314,1.692,7.667-6.187-3.205,1.59,0-4.066,3.751-5.223,5.477-4.53-.628-.089,0-2.286,2.585-.157,4.4-1.915,6.449-.488,6.8-2.64-1.961-5.093-1.7-7.026,2.813-.685,3.526-2.543.29-5.229,1.761-5.669,5.828-.99,4.853-7-.02-6.445,1.448-8.654-4.209-.93-3.055-4.475-3.99-16.01-3.246-18.6,1.893-10.726,0-8.735-5.12-1.47-5.287-2.759.06-9.716-3.289-9.979-4.559-2.795-6.208-9.767-5.081,1.061-5.477-2.782-.572-7.678-2.18-11.055,1.182-3.941,2.18-8.488.035-3.57-2.18-5.533-4.18-4.884-4.074-2.1-1.868,1.836-3.14-1.886-7.407,4.464-4.643,0,2.308-5.51,0-5.167-1.659-4.169-4.356-5.571,2.192-2.54,0-6.017S1813.427,910.862,1813.427,910.862Z"
										transform="translate(-1809.46 -851.597)"
										fill="none"
										stroke="#1f2937" // gray-800
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>

								<svg
									ref={flagSvgRef}
									className="pointer-events-none absolute inset-0 opacity-0"
									width="369.396"
									height="469.983"
									viewBox="0 0 369.396 469.983"
								>
									<defs>
										<clipPath id="clip-path">
											<path
												id="path4317"
												d="M38.81-80-2.163-39.766-20.8-21.31l1.338.646,1.016.83.6,1.062-.046,1.43.046.6.369.507.553.507.369.507.138.508v.553l-.092,1.062-.185.645-.231.461v.461l.369.739.553.507.646.461.553.507.093.738-.461,1.2-.6,1.062-.092.784,1.108.415.738-.138,1.8-.646h.923l1.015.507.092.646-.507.6-2.168,1.154.092.278.692.231.6.738-.923.553-.324.369.6.231.369-.046.83-.185.877-.046.923-.278.507-.046v.231L-7.607.377l.738,1.846.507.323.231-.231.185-.415.507-.461,1.245-.369.831.323,1.476,1.615.877.461.877.278.646.415.323.97L.744,8.867.282,10.712-.594,12.05l-.415.184-.461.139-.415.185-.277.415.046.507.554.969.185.507-.047.461-.461,1.108-.138.507.092.554.369.507.461.461.323.507.6,1.846.461,5.676L.79,27.645l.923.6,2.215.6.969.646.507.969,1.338,7.014.461.784L8.68,39.873l.692,1.108.415.461.646.139.277-.093.507-.415.185-.092.139-.092.184-.369.139-.046.185.092.092.139.046.185.093.046.092.138,1.338.646.231.046.323.369.185.415.923,2.906.692,4.015L18,53.53l.461.415.645.046.369-.323.277-.415.415-.046.461.646.277,2.261.277.876,1.246,1.292.415.784-.093,1.062-.692.831-.923.507-.83.646-.415,1.154.277,1.8,4.706,11.351v.876l-.415,2.076-.093.877.093.969.184.923.324.831.415.461,1.061,1.015.231.508-.185.507-.83,1.061-.231.554-.046,9-.278,1.015-1.43,3.092-.369.507-.461.461-.461.185-.97.231-.461.231-1.061,1.568-.969,3.738L16.2,109.314l.138,1.661.831,1.846.461,1.846-.553,1.892L15.6,117.2l-3.783.415-.969.554L9.28,119.7l-2.261.507-.323.877L6.65,122.1l-.231.415-.277.415-.969.185-.738-.415-.785-.185-.923.923-.461.831-.369.969-.277.969v2.076l-.278.923-1.2,2.953-1.338,1.754-.645,1.846-.785.738-3,1.476-.369.369L-6.27,140l-.738,1.984-1.108,1.2-1.476.738-1.892.692-1.384.923-.785,1.43-1.154,4.707-.138.415-.324.461-.784.923-.231.415.092.877.508,1.661-.139.97-.415.6-1.661,1.292-6.782,9.043-.139.923,2.261,7.474.6,2.03.047,1.754-2.677,23.486.415,15.641h4.429l.092,1.246.6.369,1.707.139,30.776,17.164,135.007,75.394.692,1.108.923,5.629.923,5.63-.831.092-.461.37-.184.646.092.83-.877.046-1.108.6-1.015.831-.692.738-.231.415-.231.507-.092.553.046.461.323.324.785.138.231.324-.185.784-.37.877.139.646,2.214-.139.97.092.969.278.877.415.645.6.369.692.784,2.86.461.923.646.831,65.519,47.2.139-.231.138-.047.185-.046.185-.046.923-.646.831-1.338,1.015-.923,1.338.37.277-.646.046-.277,1.108,1.338,1.754.461,1.522-.231.507-.646L229,385.327l-.092-.369.138-.646.278-.046.323.185.231.046.369-.738.277-.692.323-.646.6-.461.185.646-.139,1.338.277.876,1.569-4.752.139-.185.645-.6.185-.277-.046-.6.046-.231.369-.508.415-.415.369-.047.415.646.507-1.338,1.523-5.675,1.476-3.737,2.307-3.969.185-1.107-.923-.831-1.615-.507-1.523.138-.645.877-.231-.461-.093-.461v-.969l.139-.323.415-.047.553.047h.461l1.43-.369.461-.369.324-.83-1.2-.277-.553-.231-.461-.415.507-.415.554.046,1.154.646.83-.646.046.646-.092,1.062.323.553.37.231.277,1.062.461.231.415-.231.415-.461.323-.6.093-.415.184-.323.97-1.062.092-.784-.507-.277-1.016.092-.461-.415-.184-.415-.185-.461-.277-.461-.185-.461.277-.322,1.015-.6v1.569l.923.692,1.338-.185,1.2-1.153,3.691-10.243.093-1.476-.093-.692-.323-.692-.507-.37-1.615.646-.646-.185-.185-.553.554-.646h-.923l-.554-.415-.138-.692.369-.831.507.37-.046.185-.185.415,1.2.092.231.046.6.692.231.139,1.016.415.369-.093.6-.507.507-1.062.507-2.676,1.246-1.984.923-2.445.784-1.338-.046-.277-.185-.231-.092-.278.277-1.107.046-.461v-.646l.046-.6.37-.461.83-.185-.092.646-.461,1.754-.37.784.785-.138.646-.508,1.107-1.291.6-.369,2.215-1.015.692-.461.507-.554.415-.692.277-.692v-.876l-.461-1.662v-.6l1.569-2.261.323-.784.185-2.354.231-.553.969-1.292,1.615-1.522.369-.554-.047-.507-.923.692-.969.093-.553-.554.231-1.2-.969-.738.092-1.523.877-2.906.046-.415.185-.692-.046-.324-.692-.923-.093-.369.185-.738,1.384-1.754.877-1.938.369-.646.554-.554,2.307-1.892,1.338-.83,1.153-.37,1.938-1.384,4.66-1.476,1.523-.139,1.476.323,1.384.646,1.384.277,1.615-.6,2.814-3.323,2.123-.923,1.476-1.015,1.245-1.245.554-1.062-.324-.646-1.291-.877-.324-.692.324-.507.092-.277-.231-.139-.369-.138-.278-.324-.092-.415-.046-.415.969.507.969-.831,1.016-1.245,1.154-.646.692-.092.323-.139-.092-.092.507.185.046.184-.092.231.184.37,1.108,1.2.646.415.784.277-1.476.738.139.554,1.015-.231,1.154-1.384.507-1.2-.092-.508-.415-.645-.6-.415-.553-.046-.507.092-.415-.139-.6-1.154-.277-1.8-.046-3.369-.185-.277-.323-.093-.324-.092-.184-.461.138-.277.415-.231.092-.324-.138-.738-.415-.507-.6-.185-.738.324.139-.554-.139-.6-.323-.692.553-.692.461.184.415.508.461.277.831.646.876,2.814.831.646,1.015-1.246.185-5.4,1.615-1.246-.692,1.016-.185.553.139.646v.553l-.461,1.292v.692l.185.646.323.461.415.323.6.277.738.047.507-.508.461-.645,1.245-.508.923-1.015.554-.323h.415l1.8.415,1.338.139.415-1.062.185-1.107.923-.97.046,1.016.553.507.785.092.877-.323.692.877.969-.6,1.615-2.03,2.63-2.353,1.016-.646.231-.784,1.661-2.538,3.507-3.6.046-.969.093-2.906-.139-.831-.553-1.015-20.395-26.347-4.706-6.044-.507-40.049V58.191l-.139-14.627.646-1.291,16.8-16.565,9.5-13.657,15.5-22.194-2.261,1.292-2.076-.369-2.03-1.107-2.168-.692-1.984,1.107-.645.139-.692-.092-1.2-.508-.738-.046-3.691.877-1.245.092-2.307.646-9.874.554-2.4-.278L308.5-9.452l-2.03-1.568-2.953-4.153-1.245-1.108-.738-.461-2.169-.738-.877-.415-.461-.461-.784-1.43-1.108-1.292-2.768-1.892-1.061-1.338L289.4-22.417l-14.673,5.63-.231.277-.277.738-.277.231-8.305,2.907H265.5l-.138-.047-.139-.092-.415-.046-.046.185.046.323-.231.231L262.5-11.02l-12.411,6-.923,1.107L246.95,1.9l-.738,1.43-.877,1.154-6.69,6.09L237.491,12,236.476,15.1l-.785,1.2-1.476.046-.738-.461-.324-.6-.277-.646-.369-.507-1.43-.508-5.768-.138.415-.877-.185-.461-.6-.046-.324.185-1.8,1.015-1.753.046-1.8-.369L214.513,10.8l-.415-.138-2.676.553-.692.046-.692-.277-.784-.092-1.938.369h-1.2L198.133,9.1l-.876-.461-.692-.692-1.246-1.661v.323l-.046.6v.323L192.6,7.343l-.277-.138-.046-.278-.092-.138-.646.231-.231.046-.6-.046-.646-.185-.184-.277-.093-.369-.369-.415-.877-.738-.231-.092-.461.185-.093.369.047.415-.047.277L185.4,7.206l-2.584.231-9.828-1.108-1.476.092-1.43.369-.554-.093-1.061-.923-1.384-.415-.6-.324-.692-.83-1.2-1.892-.877-.876L123.846-24.217l-.277-.046h-.277l-.231-.046-.185-.231-.231-1.062-.185-.415-.277-.415-.369-.139-.923.093-.324-.231-.738-1.2-.461-.369-1.846-.415L114.2-30.353l-2.722-.738-8.905.046-.369-.093-.692-.415-.415-.093-15.781.324-.6-.047-.831-.415-.461-.139H82.92l-1.569.231-6.736.046H74.43l-1.061-.231-.97-.646L70.6-34.09,69.77-34.6l-.323-.645.046-.785.138-.923-.046-.923-.646-1.061-.046-.831L62.572-46.41l-1.108-1.938-.415-2.261.231-9.644.231-.6,1.754-2.215.369-.923v-.923l-.415-1.154L62.3-67.773l-.139-.923.323-1.062,1.246-1.8-.231-.415-2.538-.969-3.045-1.892-1.154-.323-.831.231-.831.369-1.107.231L52.883-74.6,50.9-76.217l-1.061-.646-.831-.185-.969-.138h-.969L46.238-77l-1.015.645-1.892,2.076-1.015.692-1.108.185-.877-.415-.692-.738-1.522-2.4-.185-.415.092-.6.324-.461.369-.507.278-.507L38.81-80ZM306.286,267.345l-.553.646-.415.923-.923.461-1.108.323-.83.461-.6,1.062-.553,1.43v1.062l1.015-.231.092.6.185.415.369.277h.553l.185-.461-.323-.323-.508-.277-.277-.369.139-.646.323-.369.415-.093.415.324,1.707-.923.831-.277.6-.047.047.093.184.185.231.231.323.092.277-.046.139-.139.092-.092.139-.046.277-.185.185-.369.046-.507v-.507l.6.969.831-.139.369-.969-.877-1.476-.969-.507-1.384-.461-1.246-.093Z"
												transform="translate(24.818 80)"
												fill="#fefe2e"
												opacity="0.542"
											/>
										</clipPath>
									</defs>
									<g id="Flag_map_of_Kenya" transform="translate(120 80.024)">
										<path
											id="rect7-1"
											d="M-72.7.305l-.153.184L-73.771,1l-.83.646L-75.017,2.8l.277,1.8,4.706,11.352v.875l-.415,2.077-.093.877.093.969.184.923.324.83.415.462,1.06,1.015.231.508-.184.508-.83,1.06-.231.554-.046,9-.278,1.015-1.43,3.092-.369.508-.461.461-.461.185-.97.23-.462.231-1.06,1.568-.969,3.738-2.723,2.214.138,1.661.83,1.845.462,1.846-.554,1.893-1.476.645-3.783.415-.969.554-1.569,1.522-2.261.508-.323.876-.047,1.015-.231.415-.277.415-.969.185-.738-.416-.785-.184-.923.923-.461.83-.368.969-.277.969v2.077l-.278.923-1.2,2.953L-96.1,73.437l-.645,1.846-.785.738-3,1.476-.368.369-.278,1.661-.738,1.985-1.108,1.2-1.476.739-1.892.692-1.384.923-.785,1.43-1.153,4.707-.138.415-.324.462-.784.922-.231.415.092.876.509,1.662-.139.97-.415.6-1.661,1.292-6.783,9.043-.138.923,2.261,7.474.6,2.03.047,1.754-2.676,23.485.415,15.641h4.429l.092,1.246.6.368,1.707.139,30.776,17.163L-63.712,188H233.136l.02-.646-.138-.83-.554-1.015-20.395-26.348-4.705-6.044-.508-40.049V.305H-72.7Z"
											transform="translate(0 60.775)"
											fill="#fff"
											stroke="#b00"
											strokeWidth="0.533"
										/>
										<path
											id="rect9"
											d="M-57.832-79.695-98.806-39.46-117.446-21l1.338.646,1.015.83.6,1.061-.046,1.431.046.6.369.507.554.508.369.507.137.509v.554l-.092,1.061-.184.645-.231.462v.461l.369.739.554.508.646.461.554.508.093.738-.462,1.2-.6,1.061-.092.785,1.108.415.738-.137,1.8-.646h.922l1.016.507.092.646-.508.6-2.168,1.154.093.278.692.23.6.739-.923.553-.324.369.6.231.369-.046.829-.185.877-.046.923-.278.508-.046v.231L-104.25.681l.738,1.846.508.323.23-.231.185-.414.508-.462,1.245-.369.831.323,1.476,1.615.876.462.877.278.646.414.323.97L-95.9,9.172l-.462,1.845-.876,1.339-.416.183-.461.139-.415.184-.277.416.046.507.554.969.184.508-.047.461-.461,1.108-.138.507.093.554.369.508.461.461.323.508.6,1.845.462,5.676.507,1.06.923.6,2.215.6.969.646.508.969,1.338,7.014.461.785,1.476,1.615.692,1.107.415.461.646.139.277-.093.508-.416.184-.092.139-.092.183-.369.139-.047.184.093.093.138.046.185.093.046.093.137,1.338.646.23.046.323.37.185.415.923,2.906.692,4.015,1.938,4.059.462.416.645.046.369-.323.277-.416.415-.046.461.646.277,2.261.277.876,1.246,1.292.415.785-.093,1.061-.539.646H205.123V58.5l-.139-14.627.646-1.291,16.8-16.565,9.505-13.657,15.5-22.195-2.261,1.292L243.1-8.916l-2.031-1.106-2.168-.692-1.984,1.106-.645.139-.692-.093-1.2-.508-.738-.046-3.692.876-1.245.093-2.308.646-9.874.554-2.4-.278-2.261-.922-2.03-1.568-2.954-4.153-1.246-1.108-.738-.461-2.169-.739-.876-.415-.462-.461-.784-1.431-1.108-1.292-2.768-1.892L195.663-24l-2.907,1.892-14.673,5.63-.23.276-.277.739-.277.231-8.305,2.907h-.139l-.138-.048-.139-.092-.415-.046-.046.185.046.323-.231.23-2.076,1.062-12.411,6-.923,1.107L150.306,2.2l-.738,1.43-.877,1.154L142,10.879l-1.153,1.431L139.834,15.4l-.785,1.2-1.476.046-.739-.461-.324-.6-.277-.646-.369-.508-1.43-.508-5.768-.138.415-.877-.184-.461-.6-.046-.324.184-1.8,1.015-1.752.046-1.8-.368L117.87,11.11l-.414-.138-2.677.554-.692.046-.692-.277-.784-.092-1.938.368h-1.2L101.49,9.4l-.876-.461-.692-.692L98.675,6.588v.323l-.046.6v.323l-2.677-.185-.276-.137-.047-.278L95.538,7.1l-.646.231-.231.046-.6-.046-.647-.185-.183-.276-.093-.37L92.77,6.08l-.877-.738-.231-.093-.461.185-.093.368.048.416-.048.276L88.755,7.511l-2.584.23L76.343,6.634l-1.476.092L73.437,7.1,72.883,7,71.822,6.08l-1.384-.414-.6-.324-.692-.83-1.2-1.893-.877-.876L27.2-23.912l-.277-.046H26.65L26.419-24l-.184-.231L26-25.3l-.185-.414-.276-.416-.369-.138-.922.093-.324-.23-.739-1.2-.461-.368-1.846-.416-3.321-1.661-2.723-.738-8.906.046-.368-.093-.692-.415-.415-.093-15.781.324-.6-.047-.831-.414-.461-.139h-.508l-1.569.231-6.736.046h-.185l-1.06-.231-.97-.646-1.8-1.568-.83-.508-.323-.645.046-.785.138-.922-.047-.923L-27.7-38.63l-.046-.83L-34.071-46.1l-1.107-1.937-.415-2.261.23-9.643.231-.6,1.753-2.215.369-.923v-.923l-.415-1.153-.923-1.707-.138-.923.323-1.061,1.246-1.8-.231-.415-2.538-.969-3.045-1.892-1.154-.323-.831.231-.83.368-1.107.231L-43.76-74.3l-1.984-1.615-1.061-.646-.83-.185-.969-.137h-.969l-.831.184-1.015.645-1.893,2.077-1.015.692-1.107.185-.877-.416L-57-74.251l-1.522-2.4-.185-.415.092-.6.324-.461.369-.508.277-.507-.184-.554Z"
											transform="translate(1.733 0)"
											stroke="#000"
											strokeWidth="0.56"
										/>
										<path
											id="rect11"
											d="M-87.895,106.972,29.347,172.445l.692,1.107.923,5.629.923,5.629-.831.093-.461.369-.184.646.093.829-.877.047-1.108.6-1.015.83-.692.738-.231.416-.23.507-.093.554.047.462.323.323.785.137.231.324-.185.785-.369.876.139.646,2.213-.139.97.092.969.278.877.414.645.6.369.692.785,2.86.461.923.646.831,65.52,47.2.138-.231.138-.047.185-.046.184-.047.923-.646.831-1.338,1.015-.923,1.338.37.277-.646.046-.277,1.108,1.338,1.753.461,1.522-.23.507-.646-.738-1.016-.092-.369.137-.646.278-.046.323.184.231.047.369-.739.277-.692.323-.646.6-.461.184.646-.138,1.338.277.876,1.569-4.752.138-.185.645-.6.185-.276-.046-.6.046-.231.369-.509.415-.414.368-.047.416.646.507-1.338,1.523-5.675,1.476-3.737,2.307-3.968.184-1.107-.922-.83-1.615-.508-1.523.139-.645.877-.231-.462-.093-.461v-.969l.138-.323.415-.047.554.047h.462l1.43-.37.462-.369.324-.829-1.2-.277-.554-.231-.461-.415.507-.415.554.046,1.154.646.829-.646.046.646-.092,1.061.323.554.369.231.277,1.061.461.231.416-.231.415-.461.323-.6L125,217.2l.184-.323.97-1.061.092-.784-.507-.277-1.015.092-.462-.415-.183-.416-.185-.461-.277-.462-.184-.461.276-.323,1.015-.6v1.568l.922.693,1.339-.185,1.2-1.154,3.692-10.243.093-1.476-.093-.692-.323-.693-.508-.369-1.615.646-.646-.184-.184-.554.554-.646h-.922l-.554-.415-.138-.692.368-.831.508.369-.046.185-.185.415,1.2.092.231.047.6.692.23.138,1.016.415.368-.093.6-.507.507-1.062.508-2.675,1.246-1.984.923-2.445.784-1.338-.046-.277-.185-.231-.092-.278.277-1.106.046-.462v-.646l.046-.6.369-.462.83-.184-.092.646-.462,1.753-.369.785.785-.138.646-.509,1.106-1.291.6-.369,2.215-1.015.692-.461.508-.554.415-.692.277-.692v-.876l-.462-1.662v-.6l1.569-2.261.323-.785.185-2.354.231-.554.969-1.292,1.615-1.522.369-.554-.047-.508-.923.692-.969.093-.554-.554.231-1.2-.969-.738.092-1.523.877-2.906.046-.415.184-.692-.046-.324-.692-.923-.093-.368.184-.739,1.385-1.753.876-1.937.369-.646.554-.555,2.308-1.892,1.338-.83,1.153-.369L156,150.021l4.66-1.477,1.523-.138,1.476.323,1.385.646,1.384.277,1.615-.6,2.815-3.322,2.123-.923,1.476-1.015,1.246-1.245.555-1.062-.324-.646-1.291-.877-.324-.692.324-.507.092-.277-.231-.139-.368-.137-.278-.324-.092-.415-.046-.415.969.508.969-.831,1.015-1.246,1.154-.646.692-.092.323-.138-.092-.093.507.185.046.183-.092.231.184.369,1.107,1.2.646.415.785.277-1.477.739.138.554,1.015-.23,1.153-1.385.508-1.2-.092-.509-.416-.645-.6-.415-.553-.047-.508.093-.415-.139-.6-1.154-.277-1.8-.046-3.369-.185-.277-.323-.093-.324-.092-.183-.461.137-.277.416-.231.092-.324-.138-.738-.415-.508-.6-.184-.738.324.138-.554-.138-.6-.323-.692.553-.692.462.183.415.509.462.277.83.646.876,2.814.831.646,1.015-1.246.184-5.4,1.615-1.246-.692,1.015-.184.554.138.646v.553l-.461,1.292v.693l.184.646.323.461.416.323.6.277.739.047.507-.508.462-.645,1.246-.509.923-1.015.554-.323h.416l1.8.414,1.338.139.416-1.062.184-1.106.923-.97.046,1.015.554.508.785.092.877-.323.692.877.969-.6,1.615-2.031,2.63-2.353,1.016-.646.231-.784,1.661-2.538,3.507-3.6.046-.969.072-2.26H-87.895Zm275.088,18.871-.553.646-.416.923-.922.462-1.108.323-.83.461-.6,1.061-.554,1.431v1.061l1.015-.231.092.6.185.416.369.276h.554l.184-.461-.323-.323-.508-.277-.277-.369.138-.646.323-.368.416-.093.415.324,1.706-.923.831-.277.6-.047.047.093.183.185.231.23.324.092.277-.046.138-.138.093-.093.138-.046.277-.184.185-.37.046-.507v-.508l.6.969.83-.138.369-.969-.876-1.476-.969-.507-1.385-.462-1.246-.093Z"
											transform="translate(24.183 141.807)"
											fill="#060"
											stroke="#060"
											strokeWidth="0.56"
										/>
										<g
											id="g4250"
											transform="translate(-119.728 -79.695)"
											clipPath="url(#clip-path)"
										>
											<g id="spear" transform="translate(95.551 65.987)">
												<path
													id="use14"
													d="M5.866,352.2h5.866V78.2C17.6,72.333,17.6,63.534,17.6,54.736c0-5.866,0-29.328-8.8-54.736C0,25.408,0,48.87,0,54.736c0,8.8,0,17.6,5.866,23.463Z"
													transform="matrix(0.866, 0.5, -0.5, 0.866, 176.099, 0)"
													stroke="#000"
													strokeWidth="1.667"
												/>
												<path
													id="use16"
													d="M5.866,352.2h5.866V78.2C17.6,72.333,17.6,63.534,17.6,54.736c0-5.866,0-29.328-8.8-54.736C0,25.408,0,48.87,0,54.736c0,8.8,0,17.6,5.866,23.463Z"
													transform="matrix(0.866, 0.5, -0.5, 0.866, 176.099, 0)"
													fill="#fff"
												/>
											</g>
											<g id="use18" transform="translate(273.343 379.8) rotate(180)">
												<path
													id="use14-2"
													data-name="use14"
													d="M5.866,0h5.866V274c5.866,5.866,5.866,14.664,5.866,23.463,0,5.866,0,29.328-8.8,54.736C0,326.792,0,303.329,0,297.463c0-8.8,0-17.6,5.866-23.463Z"
													transform="matrix(0.866, -0.5, 0.5, 0.866, 0, 8.798)"
													stroke="#000"
													strokeWidth="1.667"
												/>
												<path
													id="use16-2"
													data-name="use16"
													d="M5.866,0h5.866V274c5.866,5.866,5.866,14.664,5.866,23.463,0,5.866,0,29.328-8.8,54.736C0,326.792,0,303.329,0,297.463c0-8.8,0-17.6,5.866-23.463Z"
													transform="matrix(0.866, -0.5, 0.5, 0.866, 0, 8.798)"
													fill="#fff"
												/>
											</g>
											<path
												id="path20"
												d="M-120,43.721V184.5H176.213c8.8,23.462,38.126,70.387,55.723,70.387s46.925-46.925,55.723-70.387H583.873V43.721H287.66c-8.8-23.462-38.126-70.387-55.723-70.387s-46.925,46.925-55.723,70.387Z"
												transform="translate(-47.49 120.517)"
												fill="#b00"
											/>
											<path
												id="deco_r"
												d="M118,154.108c8.8-23.462,14.664-46.925,14.664-70.387S126.8,36.8,118,13.333c-8.8,23.462-14.664,46.925-14.664,70.387S109.2,130.646,118,154.108"
												transform="translate(122.173 150.904)"
											/>
											<path
												id="use23"
												d="M14.664,0c8.8,23.462,14.664,46.925,14.664,70.387s-5.866,46.925-14.664,70.387C5.866,117.312,0,93.85,0,70.387S5.866,23.462,14.664,0"
												transform="translate(143.388 305.012) rotate(180)"
											/>
											<g id="g25" transform="translate(169.783 94.29)">
												<ellipse
													id="ellipse27"
													cx="11.731"
													cy="17.597"
													rx="11.731"
													ry="17.597"
													transform="translate(2.933 122.738)"
													fill="#fff"
												/>
												<path
													id="deco_br"
													d="M1.667,9.75S13.4,33.213,13.4,71.339,1.667,132.928,1.667,132.928Z"
													transform="translate(15.93 147.742)"
													fill="#fff"
												/>
												<path
													id="use30"
													d="M0,0S11.731,23.462,11.731,61.589,0,123.178,0,123.178Z"
													transform="translate(11.731 123.178) rotate(180)"
													fill="#fff"
												/>
												<path
													id="use32"
													d="M0,123.178S11.731,99.716,11.731,61.589,0,0,0,0Z"
													transform="translate(11.731 280.67) rotate(180)"
													fill="#fff"
												/>
												<path
													id="use34"
													d="M1.667,43.428S13.4,19.965,13.4-18.161,1.667-79.75,1.667-79.75Z"
													transform="translate(15.93 79.75)"
													fill="#fff"
												/>
											</g>
										</g>
										<path
											id="path4444"
											d="M25.694-15.856l1.43.508.37.507.276.646.324.6.738.461,1.476-.046.785-1.2,1.015-3.092,1.154-1.43,6.69-6.09.877-1.153.738-1.43,2.215-5.814L44.7-34.5l12.411-6"
											transform="translate(110.474 29.78)"
											fill="none"
											stroke="#000"
											strokeWidth="0.533"
											fillRule="evenodd"
										/>
										<path
											id="path4469"
											d="M-69.219,117.4l33.752,18.848"
											transform="translate(38.37 149.73)"
											fill="none"
											stroke="#060"
											strokeWidth="0.533"
											fillRule="evenodd"
										/>
									</g>
								</svg>
							</div>
						</div>
					</div>
				</div>

				{/* Content after the sticky/draw section */}
				<div className="w-full mx-auto mt-24 mr-110 max-w-3xl overflow-x-hidden px-4 text-center">
					<h2 className="text-4xl leading-none xs:text-5xl font-serif text-green-900 text-center font-bold pb-10">
						In the perfect place for healthy growth and happy harvests
					</h2>
					<p className="xs:text-xl text-md text-gray-700 md:text-lg">
						Our 30-acre farm sits 1,900 meters above sea level, where cool air, steady rains, and
						rich soil create ideal conditions for growing quality produce. The land supports us
						generously, and we care for it in return. Just as important are the people here. Joyful,
						hardworking team who take pride in every seed planted and every harvest gathered.
					</p>
					<div className="flex flex-col gap-10">
						<div className="flex justify-center gap-5 xs:gap-10 mt-10">
							<div
								ref={acresCardRef}
								className="flex text-center flex-col items-center justify-center"
							>
								<h2 className="text-7xl md:text-8xl text-yellow-500 font-extrabold font-serif">
									30+
								</h2>
								<p className="text-xl font-bold xs:font-normal md:text-3xl text-green-900 font-serif -mt-2 uppercase">
									Acres
								</p>
							</div>
							<div
								ref={elevationCardRef}
								className="flex text-center flex-col items-center justify-center"
							>
								<h2 className="text-7xl md:text-8xl text-yellow-500 font-extrabold font-serif">
									1900m
								</h2>
								<p className="text-xl font-bold xs:font-normal md:text-3xl text-green-900 font-serif -mt-2 uppercase">
									Elevation
								</p>
							</div>
							<div
								ref={farmFreshCardRef1}
								className="hidden xs:flex text-center flex-col items-center justify-center"
							>
								<h2 className="text-7xl md:text-8xl text-yellow-500 font-extrabold font-serif">
									100%
								</h2>
								<p className="text-lg md:text-3xl text-green-900 font-serif -mt-2 uppercase">
									Farm Fresh
								</p>
							</div>
						</div>
						<div
							ref={farmFreshCardRef2}
							className="xs:hidden flex text-center flex-col items-center justify-center"
						>
							<h2 className="text-7xl text-yellow-500 font-extrabold font-serif">100%</h2>
							<p className="text-xl font-bold xs:font-normal text-green-900 font-serif -mt-2 uppercase">
								Farm Fresh
							</p>
						</div>
					</div>

					{/* <div className="h-[480px] w-[680px] absolute left-1/2 -translate-x-1/2"> */}
					<div className="flex flex-col h-[900px] xs:mt-32 overflow-clip">
						<div
							data-speed="-0.15"
							className="h-56 w-[90vw] max-w-96 xs:h-[480px] xs:max-w-[680px] xs:-ml-5 absolute left-1/2 -translate-x-1/2 mt-[1300px] z-10 overflow-clip"
						>
							<Image
								// src="/images/framed-group-pic-2.png"
								src={GROUP_SMILE_1_IMAGE_URL}
								alt="Group Picture"
								fill
								priority
								className="rounded-sm object-cover rotate-3"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
						<h2 className="absolute left-1/2 -translate-x-1/2 mt-[420px] xs:mt-[530px] text-3xl xs:text-[45px] font-serif font-bold text-green-900 text-center z-0 text-nowrap overflow-clip">
							{'Always smiling'}
						</h2>
						<div
							data-speed="0.17"
							className="h-56 w-[92vw] max-w-[450px] xs:h-[450px] xs:max-w-[750px] absolute left-1/2 -translate-x-1/2 z-50 -mt-[800px] overflow-clip "
						>
							<Image
								// src="/images/smiles-4.png"
								src={GROUP_SMILE_2_IMAGE_URL}
								alt="Smiles"
								fill
								priority
								className="rounded-sm object-cover -rotate-3 ml-10 xs:ml-20"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
					</div>
				</div>

				<Title title="Interactive Map" wrapperClass="xs:mt-80 pb-16 text-center" />
				<div className="mt-2 rounded-2xl border-3 border-yellow-500 w-full max-w-5xl px-2">
					<div className="flex w-full justify-end">
						<div className="flex">
							<p className="text-xl md:text-2xl font-serif text-green-900">Click on markers</p>
							<span className="text-xl md:text-2xl font-serif !text-red-600">*</span>
						</div>
					</div>
					<MapCard
						center={MAP_CENTER}
						zoom={17}
						markerTitle="YDH Coffee Estate"
						// className="h-[360px] md:h-[460px]" // optional responsive height
						className="h-[260px]" // optional responsive height
						perimeter={MAP_PERIMETER}
						markers={MAP_MARKERS}
					/>
				</div>
				<section>
					<div className="relative z-[40]">
						{/* page-wide dimmer that appears when any card is hovered */}
						<div
							onClick={() => setHoveredIdx(null)}
							className={[
								'fixed inset-0 overflow-x-hidden bg-black/45 backdrop-blur-[1px]',
								'transition-opacity duration-500',
								hoveredIdx !== null ? 'z-30 opacity-100' : '-z-10 opacity-0',
								// allow taps only when visible; block when hidden
								hoveredIdx !== null ? 'pointer-events-auto' : 'pointer-events-none',
							].join(' ')}
						/>
						<div className="flex flex-col items-center px-4 pt-24">
							<Title title="Our Products" wrapperClass="text-center" />

							<div className="relative flex flex-col gap-5 pt-10 md:flex-row md:gap-10 ">
								<ProductCard
									idx="01"
									title="Coffee Farming"
									// src="/images/coffeeFarm.jpg"
									src={COFFEE_FARM_IMAGE_URL}
									active={hoveredIdx === 0}
									onHoverChange={(h) => setHoveredIdx(h ? 0 : null)}
									href="/products/coffee"
								/>
								<ProductCard
									idx="02"
									title="Beekeeping"
									// src="/images/hive.jpg"
									src={HIVE_IMAGE_URL}
									active={hoveredIdx === 1}
									onHoverChange={(h) => setHoveredIdx(h ? 1 : null)}
									wrapperClass="md:-mt-5"
									href="/products/honey"
								/>
								<ProductCard
									idx="03"
									title="Misc Products"
									// src="/images/avocado.jpg"
									src={AVOCADO_IMAGE_URL}
									active={hoveredIdx === 2}
									onHoverChange={(h) => setHoveredIdx(h ? 2 : null)}
									href="/shop?c=more"
								/>
							</div>
						</div>
					</div>
				</section>
				<div className="xs:h-[900px] flex h-[800px] w-full justify-center overflow-x-hidden overflow-y-clip xs:mt-20">
					<BlobTextNoSSR
						title="We'd love to hear from you..."
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
						style="contact-us"
						heading="Contact Us"
						className="flex w-full justify-center"
						staticId="contact-us-blob" // ensure a fixed ID is passed
					/>
				</div>
			</section>
		</section>
	);
};

export default Landing;

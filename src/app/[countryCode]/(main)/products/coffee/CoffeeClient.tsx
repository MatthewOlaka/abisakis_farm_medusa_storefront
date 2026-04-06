'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import useParallax from '@lib/hooks/useParallax';
import CurvyScrollPipe from '@modules/common/components/curvy-scroll-pipe';
import ExploreProductsBanner from '@modules/common/components/explore-products-banner';
import ImageCarousel from '@modules/common/components/image-carousel';
import { useHomeIntro } from '@modules/layout/components/home-intro';
import TimelineText from '@modules/common/components/timeline-text';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import ScrollDownIndicator from '@modules/common/components/scroll-down-indicator';
import { CHERRY_IMAGE_URL, COFFEE_BAG_2_IMAGE_URL, COFFEE_BEAN_IMAGE_URL, COFFEE_MUG_IMAGE_URL, ROASTED_BEANS_IMAGE_URL } from '@lib/constants';

const STAGE_1_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/steps/coffee-stage1.jpg';
const STAGE_2_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/steps/coffee-stage2.jpg';
const STAGE_3_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/steps/coffee-stage3.jpg';
// const STAGE_4_IMAGE_URL =
// 	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/steps/coffee-stage4.jpg';
const STAGE_4_IMAGE_URL =
	'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/steps/coffee-stage4v3.jpg';

const COFFEE_INTRO_IMAGE_IDS = [
	'coffee-title-cherry',
	'coffee-title-beans',
	'coffee-mug',
	'coffee-bag',
] as const;

const slides = [
	{
		name: 'Selective Picking',
		description:
			'Only fully ripe cherries are picked by hand during harvest. Careful selection ensures balanced sweetness and quality. Each pass through the trees focuses on maturity, protecting flavor and preserving the character of every coffee lot.',
		src: 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/slideshow/selectivePicking.jpg',
	},
	{
		name: 'Healthy Coffee Trees',
		description:
			'Strong coffee begins with healthy plants. We monitor soil conditions, prune trees, and manage pests responsibly to protect growth. Regular field care supports resilient plants, consistent yields, and cherries that develop deeper flavor.',
		src: 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/slideshow/healthyTree.jpeg',
	},
	{
		name: 'Careful Pulping',
		description:
			'After harvest, cherries are pulped to separate the beans from fruit. Timing matters here. Gentle handling prevents damage and prepares the beans for fermentation while preserving the natural qualities developed on the tree.',
		src: 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/slideshow/carefulPulping.jpg',
	},
	{
		name: 'Slow Drying Beds',
		description:
			'Beans dry slowly on raised beds where airflow and sunlight work together. Regular turning ensures even drying and prevents spoilage. This patient process helps stabilize the beans and lock in their natural flavors.',
		src: 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/slideshow/dryingBed.jpg',
	},
	{
		name: 'Thoughtful Processing',
		description:
			'Processing methods vary depending on the variety and desired profile. Some coffees are washed, others natural or fermented. Each method highlights different characteristics, allowing the beans to express their unique flavors.',
		src: 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/slideshow/processing.jpg',
	},
	{
		name: 'Protected Storage',
		description:
			'Once dried, coffee is stored carefully in clean, ventilated spaces. Proper storage protects the beans from moisture, pests, and damage while allowing them to rest before roasting and preparation for export or brewing.',
		src: 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/slideshow/storage.jpg',
	},
	{
		name: 'Plant Care & Maintenance',
		description:
			'Healthy coffee requires constant care. Our team monitors plant health and occasionally applies safe, approved treatments that protect the trees from pests and disease. These gentle measures help the plants thrive and produce strong, flavorful cherries.',
		src: 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/slideshow/plantCare.jpg',
	},
];

const varieties = [
	{
		title: 'Washed Process',
		description:
			'Cherries are pulped and carefully washed before drying, producing a clean, vibrant cup with bright acidity, delicate floral aromas, and a crisp finish that highlights the bean’s natural clarity.',
		src: 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/varieties/washed.jpg',
		height: 260,
		tag: 'Signature',
	},
	{
		title: 'Honey Process',
		description:
			'Partially pulped beans dry with sticky mucilage intact, creating natural sweetness, smooth body, and gentle fruit notes while preserving the balance between bright acidity and rich caramel-like depth.',
		src: 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/varieties/honies.jpg',
		height: 240,
		tag: 'Estate lot',
	},
	{
		title: 'Natural Process',
		description:
			'Whole cherries dry slowly under the sun on raised beds, allowing the beans to absorb fruit sugars and develop bold berry notes, heavier body, and a rounded sweetness.',
		src: 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/varieties/natural.jpg',
		height: 220,
		tag: 'Single origin',
	},
	{
		title: 'Anaerobic Fermentation',
		description:
			'Cherries ferment in sealed tanks without oxygen, creating complex flavors, deep fruit notes, and layered sweetness while enhancing aroma and body through controlled fermentation.',
		src: 'https://devhzevghepeeyjlabdc.supabase.co/storage/v1/object/public/public-site/coffee/varieties/anaerobic.jpg',
		height: 240,
		tag: 'Micro-lot',
	},
];

export default function CoffeeClient({ featured }: { featured: React.ReactNode }) {
	const { isActive: isIntroActive, markReady } = useHomeIntro();
	const bagWrapRef = useRef<HTMLDivElement | null>(null);
	const mugWrapRef = useRef<HTMLDivElement | null>(null);
	const bean1WrapRef = useRef<HTMLDivElement | null>(null);
	const bean2WrapRef = useRef<HTMLDivElement | null>(null);
	const scopeRef = useRef<HTMLElement | null>(null);
	const varietyStripRef = useRef<HTMLDivElement | null>(null);
	const varietyStepRef = useRef<number>(0);
	const varietyWheelLockRef = useRef(false);
	const [canPrevVariety, setCanPrevVariety] = useState(false);
	const [canNextVariety, setCanNextVariety] = useState(true);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const introAssetsLoadedRef = useRef<Set<string>>(new Set());
	const introRevealQueuedRef = useRef(false);
	const markReadyRef = useRef(markReady);

	const pipeStarted = useRef(false);

	useParallax(scopeRef, { selector: '[data-speed]', axis: 'y' });

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

	const settleIntroAsset = (assetId: (typeof COFFEE_INTRO_IMAGE_IDS)[number]) => {
		if (!isIntroActive || introRevealQueuedRef.current) return;

		introAssetsLoadedRef.current.add(assetId);
		if (introAssetsLoadedRef.current.size !== COFFEE_INTRO_IMAGE_IDS.length) return;

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
		const mediaQuery = window.matchMedia('(max-width: 479px)');
		const updateViewport = () => setIsSmallScreen(mediaQuery.matches);

		updateViewport();
		mediaQuery.addEventListener('change', updateViewport);

		return () => {
			mediaQuery.removeEventListener('change', updateViewport);
		};
	}, []);

	const scrollVarieties = useCallback((dir: 'left' | 'right', opts?: { lock?: boolean }) => {
		const el = varietyStripRef.current;
		if (!el) return;
		const step = varietyStepRef.current || el.clientWidth * 0.72;
		// Snap current position to the nearest step, then move exactly one step
		const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
		const currentIndex = Math.round(el.scrollLeft / step);
		const nextIndex =
			dir === 'left'
				? Math.max(0, currentIndex - 1)
				: Math.min(Math.round(maxScroll / step), currentIndex + 1);
		const target = Math.min(maxScroll, Math.max(0, nextIndex * step));

		if (opts?.lock) {
			varietyWheelLockRef.current = true;
			window.setTimeout(() => {
				varietyWheelLockRef.current = false;
			}, 420);
		}

		el.scrollTo({ left: target, behavior: 'smooth' });
	}, []);

	useEffect(() => {
		const el = varietyStripRef.current;
		if (!el) return;
		// start at the very beginning so the intro card is fully visible
		el.scrollTo({ left: 0, behavior: 'auto' });

		const setStep = () => {
			const kids = Array.from(el.children).filter(
				(n): n is HTMLElement => n instanceof HTMLElement,
			);
			if (kids.length >= 2) {
				varietyStepRef.current = kids[1].offsetLeft - kids[0].offsetLeft;
			} else if (kids.length === 1) {
				varietyStepRef.current = kids[0].offsetWidth;
			} else {
				varietyStepRef.current = el.clientWidth * 0.72;
			}
		};

		const update = () => {
			const { scrollLeft, scrollWidth, clientWidth } = el;
			setCanPrevVariety(scrollLeft > 6);
			setCanNextVariety(scrollLeft < scrollWidth - clientWidth - 6);
		};

		const onWheel = (e: WheelEvent) => {
			// Only intercept horizontal scroll (trackpads)
			if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
			if (varietyWheelLockRef.current) {
				e.preventDefault();
				return;
			}
			e.preventDefault();
			// Normalize to a single step per gesture
			const dir: 'left' | 'right' = e.deltaX > 0 ? 'right' : 'left';
			scrollVarieties(dir, { lock: true });
		};

		const onResize = () => {
			setStep();
			update();
		};

		setStep();
		update();
		el.addEventListener('scroll', update, { passive: true });
		el.addEventListener('wheel', onWheel, { passive: false });
		window.addEventListener('resize', onResize);
		return () => {
			el.removeEventListener('scroll', update);
			el.removeEventListener('wheel', onWheel);
			window.removeEventListener('resize', onResize);
		};
	}, [scrollVarieties]);

	useLayoutEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		if (
			!bagWrapRef.current ||
			!mugWrapRef.current ||
			!bean1WrapRef.current ||
			!bean2WrapRef.current
		)
			return;

		const mm = gsap.matchMedia();
		const povTweens: gsap.core.Tween[] = [];
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		mm.add('(max-width: 479px)', () => {
			gsap.set(bagWrapRef.current, {
				rotation: 0,
				rotateX: 0,
				x: 0,
				y: 0,
				scale: 1,
				transformOrigin: '50% 85%',
				transformPerspective: 800,
				force3D: true,
				z: 0.01,
				willChange: 'transform',
			});

			const tl2 = gsap.timeline({
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

			tl2.to(bagWrapRef.current, {
				y: () => window.innerHeight * 0.7,
				rotation: 0,
				rotateX: 0,
				x: 0,
				scale: 1.3,
				duration: 0.8,
			});

			return () => {
				tl2?.scrollTrigger?.kill();
				tl2?.kill();
			};
		});

		mm.add('(min-width: 480px)', () => {
			gsap.set(mugWrapRef.current, {
				rotation: 0,
				rotateX: 0,
				x: -30,
				y: 0,
				scale: 1,
				transformOrigin: '50% 85%',
				transformPerspective: 800,
				force3D: true,
				z: 0.01,
				willChange: 'transform',
			});
			gsap.set(bagWrapRef.current, {
				rotation: -60,
				rotateX: 10,
				x: 200,
				y: 0,
				scale: 1,
				transformOrigin: '50% 85%',
				transformPerspective: 800,
				force3D: true,
				z: 0.01,
				willChange: 'transform',
			});
			gsap.set(bean1WrapRef.current, {
				rotation: 0,
				rotateX: 0,
				x: -40,
				y: '3vh',
				scale: 1,
				transformOrigin: '50% 85%',
				transformPerspective: 800,
				force3D: true,
				z: 0.01,
				willChange: 'transform',
			});
			gsap.set(bean2WrapRef.current, {
				rotation: 160,
				rotateX: 0,
				x: -45,
				y: '1vh',
				scale: 1,
				transformOrigin: '50% 85%',
				transformPerspective: 800,
				force3D: true,
				z: 0.01,
				willChange: 'transform',
			});

			if (mugWrapRef.current) {
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

				tl.add('sync', 0)
					.to(
						bagWrapRef.current,
						{
							y: () => window.innerHeight * 0.4,
							rotation: -110,
							rotateX: 0,
							x: 300,
							scale: 1.1,
							duration: 0.8,
						},
						'sync',
					)
					.to(
						mugWrapRef.current,
						{
							y: () => window.innerHeight * 0.7,
							rotation: 0,
							rotateX: 0,
							x: 0,
							scale: 1.2,
							duration: 0.8,
						},
						'sync',
					)
					.to(
						bean1WrapRef.current,
						{
							y: () => window.innerHeight * 0.85,
							rotation: -300,
							rotateX: 0,
							x: -40,
							scale: 1.2,
							duration: 1,
						},
						'sync',
					)
					.to(
						bean2WrapRef.current,
						{
							y: () => window.innerHeight * 0.8,
							rotation: -200,
							rotateX: 0,
							x: -50,
							scale: 1.1,
							duration: 1,
						},
						'sync',
					);
				return () => {
					tl?.scrollTrigger?.kill();
					tl?.kill();
				};
			}
		});

		if (!prefersReducedMotion) {
			const povImages = Array.from(
				scopeRef.current?.querySelectorAll<HTMLElement>('[data-pov-image]') ?? [],
			);

			if (povImages.length > 0) {
				gsap.set(povImages, {
					autoAlpha: 0,
					y: 24,
					willChange: 'transform, opacity',
				});

				povImages.forEach((povImage) => {
					const tween = gsap.to(povImage, {
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

					povTweens.push(tween);
				});
			}
		}

		return () => {
			mm.revert();
			povTweens.forEach((tween) => {
				tween.scrollTrigger?.kill();
				tween.kill();
			});
		};
	}, []);

	return (
		<section ref={scopeRef} className="mx-auto flex w-full max-w-7xl flex-col justify-center py-5">
			<div className="px-5">
				<div className="xs:h-[200px] mx-auto flex h-[150px] w-full max-w-4xl items-center justify-center rounded-2xl bg-green-900 px-5 text-center">
					<div className="relative flex h-full w-full max-w-[750px]">
						<div className="flex items-start">
							<div className="absolute top-2 h-10 w-10 items-end md:h-15 md:w-15">
								<Image
									// src="/images/cherry.png"
									src={CHERRY_IMAGE_URL}
									alt="Cherry"
									fill
									priority
									sizes="(max-width: 768px) 40px, 60px"
									className="object-cover"
									onLoad={() => settleIntroAsset('coffee-title-cherry')}
									onError={(e) => {
										(e.target as HTMLImageElement).style.display = 'none';
										settleIntroAsset('coffee-title-cherry');
									}}
								/>
							</div>
						</div>
						<h1 className="xs:text-8xl xs:-top-0 text-yellow-500 z-50 m-auto w-full text-center font-serif text-[60px] leading-0 font-bold whitespace-nowrap md:text-9xl">
							Our Coffee
						</h1>
						<div className="flex items-end">
							<div className="relative top-2 -ml-10 h-20 w-20 items-end md:h-25 md:w-30">
								<Image
									// src="/images/roastedBeans.png"
									src={ROASTED_BEANS_IMAGE_URL}
									alt="Roasted beans"
									fill
									priority
									sizes="(max-width: 768px) 80px, 120px"
									className="object-cover"
									onLoad={() => settleIntroAsset('coffee-title-beans')}
									onError={(e) => {
										(e.target as HTMLImageElement).style.display = 'none';
										settleIntroAsset('coffee-title-beans');
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="relative">
				<div className="absolute scale-75 md:scale-100 mt-[50vh] xs:mt-[40vh] left-1/2 -translate-x-1/2">
					<ScrollDownIndicator className="mx-auto mt-8 sm:mt-10" />
				</div>
				<div className="absolute left-1/2 z-1 mt-[40vh] md:mt-[55vh] w-full -translate-x-1/2 text-center">
					<h1 className="xs:text-5xl font-serif text-4xl text-green-900 md:text-6xl">
						&ldquo;From our farm,
					</h1>
					<h1 className="xs:text-5xl font-serif text-4xl font-bold text-yellow-500 md:text-6xl">
						straight to your cup&rdquo;
					</h1>
				</div>
			</div>
			<div className="relative flex justify-center overflow-x-clip overflow-y-visible">
				<div
					ref={mugWrapRef}
					className="xs:block xs:h-72 xs:mt-40 absolute z-10 -mt-10 hidden h-96 w-full [transform:translateZ(0)] overflow-x-hidden overflow-y-visible will-change-transform [backface-visibility:hidden]"
				>
					<Image
						// src="/images/coffeeMug.png"
						src={COFFEE_MUG_IMAGE_URL}
						alt="Coffee Mug"
						fill
						priority
						sizes="(max-width: 768px) 100vw, 896px"
						className="object-contain"
						onLoad={() => settleIntroAsset('coffee-mug')}
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = 'none';
							settleIntroAsset('coffee-mug');
						}}
					/>
				</div>
				<div
					ref={bean1WrapRef}
					className="xs:block absolute z-30 hidden h-5 w-full [transform:translateZ(0)] overflow-x-hidden overflow-y-visible grayscale-25 will-change-transform [backface-visibility:hidden]"
				>
					<div className="relative h-full w-full">
						<Image
							// src="/images/coffeeBean.png"
							src={COFFEE_BEAN_IMAGE_URL}
							alt="Coffee Bean 1"
							fill
							loading="lazy"
							sizes="24px"
							className="object-contain"
							onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
						/>
					</div>
				</div>
				<div
					ref={bean2WrapRef}
					className="xs:block absolute ml-2 hidden h-5 w-full [transform:translateZ(0)] overflow-x-hidden overflow-y-visible grayscale-25 will-change-transform [backface-visibility:hidden]"
				>
					<div className="relative h-full w-full">
						<Image
							// src="/images/coffeeBean.png"
							src={COFFEE_BEAN_IMAGE_URL}
							alt="Coffee Bean 2"
							fill
							loading="lazy"
							sizes="24px"
							className="object-contain"
							onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
						/>
					</div>
				</div>
				<div
					ref={bagWrapRef}
					className="xs:h-[480px] xs:-mt-56 xs:ml-32 absolute z-10 -mt-20 h-96 w-full [transform:translateZ(0)] overflow-x-hidden overflow-y-visible will-change-transform [backface-visibility:hidden]"
				>
					<Image
						// src="/images/YDcoffeeBag2.png"
						src={COFFEE_BAG_2_IMAGE_URL}
						alt="Open Coffee Bag"
						fill
						priority
						sizes="(max-width: 768px) 100vw, 896px"
						className="object-contain"
						onLoad={() => settleIntroAsset('coffee-bag')}
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = 'none';
							settleIntroAsset('coffee-bag');
						}}
					/>
				</div>
			</div>
			<div data-speed="0.2" className="absolute -mt-[3600px] ml-60 h-10 w-10 md:h-14 md:w-14">
				<Image
					// src="/images/cherry.png"
					src={CHERRY_IMAGE_URL}
					alt="Cherry 1"
					fill
					loading="lazy"
					sizes="(max-width: 768px) 40px, 56px"
					className="object-contain"
					onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
				/>
			</div>
			<div
				data-speed="0.3"
				className="absolute right-60 -mt-[3200px] h-10 w-10 md:h-13 md:w-13 2xl:right-1/3"
			>
				<Image
					// src="/images/cherry.png"
					src={CHERRY_IMAGE_URL}
					alt="Cherry 2"
					fill
					loading="lazy"
					sizes="(max-width: 768px) 40px, 52px"
					className="object-contain"
					onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
				/>
			</div>
			{/* Content sections */}
			{/* <div className="relative top-[65vh] md:top-[80vh]"> */}
			<div className="mt-[70vh]">
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
				<div
					data-pov-image
					className="md:block hidden h-72 w-52 xl:h-80 xl:w-60 absolute z-50 rotate-3 mt-[95vh] ml-64 lg:ml-96 left-1/2 -translate-x-1/2"
				>
					<Image
						src={STAGE_2_IMAGE_URL}
						alt="POV"
						fill
						loading="lazy"
						sizes="240px"
						className="rounded-sm object-cover"
						onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
					/>
				</div>
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
				<div
					data-pov-image
					className="md:block hidden h-72 w-52 xl:h-80 xl:w-60 absolute z-50 rotate-3 mt-[165vh] ml-64 lg:ml-96 left-1/2 -translate-x-1/2"
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
				{/* <TimelineText
					idx="01"
					title="Nurture the bees"
					description="Our hives are cared for with patience and respect. Bees are part of the land, not just workers, and we ensure they thrive naturally."
					className="xs:mt-[62vh] xs:ml-20 left-1/2 mt-[65vh] -translate-x-1/2"
				/> */}
				<TimelineText
					idx="01"
					title="Grow with purpose"
					description="Our land offers cool air, rich soil, and steady rains. We give each crop the time it needs, because strong roots and careful tending are where great flavour begins."
					className="xs:mt-[62vh] xs:ml-20 left-1/2 mt-[58vh] ml-8 -translate-x-1/2"
				/>
				<TimelineText
					idx="02"
					title="Harvest Carefully"
					description="We pick only when nature says it’s time. Each fruit is selected with care, ensuring ripeness, quality, and respect for the work that brought it this far."
					className="xs:mt-[98vh] xs:-ml-20 left-1/2 mt-[90vh] -ml-8 -translate-x-1/2"
				/>

				<TimelineText
					idx="03"
					title="Process by variety"
					description="How we process depends on the variety. Whether dried, washed, or carefully fermented, each method is chosen to highlight the character and natural profile of the crop."
					className="xs:mt-[132vh] xs:ml-20 left-1/2 mt-[129vh] ml-8 -translate-x-1/2"
				/>
				<TimelineText
					idx="04"
					title="Roast and enjoy"
					description="Every cup reflects the soil, the season, and the hands behind it. It’s meant to be savoured... a reminder that the best things are grown with patience and care."
					className="xs:mt-[169vh] xs:-ml-20 left-1/2 mt-[162vh] -ml-8  -translate-x-1/2"
				/>
				<div className={`overflox-x-hidden ${isSmallScreen ? 'mt-10' : ''}`}>
					<CurvyScrollPipe
						active={true}
						d="M1933.316,1529.3s11.654,118.137,0,123.155c-108.008,46.5-810.076,301.466-810.076,628.968,0,362.28,233.438,486.332,689.425,809.241s913.482,424.424,913.482,842.722-428.06,499.133-913.482,830.468-689.425,446.455-689.425,819.938,689.425,673.992,689.425,673.992,913.482,405.6,913.482,859.809c0,408.791-752.338,839.488-863.839,962.333-84.4,87.522-33.129,388.875-36.129,492.731"
						viewBox="0 0 1603.907 7083.421"
						pathTransform="translate(-1122.74 -1529.252)"
						strokeWidth={isSmallScreen ? 22 : 25}
						strokeLinecap="round"
						startColor="#bb0f0f"
						endColor="#2E5604"
						trackColor="#BECFAD"
						minHeightVh={isSmallScreen ? 240 : 260}
						svgHeightVh={160}
						preserveAspect="xMidYMin meet"
						dialLead={15}
					/>
				</div>
			</div>
			{/* <div className="xs:mt-72 relative mt-[480px] h-full overflow-hidden"> */}
			<div className="relative h-full overflow-hidden -mt-56 xs:-mt-96">
				<ImageCarousel title="Our Techniques" slides={slides} />
			</div>

			{/* Varieties scroller (Tillamook-style horizontal strip) */}
			<section className="mt-20 w-full px-5">
				<div className="mx-auto max-w-7xl">
					<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-900/70">
								Varieties
							</p>
							<h3 className="mt-1 font-serif text-3xl font-bold text-green-900 md:text-4xl">
								Get the full scoop on our lots
							</h3>
						</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => scrollVarieties('left')}
								aria-label="Scroll varieties left"
								className={`flex h-12 w-12 items-center justify-center rounded-full bg-green-900/80 text-2xl text-white shadow-lg transition hover:scale-110 hover:bg-green-900 ${canPrevVariety ? '' : 'pointer-events-none opacity-30'}`}
							>
								‹
							</button>
							<button
								type="button"
								onClick={() => scrollVarieties('right')}
								aria-label="Scroll varieties right"
								className={`flex h-12 w-12 items-center justify-center rounded-full bg-green-900/80 text-2xl text-white shadow-lg transition hover:scale-110 hover:bg-green-900 ${canNextVariety ? '' : 'pointer-events-none opacity-30'}`}
							>
								›
							</button>
						</div>
					</div>

					<div className="relative">
						<div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 hidden w-14 bg-gradient-to-r from-white to-transparent sm:block" />
						<div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 hidden w-14 bg-gradient-to-l from-white to-transparent sm:block" />

						<div
							ref={varietyStripRef}
							className="flex gap-5 overflow-x-auto scroll-smooth px-1 pb-6 pt-2 [scroll-snap-type:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
						>
							<article className="sticky mt-5 left-0 z-10 flex shrink-0 items-stretch self-stretch bg-transparent pr-6">
								<div className="relative w-[240px] rounded-xl bg-yellow-200 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.08)] backdrop-blur sm:w-[260px]">
									<p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-900/70">
										Discover
									</p>
									<h4 className="mt-2 font-serif text-2xl font-bold leading-tight text-green-900">
										Scroll through our current varieties
									</h4>
									<p className="mt-3 text-sm leading-relaxed text-green-900/80">
										Start scrolling or tap the arrows. Short dive into our coffee varieties and their processes.
									</p>
								</div>
							</article>
							{varieties.map((v, idx) => (
								<article
									key={idx}
									className="z-20 mt-5 flex shrink-0 w-[240px] flex-col overflow-hidden rounded-xl bg-yellow-100 transition-transform duration-300 hover:-translate-y-5 sm:w-[260px]"
									// className="z-20 flex shrink-0 w-[240px] flex-col overflow-hidden rounded-xl bg-yellow-100 shadow-[0_12px_35px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-1 sm:w-[260px]"
								>
									<div
										className="relative w-full overflow-hidden bg-yellow-100 rounded-b-xl"
										style={{ height: `${v.height}px` }}
									>
										<Image
											src={v.src}
											alt={v.title}
											fill
											sizes="260px"
											className="object-cover"
											priority={idx === 0}
										/>
									</div>
									<div className="flex flex-col gap-2 px-4 py-4">
										<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-900/70">
											{v.tag}
										</p>
										<h5 className="font-serif text-xl font-bold text-green-900">{v.title}</h5>
										<p className="text-sm leading-relaxed text-green-900/80">{v.description}</p>
									</div>
								</article>
							))}
						</div>
					</div>
				</div>
			</section>

			{featured}

			<div className="overflox-x-hidden xs:py-52 flex w-full justify-center px-10 py-28">
				<ExploreProductsBanner />
			</div>
		</section>
	);
}

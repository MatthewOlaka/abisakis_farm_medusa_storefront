'use client';

import useParallax from '@lib/hooks/useParallax';
import BlobText from '@modules/common/components/blob-text';
import MapCard from '@modules/common/components/map-card';
import ProductCard from '@modules/common/components/product-card';
import Title from '@modules/common/components/title';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';

// Disable SSR for BlobText to avoid hydration mismatches.
const BlobTextNoSSR = dynamic(() => import('@modules/common/components/blob-text'), {
	ssr: false,
});

const MAP_CENTER = { lat: 0.9941949, lng: 35.1327557 };
const MAP_PERIMETER = [
	{ lat: 0.9966, lng: 35.1323 },
	{ lat: 0.997, lng: 35.1337 },
	{ lat: 0.9918, lng: 35.1339 },
	{ lat: 0.9915, lng: 35.1312 },
];
const MAP_MARKERS = [
	{
		title: 'Bee hives',
		position: { lat: 0.996162, lng: 35.132909 },
		description: '50 colonized bee hives',
		imageSrc: '/images/YDcoffeeBag2.png',
	},
	{
		title: 'Cluster 1',
		position: { lat: 0.995779, lng: 35.132868 },
		description: 'Processing, roasting',
		imageSrc: '/images/YDcoffeeBag2.png',
	},
	{
		title: 'Factory',
		position: { lat: 0.994905, lng: 35.13232 },
		description: 'Processing, roasting, and packaging hub.',
		imageSrc: '/images/YDcoffeeBag2.png',
	},
	{
		title: 'Poultry housing',
		position: { lat: 0.994767, lng: 35.13215 },
		description: 'Processing, roasting, and packaging hub.',
		imageSrc: '/images/YDcoffeeBag2.png',
	},
	{
		title: 'Villa',
		position: { lat: 0.995179, lng: 35.132842 },
		description: 'Processing, roasting, and packaging hub.',
		imageSrc: '/images/YDcoffeeBag2.png',
	},
	{
		title: 'Avocado trees',
		position: { lat: 0.9947, lng: 35.132845 },
		description: 'Processing, roasting, and packaging hub.',
		imageSrc: '/images/YDcoffeeBag2.png',
	},
	{
		title: 'Cluster 2',
		position: { lat: 0.995274, lng: 35.133355 },
		description: 'Processing, roasting, and packaging hub.',
		imageSrc: '/images/YDcoffeeBag2.png',
	},
	{
		title: 'Cluster 3',
		position: { lat: 0.993779, lng: 35.132706 },
		description: 'Processing, roasting, and packaging hub.',
		imageSrc: '/images/YDcoffeeBag2.png',
	},
	{
		title: 'Cluster 4',
		position: { lat: 0.992103, lng: 35.132579 },
		description: 'Processing, roasting, and packaging hub.',
		imageSrc: '/images/YDcoffeeBag2.png',
	},
];

// export default function Landing() {
const Landing = () => {
	const router = useRouter();
	const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

	const sectionRef = useRef<HTMLDivElement | null>(null);
	const contentSectionRef = useRef<HTMLDivElement | null>(null);
	const wrapRef = useRef<HTMLDivElement | null>(null); // animated width/scale/y
	//TODO: is imgRef needed?
	const imgRef = useRef<HTMLImageElement | null>(null); // animate brightness
	const overlayRef = useRef<HTMLDivElement | null>(null); // fades in later
	const ctaRef = useRef<HTMLDivElement | null>(null); // CTA fades in later
	const heroText1Ref = useRef<HTMLDivElement | null>(null); // text above the hero
	const heroText1MobileRef = useRef<HTMLDivElement | null>(null); // text above the hero (mobile)
	const heroText2Ref = useRef<HTMLDivElement | null>(null); // text inside the image
	const stickyRef = useRef<HTMLDivElement | null>(null);
	const pathRef = useRef<SVGPathElement | null>(null);
	const mapSectionRef = useRef<HTMLDivElement | null>(null);
	const flagSvgRef = useRef<SVGSVGElement | null>(null);

	// helpers
	const vhPx = (n: number) => () => window.innerHeight * (n / 100);
	// return a proper "+=<number>" string (not "+=" + function)
	const vhAdd = (n: number) => () => `+=${window.innerHeight * (n / 100)}`;
	// recompute end each refresh in absolute page pixels
	const preEnd = () => (sectionRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;

	useParallax(contentSectionRef, { selector: '[data-speed]', axis: 'y' });

	useLayoutEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const ctx = gsap.context(() => {
			const mm = gsap.matchMedia();
			// let drawTl: GSAPTimeline | null = null; // keep your map timeline var

			// --- MOBILE: snap straight to final ---
			mm.add('(max-width: 767px)', () => {
				if (
					!wrapRef.current ||
					!overlayRef.current ||
					!ctaRef.current ||
					!heroText1Ref.current ||
					!heroText2Ref.current
				)
					return;

				gsap.set(wrapRef.current, {
					// keep width fixed; transforms only
					scale: 1,
					y: 0,
					xPercent: 0,
					transformPerspective: 800,
					force3D: true,
					z: 0.01,
					willChange: 'transform',
				});
				gsap.set(overlayRef.current, { opacity: 0.45 });
				gsap.set(ctaRef.current, { opacity: 1, y: 0, pointerEvents: 'auto' });
				gsap.set(heroText1Ref.current, { autoAlpha: 0 });
				gsap.set(heroText1MobileRef.current, { opacity: 0 });
				gsap.set(heroText2Ref.current, { y: '22vh', opacity: 1 });
			});

			// --- DESKTOP: smooth pinned scene ---
			mm.add('(min-width: 768px)', () => {
				if (
					!sectionRef.current ||
					!wrapRef.current ||
					!overlayRef.current ||
					!ctaRef.current ||
					!heroText1Ref.current ||
					!heroText2Ref.current
				)
					return;

				// Initial states
				gsap.set(wrapRef.current, {
					// Keep width static (100vw via CSS). Animate only transforms.
					scale: 0.75,
					y: 0,
					xPercent: 0,
					transformOrigin: '50% 50%',
					transformPerspective: 800,
					force3D: true,
					z: 0.01,
					willChange: 'transform',
				});
				gsap.set(overlayRef.current, { opacity: 0 });
				gsap.set(ctaRef.current, { opacity: 0, y: 24, pointerEvents: 'none' });
				gsap.set(heroText1Ref.current, {
					y: 0,
					opacity: 1,
					willChange: 'transform',
				});
				const INSIDE_START_Y_VH = -28.5;
				gsap.set(heroText2Ref.current, {
					y: `${INSIDE_START_Y_VH}vh`,
					opacity: 1,
				});

				// Initial states (add xPercent so GSAP keeps the horizontal centering)
				gsap.set(heroText1Ref.current, { y: 0, xPercent: -50, opacity: 1 });
				gsap.set(heroText2Ref.current, {
					y: `${INSIDE_START_Y_VH}vh`,
					opacity: 1,
				});

				// PRE-TIMELINE: move both texts down before the hero pins
				const pre = gsap.timeline({
					scrollTrigger: {
						trigger: document.documentElement,
						start: 'top top',
						end: preEnd, // <— function, recalculated on refresh
						scrub: 0.6,
						fastScrollEnd: true,
						invalidateOnRefresh: true,
						// markers: true,            // uncomment to debug
					},
					defaults: { ease: 'none' },
				});

				// IMPORTANT: use a function that returns a valid value (number or "+=<num>")
				pre.to([heroText1Ref.current, heroText2Ref.current], { y: vhAdd(50) }, 0);

				// MAIN PINNED SCENE
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: sectionRef.current,
						start: 'top top',
						end: '+=20%',
						pin: true,
						pinSpacing: true,
						scrub: 0.6,
						anticipatePin: 1,
						fastScrollEnd: true,
						invalidateOnRefresh: true,
					},
					defaults: { ease: 'none' },
				});

				tl.to(heroText1Ref.current, { y: vhPx(22) }, 0)
					// .to(heroText2Ref.current, { y: vhPx(22) }, 0)
					.set(heroText1Ref.current, { autoAlpha: 0 }, 0.95)
					.to(wrapRef.current, { scale: 1, y: 0 }, 0)
					.to(overlayRef.current, { opacity: 0.6, duration: 0.4 }, 0)
					.to(heroText1Ref.current, { opacity: 0 }, 1)
					// .to(heroText1MobileRef.current, { opacity: 0, duration: 0.3 }, 0)
					.to(
						ctaRef.current,
						{
							opacity: 1,
							y: 0,
							pointerEvents: 'auto',
							duration: 0.45,
							ease: 'power2.out',
						},
						0,
					);

				return () => {
					tl.scrollTrigger?.kill();
					tl.kill();
					pre.scrollTrigger?.kill();
					pre.kill();
				};
			});

			// Your map draw timeline can stay (or leave as you had it)
			if (mapSectionRef.current && stickyRef.current && pathRef.current) {
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
							trigger: mapSectionRef.current,
							start: 'top 50%',
							end: '+=180%',
							scrub: 0.6,
						},
						defaults: { ease: 'none' },
					})
					.to(pathRef.current, { strokeDashoffset: 0, duration: 0.75 }, 0)
					.to(flagSvgRef.current, { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.75)
					.to(pathRef.current, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0.75);

				ScrollTrigger.create({
					trigger: stickyRef.current,
					start: 'top top',
					end: '+=100%',
					pin: true,
					pinSpacing: false,
				});
			}

			ScrollTrigger.refresh();
		});

		return () => {
			ctx.revert();
		};
	}, []);

	// const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
	// 	e.preventDefault();
	// 	const form = new FormData(e.currentTarget);
	// 	const email = form.get('email') as string;
	// 	console.log('subscribe:', email);
	// };

	return (
		<section className="overflow-x-hidden">
			{/* <div className="h-60 w-full bg-amber-500"></div> */}
			<div className="h-0 w-full md:h-60"></div>
			<div
				ref={heroText1Ref}
				className="pointer-events-none fixed top-20 left-1/2 z-10 hidden w-[250px] -translate-x-1/2 pt-12 text-center select-none md:ml-2 md:block md:w-[480px]"
			>
				<h1 className="font-sans text-sm text-green-900 md:text-xl">Where soil meets the soul</h1>
				<h2 className="mt-2 font-serif text-5xl font-bold text-green-900 md:text-6xl">
					Nurturing life <br /> with every season
				</h2>
			</div>

			{/* Pinned hero area */}
			<div ref={sectionRef} className="relative z-[100]">
				<div className="relative h-[110vh] w-screen overflow-hidden">
					{/* Animated wrapper: starts narrow, centers, then fills 100vw */}
					{/* <div
						ref={wrapRef}
						className="relative mx-auto h-[110vh]"
						style={{ willChange: 'transform,width' }}
					> */}
					<div
						ref={wrapRef}
						className="relative mx-auto h-[110vh] w-screen"
						style={{
							willChange: 'transform',
							transform: 'translateZ(0)',
							backfaceVisibility: 'hidden',
							contain: 'paint', // isolates paints to this box
						}}
					>
						<div className="pointer-events-none absolute inset-0 z-[115] overflow-hidden">
							{/* Start this just above the image; we animate its y */}
							<div
								ref={heroText2Ref}
								className="absolute top-0 z-20 -mt-18 w-full items-center justify-center text-center select-none md:-mt-0"
							>
								<h1 className="font-sans text-sm text-white text-shadow-lg/30 md:text-2xl">
									Where soul meets the soil
								</h1>
								<h2
									className="font-serif text-[52px] leading-15 font-bold tracking-wide text-white text-shadow-lg/30 md:text-[76px] md:leading-none"
									// style={{ WebkitTextStroke: '0.5px black' }}
								>
									Nurturing life <br /> with every season
								</h2>
							</div>
						</div>
						{/* Gradient overlay (fades in via GSAP)
						<div
							ref={overlayRef}
							// className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"
							className="pointer-events-none absolute inset-0 z-[112] bg-black/50"
							aria-hidden
						/> */}
						<Image
							ref={imgRef}
							src="/images/Hero.jpg"
							alt="Hero"
							fill
							sizes="100vw"
							priority
							className="rounded-sm object-cover"
							onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
						/>
						{/* OVERLAY (solid black; opacity controlled only by GSAP) */}
						<div
							ref={overlayRef}
							className="pointer-events-none absolute inset-0 z-[112] bg-black"
							aria-hidden
						/>

						{/* CTA layer (fades in near the end) */}
						<div
							ref={ctaRef}
							className="absolute inset-0 z-[115] flex items-center justify-center pb-16 md:pb-20"
						>
							<button
								onClick={() => router.push('/shop')}
								// className="rounded-sm bg-white/90 px-6 py-3 text-sm text-gray-900 shadow-lg ring-1 ring-black/5 backdrop-blur transition hover:bg-white"
								className="mt-5 w-[20vw] min-w-[250px] rounded-sm border bg-transparent px-6 py-3 font-sans text-sm font-semibold text-white shadow-lg ring-1 ring-black/5 backdrop-blur transition hover:bg-amber-400 hover:text-gray-900"
							>
								SHOP NOW
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Content continues */}
			<section
				ref={contentSectionRef}
				className="z-[100] mx-auto flex max-w-7xl flex-col items-center py-24"
			>
				<div className="xs:min-h-[2150px] h-full w-full overflow-hidden md:min-h-[2500px]">
					<div className="flex w-full justify-end">
						<div className="xs:-mt-[100px] xs:mr-0 xs:h-[450px] xs:w-64 absolute z-50 mt-[550px] mr-0 flex h-[350px] w-full overflow-hidden">
							<Image
								src="/images/editedBranch.png"
								alt="Branch"
								fill
								priority
								className="xs:ml-0 xs:rotate-0 xs:object-cover ml-15 rotate-90 object-contain"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
						<h3 className="z-51 mb-4 ml-5 flex w-full items-start font-serif text-6xl font-semibold text-green-900 md:text-7xl">
							Abisaki&apos;s
							<br />
							philosophy
						</h3>
					</div>
					<div className="xs:min-h-[100px] relative min-h-[610px] w-full justify-center">
						<div className="xs:h-72 xs:w-52 absolute z-50 h-60 w-44 rotate-3 md:mt-20 md:h-[400px] md:w-[300px] xl:ml-16">
							<Image
								src="/images/momLanding.jpg"
								alt="Abisaki"
								fill
								priority
								className="xs:ml-5 ml-10 rounded-sm object-cover"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
						<div
							data-speed="0.1"
							className="xs:scale-50 xs:mt-16 xs:mr-32 absolute top-0 right-0 z-50 mt-[660px] mr-32 h-16 w-16 scale-40"
						>
							<Image
								src="/images/cherry.png"
								alt="Cherry 1"
								fill
								priority
								className="object-cover"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
						<div
							data-speed="0.1"
							className="xs:scale-50 xs:mt-52 xs:mr-20 absolute top-0 right-0 z-50 mt-[720px] mr-10 h-16 w-16 scale-40"
						>
							<Image
								src="/images/cherry.png"
								alt="Cherry 2"
								fill
								priority
								className="object-cover"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
						<div
							data-speed="0.2"
							className="xs:scale-50 xs:mr-36 xs:mb-52 absolute right-0 bottom-0 z-100 mr-20 -mb-96 h-16 w-16 scale-40"
						>
							<Image
								src="/images/cherry.png"
								alt="Cherry 3"
								fill
								priority
								className="object-cover"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
						<div className="flex w-full justify-center md:ml-8">
							<BlobText
								title="A happy environment foster fruitful results"
								description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
								style="left"
								scale="scale-400"
								staticId="blob-philosophy-left"
								className="xs:mt-80 xs:ml-52 mt-60 ml-32 flex w-full justify-center md:mt-96"
							/>
						</div>
					</div>
					<div className="relative flex w-full items-center">
						<div className="flex flex-1 justify-center">
							<BlobText
								title="Lorem ipsum dolor sit amet"
								description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
								style="right"
								// scale="scale-220 md:scale-100"
								// className="mt-40 ml-10 md:mt-0"
								scale="scale-400"
								staticId="blob-story-right"
								className="xs:mt-96 mt-40 ml-20 flex w-full justify-center md:mt-96"
							/>
						</div>
						<div className="xs:mt-10 xs:h-72 xs:w-[350px] absolute right-0 z-50 mt-[800px] flex h-52 w-[250px] -translate-y-1/2 rotate-3 justify-end">
							<Image
								src="/images/finalBasket.png"
								alt="Coffee Basket"
								fill
								priority
								className="rounded-sm object-cover"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
					</div>
					<div className="relative h-170 w-full justify-center">
						<div className="xs:block xs:h-72 xs:w-52 absolute z-50 hidden h-60 w-44 -rotate-3 md:mt-20 md:h-[400px] md:w-[300px] xl:ml-16">
							{/* <div className="absolute z-50 mt-50 ml-16 hidden h-72 w-52 -rotate-3 md:mt-10 md:block"> */}
							<Image
								src="/images/parchmentLanding.jpg"
								alt="Parchment"
								fill
								priority
								className="ml-5 rounded-sm object-cover"
								onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
							/>
						</div>
						<div className="flex w-full justify-center">
							<BlobText
								title="Lorem ipsum dolor sit amet"
								description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
								style="center"
								// scale="scale-200 md:scale-100"
								// className="mt-60 ml-10 md:mt-0"
								scale="scale-400"
								staticId="blob-values-center"
								className="xs:mt-96 xs:ml-52 mt-72 flex w-full justify-center md:mt-[480px]"
							/>
							<div className="xs:left-auto xs:right-0 absolute right-0 bottom-0 left-5 z-50 h-52 w-52 md:h-72 md:w-72">
								<Image
									src="/images/flower.png"
									alt="Flower"
									fill
									priority
									className="xs:mt-32 xs:scale-x-100 -scale-x-100 transform object-cover md:mt-72"
									onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
								/>
							</div>
							<div className="motion-safe:animate-levitate xs:left-auto xs:right-0 xs:h-15 xs:w-16 absolute right-0 bottom-0 left-5 z-50 h-10 w-10 scale-x-[-1] will-change-transform">
								<Image
									src="/images/bee.png"
									alt="Bee 1"
									fill
									priority
									className="xs:mt-30 xs:ml-0 mt-0 -ml-40 object-cover md:mt-60"
									onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
								/>
							</div>
							<div className="motion-safe:animate-levitate xs:left-auto xs:right-0 xs:h-20 xs:w-20 absolute right-0 bottom-0 left-0 z-50 h-16 w-16 will-change-transform">
								<Image
									src="/images/bee.png"
									alt="Bee 2"
									fill
									priority
									className="xs:mt-10 xs:-ml-40 -mt-25 object-cover md:mt-40 md:-ml-55"
									onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
								/>
							</div>
						</div>
					</div>
				</div>
				{/* Pinned/sticky block under your navbar (h-20 ≈ 80px) */}
				{/* <div ref={mapSectionRef} className="h-[180vh]"> */}
				<div ref={mapSectionRef} className="mr-6 h-[170vh] min-h-[1300px] md:h-[150vh]">
					<div ref={stickyRef} className="sticky top-10 z-10">
						<div className="mx-auto max-w-7xl px-4 pt-12">
							<Title title="Our Farm" />
							<div className="relative mx-auto mt-12 h-[407px] w-[343px]">
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
				<div className="xs:w-full mx-auto mt-24 xs:mt-52 mr-110 w-[350px] max-w-3xl overflow-x-hidden px-4 text-center">
					<p className="xs:text-xl font-serif text-lg font-bold text-green-900 md:text-2xl">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
						exercitation Lorem ipsum dolor sit amet, consectetur adipiscing elit incididunt ut
						labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation Lorem
						ipsum dolor sit amet, consectetur adipiscing elit
					</p>
				</div>

				<Title title="Interactive Map" wrapperClass="mt-16 pb-16" />
				<div className="mt-2 rounded-2xl border-3 border-yellow-500 w-full max-w-5xl">
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
						{/* <div
							className={[
								'pointer-events-none fixed inset-0 overflow-x-hidden bg-black/45 backdrop-blur-[1px]',
								'transition-opacity duration-500',
								hoveredIdx !== null ? 'z-30 opacity-100' : '-z-10 opacity-0',
							].join(' ')}
						/> */}
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
							<Title title="Our Products" />

							<div className="relative flex flex-col gap-5 pt-10 md:flex-row md:gap-10 ">
								<ProductCard
									idx="01"
									title="Coffee Farming"
									src="/images/coffeeFarm.jpg"
									active={hoveredIdx === 0}
									onHoverChange={(h) => setHoveredIdx(h ? 0 : null)}
									href="/products/coffee"
								/>
								<ProductCard
									idx="02"
									title="Beekeeping"
									src="/images/hive.jpg"
									active={hoveredIdx === 1}
									onHoverChange={(h) => setHoveredIdx(h ? 1 : null)}
									wrapperClass="md:-mt-5"
									href="/products/honey"
								/>
								<ProductCard
									idx="03"
									title="Misc Products"
									src="/images/avocado.jpg"
									active={hoveredIdx === 2}
									onHoverChange={(h) => setHoveredIdx(h ? 2 : null)}
									href="/shop?c=more"
								/>
							</div>
						</div>
					</div>
				</section>
				<div className="xs:h-[1100px] flex h-[800px] w-full justify-center overflow-x-hidden overflow-y-clip">
					<BlobTextNoSSR
						title="We'd love to hear from you..."
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
						style="contact-us"
						heading="Contact Us"
						scale="scale-470"
						className="flex w-full justify-center"
						staticId="contact-us-blob" // ensure a fixed ID is passed
					/>
				</div>
			</section>
		</section>
	);
};

export default Landing;

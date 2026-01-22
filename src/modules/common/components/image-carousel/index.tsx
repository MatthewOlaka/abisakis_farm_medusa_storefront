'use client';

import Image from 'next/image';
import { useCallback, useMemo, useRef, useState } from 'react';
import Title from '../title';

type Slide = {
	src: string;
	name: string;
	description: string;
	alt?: string;
};

type Props = {
	title?: string;
	slides: Slide[];
	className?: string;
};

export default function ImageCarousel({ title = 'Our Techniques', slides, className = '' }: Props) {
	const [index, setIndex] = useState(0);
	const [animating, setAnimating] = useState(false);
	const [infoVisible, setInfoVisible] = useState(true);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const N = slides.length;

	const goTo = useCallback(
		(next: number) => {
			if (animating || N === 0) return;
			setAnimating(true);
			setInfoVisible(false);
			setIndex((prev) => (next + N) % N);
			// timings roughly match CSS durations
			window.setTimeout(() => setInfoVisible(true), 300);
			window.setTimeout(() => setAnimating(false), 800);
		},
		[animating, N],
	);

	const prev = useCallback(() => goTo(index - 1), [goTo, index]);
	const next = useCallback(() => goTo(index + 1), [goTo, index]);

	//   // keyboard
	//   useEffect(() => {
	//     const onKey = (e: KeyboardEvent) => {
	//       if (e.key === 'ArrowLeft') prev();
	//       if (e.key === 'ArrowRight') next();
	//     };
	//     window.addEventListener('keydown', onKey);
	//     return () => window.removeEventListener('keydown', onKey);
	//   }, [prev, next]);

	//   // swipe
	//   useEffect(() => {
	//     const el = containerRef.current || document;
	//     let startX = 0;

	//     const onStart = (e: TouchEvent) => (startX = e.changedTouches[0].screenX);
	//     const onEnd = (e: TouchEvent) => {
	//       const endX = e.changedTouches[0].screenX;
	//       const diff = startX - endX;
	//       if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
	//     };

	//     el.addEventListener('touchstart', onStart, { passive: true });
	//     el.addEventListener('touchend', onEnd, { passive: true });
	//     return () => {
	//       el.removeEventListener('touchstart', onStart);
	//       el.removeEventListener('touchend', onEnd);
	//     };
	//   }, [prev, next]);

	const startXRef = useRef(0);

	const handleTouchStart = (e: React.TouchEvent) => {
		startXRef.current = e.changedTouches[0].screenX;
	};
	const handleTouchEnd = (e: React.TouchEvent) => {
		const endX = e.changedTouches[0].screenX;
		const diff = startXRef.current - endX;
		if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
	};

	// map offset -> transform classes
	const cardClasses = useCallback(
		(i: number) => {
			const offset = (((i - index) % N) + N) % N; // normalize to [0..N-1]
			const base =
				// card shell
				'absolute w-[280px] h-[380px] sm:w-[350px] sm:h-[350px] rounded-sm overflow-hidden bg-white ' +
				'shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-600 ' +
				'ease-[cubic-bezier(0.25,0.46,0.45,0.94)] cursor-pointer will-change-transform';

			// center
			if (offset === 0) {
				return base + ' z-10 [transform:scale(1.1)_translateZ(0)] opacity-100';
			}

			// right-1
			if (offset === 1) {
				return (
					base + ' z-[5] [transform:translateX(200px)_scale(.9)_translateZ(-100px)] opacity-90'
				);
			}

			// right-2
			if (offset === 2) {
				return (
					base + ' z-[1] [transform:translateX(400px)_scale(.8)_translateZ(-300px)] opacity-70'
				);
			}

			// left-1
			if (offset === N - 1) {
				return (
					base + ' z-[5] [transform:translateX(-200px)_scale(.9)_translateZ(-100px)] opacity-90'
				);
			}

			// left-2
			if (offset === N - 2) {
				return (
					base + ' z-[1] [transform:translateX(-400px)_scale(.8)_translateZ(-300px)] opacity-70'
				);
			}

			// hidden
			return base + ' opacity-0 pointer-events-none';
		},
		[index, N],
	);

	const imgClasses = useCallback(
		(i: number) => {
			const offset = (((i - index) % N) + N) % N;
			const base =
				'w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]';
			const grayed = offset === 0 ? '' : ' grayscale';
			return base + grayed;
		},
		[index, N],
	);

	// responsive transforms for mobile (match your CSS @media)
	const mobileAdjust = useMemo(
		() =>
			// applies only under 768px
			'max-md:[&_.right-2]:[transform:translateX(250px)_scale(.8)_translateZ(-300px)] ' +
			'max-md:[&_.right-1]:[transform:translateX(120px)_scale(.9)_translateZ(-100px)] ' +
			'max-md:[&_.left-1]:[transform:translateX(-120px)_scale(.9)_translateZ(-100px)] ' +
			'max-md:[&_.left-2]:[transform:translateX(-250px)_scale(.8)_translateZ(-300px)]',
		[],
	);

	return (
		<section className={'w-full ' + className}>
			{/* Title */}
			{/* <h1 className="pointer-events-none bg-gradient-to-b from-[rgba(8,42,123,0.35)] from-30% to-transparent to-80% bg-clip-text text-center text-[4.5rem] leading-none font-black tracking-tight text-transparent uppercase select-none md:text-[7.5rem]"> */}
			{/* <h1 className=''>
				{title}
			</h1> */}
			<Title wrapperClass="text-center xs:text-start pb-15" title={title} />

			{/* Carousel */}
			<div
				ref={containerRef}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
				className="relative mx-auto mt-6 h-[450px] w-full max-w-[1200px] [perspective:1000px] md:mt-10"
			>
				{/* track */}
				<div
					className={
						'relative flex h-full w-full items-center justify-center [transform-style:preserve-3d] ' +
						'transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]' +
						mobileAdjust
					}
				>
					{slides.map((s, i) => (
						<div
							key={i}
							className={cardClasses(i)}
							onClick={() => goTo(i)}
							role="button"
							aria-label={`Go to ${s.name}`}
						>
							{/* Next/Image fill needs relative parent */}
							<div className="relative h-full w-full">
								<Image
									src={s.src}
									alt={s.alt || s.name}
									fill
									sizes="(max-width:768px) 200px, 280px"
									className={imgClasses(i)}
									priority={i === index}
								/>
							</div>
						</div>
					))}

					{/* Arrows */}
					<button
						type="button"
						onClick={prev}
						aria-label="Previous"
						className="absolute top-1/2 left-5 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-green-900/80 pr-[3px] pb-1 text-2xl text-white transition-transform duration-200 hover:scale-110 hover:bg-green-900 md:left-20"
					>
						‹
					</button>
					<button
						type="button"
						onClick={next}
						aria-label="Next"
						className="absolute top-1/2 right-5 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-green-900/80 pb-1 pl-[3px] text-2xl text-white transition-transform duration-200 hover:scale-110 hover:bg-green-900 md:right-20"
					>
						›
					</button>
				</div>
			</div>
			{/* Dots */}
			<div className="mt-10 flex items-center justify-center gap-2.5">
				{slides.map((_, i) => {
					const active = i === index;
					return (
						<button
							key={i}
							aria-label={`Go to slide ${i + 1}`}
							onClick={() => goTo(i)}
							className={
								'h-3 w-3 rounded-full transition-all ' +
								(active ? 'scale-110 bg-green-900' : 'bg-green-900/30 hover:bg-green-900/60')
							}
						/>
					);
				})}
			</div>

			{/* Info */}
			<div
				className={`mt-6 text-center transition-opacity duration-600 md:mt-10 ${infoVisible ? 'opacity-100' : 'opacity-0'} `}
			>
				<h2 className="xs:text-5xl relative font-serif text-4xl text-green-900">
					{slides[index]?.name}
				</h2>
				<div className="mt-5 flex w-full justify-center">
					<p className="max-w-[550px] px-10 font-sans text-lg text-green-900 md:max-w-[650px] md:px-0 md:font-semibold">
						{slides[index]?.description}
					</p>
				</div>
			</div>
		</section>
	);
}

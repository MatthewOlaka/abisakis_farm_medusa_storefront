'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';

type Props = {
	d: string;
	viewBox: string;
	pathTransform?: string;
	startColor?: string;
	endColor?: string;
	trackColor?: string;
	strokeWidth?: number;
	strokeLinecap?: 'round' | 'butt' | 'square';
	className?: string;
	minHeightVh?: number; // total scroll journey
	svgHeightVh?: number; // on-screen SVG height
	preserveAspect?: 'none' | 'xMidYMin meet' | 'xMidYMid meet' | 'xMidYMax meet';
	dialLead?: number; // small nudge ahead of tip
	active?: boolean; // init gate
};

export default function CurvyScrollPipe({
	d,
	viewBox,
	pathTransform,
	startColor = '#F59E0B',
	endColor = '#B45309',
	trackColor = '#e5e7eb',
	strokeWidth = 16,
	strokeLinecap = 'round',
	className = '',
	minHeightVh = 200,
	svgHeightVh = 90,
	preserveAspect = 'xMidYMin meet',
	dialLead = 0,
	active = false,
}: Props) {
	const sectionRef = useRef<HTMLDivElement | null>(null);
	const trackRef = useRef<SVGPathElement | null>(null);
	const liquidRef = useRef<SVGPathElement | null>(null);
	const dialRef = useRef<SVGGElement | null>(null);

	useLayoutEffect(() => {
		if (!active) return;

		gsap.registerPlugin(ScrollTrigger);

		const section = sectionRef.current!;
		const track = trackRef.current!;
		const liquid = liquidRef.current!;
		const dial = dialRef.current!;

		const len = track.getTotalLength();
		liquid.style.strokeDasharray = `${len}`;
		liquid.style.strokeDashoffset = `${len}`;
		liquid.style.stroke = startColor;

		const capOffset = strokeLinecap === 'round' ? strokeWidth / 2 : 0;
		const angleSample = Math.max(0.5, strokeWidth * 0.6); // tiny look-ahead for tangent

		const placeDial = (progress: number) => {
			const p = Math.min(Math.max(progress, 0), 1);
			const drawLen = p * len;
			const tipLen = Math.min(len, drawLen + capOffset + dialLead);

			const p1 = track.getPointAtLength(tipLen);
			const p2 = track.getPointAtLength(Math.min(tipLen + angleSample, len));
			const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

			// IMPORTANT: SVG transform attribute, same user space as the path
			dial.setAttribute('transform', `translate(${p1.x},${p1.y}) rotate(${angle})`);
		};

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				start: '45% bottom',
				end: 'bottom 90%',
				scrub: true,
				onUpdate: (st) => placeDial(st.progress),
			},
			defaults: { ease: 'none' },
		});

		tl.to(liquid, { strokeDashoffset: 0 }, 0).to(liquid, { stroke: endColor }, 0);

		// Ensure initial placement is correct at 0%
		placeDial(0);

		return () => {
			tl.scrollTrigger?.kill();
			tl.kill();
		};
	}, [active, startColor, endColor, strokeLinecap, strokeWidth, dialLead]);

	return (
		<section
			ref={sectionRef}
			className={`relative w-full ${className || ''}`}
			style={{ minHeight: `${minHeightVh}vh` }}
		>
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
				<svg
					viewBox={viewBox}
					preserveAspectRatio={preserveAspect}
					className="w-[min(1200px,100vw)]"
					style={{ height: `${svgHeightVh}vh` }}
				>
					{/* Keep EVERYTHING in the same coord system */}
					<g transform={pathTransform}>
						{/* Track */}
						<path
							ref={trackRef}
							d={d}
							fill="none"
							stroke={trackColor}
							strokeWidth={strokeWidth}
							strokeLinecap={strokeLinecap}
						/>
						{/* Liquid */}
						<path
							ref={liquidRef}
							d={d}
							fill="none"
							stroke={startColor}
							strokeWidth={strokeWidth}
							strokeLinecap={strokeLinecap}
						/>
						{/* Dial */}
						<g ref={dialRef} pointerEvents="none">
							<circle r={strokeWidth * 1.2} fill={endColor} stroke={endColor} strokeWidth={3} />
							{/* <line
								x1="0"
								y1="0"
								x2={strokeWidth * 1.4}
								y2="0"
								stroke={endColor}
								strokeWidth={3}
								strokeLinecap="round"
							/> */}
						</g>
					</g>
				</svg>
			</div>
		</section>
	);
}

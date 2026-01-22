// components/CurvyMarqueeText.tsx
'use client';

import { gsap } from 'gsap';
import { useLayoutEffect, useRef } from 'react';

type Dir = 'left' | 'right';

interface Props {
	text: string;
	speedSec?: number; // total seconds per full pass
	direction?: Dir; // 'left' or 'right'
	className?: string; // wrapper class
	fontSize?: number; // in px (SVG units)
	curveHeight?: number; // vertical amplitude in px
	stroke?: string; // optional path stroke color for debugging
}

export default function CurvyMarqueeText({
	text,
	speedSec = 18,
	direction = 'left',
	className = '',
	fontSize = 32,
	curveHeight = 60,
	stroke,
}: Props) {
	const pathRef = useRef<SVGPathElement | null>(null);
	const textPathRef = useRef<SVGTextPathElement | null>(null);

	useLayoutEffect(() => {
		const tp = textPathRef.current;
		if (!tp || !pathRef.current) return;

		// 1) Fill with a LOT of repeated content so the path is always covered
		// (keeps things SSR-safe and resize-proof without measuring).
		// Separator adds breathing room; tweak to taste.
		const unit = ` ${text}  • `;
		tp.textContent = Array(40).fill(unit).join(''); // plenty to cover any viewport

		// 2) Animate startOffset across the full path length in %, infinite loop.
		//    % is relative to the path length, so it "just works" responsively.
		const from = direction === 'left' ? '0%' : '-100%';
		const to = direction === 'left' ? '-100%' : '0%';

		const tween = gsap.fromTo(
			tp,
			{ attr: { startOffset: from } },
			{
				attr: { startOffset: to },
				duration: speedSec,
				ease: 'none',
				repeat: -1,
			},
		);

		// ✅ React cleanup must return void
		return () => {
			tween.kill();
		};
	}, [text, speedSec, direction]);

	// Simple smooth S-curve spanning the full viewBox width.
	// preserveAspectRatio="none" makes it stretch to the container width.
	const h = 120;
	const amp = curveHeight; // amplitude
	// Path draws a wave: start at midline, then Q..T for repeated smooth waves
	const d = `
    M 0 ${h / 2}
    Q 150 ${h / 2 - amp}, 300 ${h / 2}
    T 600 ${h / 2}
    T 900 ${h / 2}
    T 1200 ${h / 2}
  `;

	return (
		<div className={`w-full overflow-hidden ${className}`}>
			<svg
				viewBox="0 0 1200 120"
				preserveAspectRatio="none"
				className="pointer-events-none h-[120px] w-full select-none"
			>
				<path
					ref={pathRef}
					id="curvy-marquee-path"
					d={d}
					fill="none"
					stroke={stroke ?? 'transparent'}
					strokeWidth="1"
				/>
				<text
					fontSize={fontSize}
					fill="currentColor"
					className="font-serif font-bold"
					// fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
				>
					<textPath
						ref={textPathRef}
						href="#curvy-marquee-path"
						// Start the text centered on the first curve visually:
						startOffset="0%"
						// Keep glyphs nicely spaced regardless of repeats
						// (safe to omit if you don't want spacing adjusted):
						// lengthAdjust="spacing"
						// textLength="100%"
					/>
				</text>
			</svg>
		</div>
	);
}

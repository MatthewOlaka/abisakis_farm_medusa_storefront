'use client';
import { RefObject, useEffect } from 'react';

type Opts = {
	selector?: string; // default: [data-speed]
	axis?: 'y' | 'x'; // default: y
};

export default function useParallax(rootRef?: RefObject<HTMLElement>, opts: Opts = {}) {
	const { selector = '[data-speed]', axis = 'y' } = opts;

	useEffect(() => {
		const root: HTMLElement | Document = rootRef?.current ?? document;
		const qsa = (sel: string) =>
			Array.from((root as HTMLElement | Document).querySelectorAll<HTMLElement>(sel));

		let nodes = qsa(selector);
		if (!nodes.length) return;

		// Render loop (RAF) so scroll work is cheap & smooth
		let raf = 0;
		const tick = () => {
			const y = window.scrollY || 0;
			const x = window.scrollX || 0;
			for (const el of nodes) {
				const speed = parseFloat(el.dataset.speed || '0');
				const t =
					axis === 'y' ? `translate3d(0, ${y * speed}px, 0)` : `translate3d(${x * speed}px, 0, 0)`;
				// only touch transform to avoid clobbering other styles
				el.style.transform = t;
				el.style.willChange = 'transform';
			}
		};
		const onScroll = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(tick);
		};

		// Re-measure/rebind helper (for refresh, image load, resize)
		const rebind = () => {
			nodes = qsa(selector);
			onScroll(); // draw once
		};

		// Bind
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		// Ensure refresh case works (wait until everything’s painted)
		window.addEventListener('load', rebind);
		// If images affect layout, update when they load
		const imgs = qsa('img');
		const onImg = () => onScroll();
		imgs.forEach((img: any) => {
			if (!img.complete) img.addEventListener('load', onImg, { once: true });
		});

		// First paint + next frame to be safe
		onScroll();
		requestAnimationFrame(onScroll);

		// BFCache restore (Safari/Firefox) can skip load
		const onPageShow = (e: PageTransitionEvent) => {
			if (e.persisted) rebind();
		};
		window.addEventListener('pageshow', onPageShow);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			window.removeEventListener('load', rebind);
			window.removeEventListener('pageshow', onPageShow);
			imgs.forEach((img: any) => img.removeEventListener?.('load', onImg));
		};
	}, [rootRef?.current, selector, axis]);
}

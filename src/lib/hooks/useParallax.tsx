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

		type Entry = { el: HTMLElement; base: string };

		let entries: Entry[] = qsa(selector).map((el) => {
			// Preserve original transform once (scale/rotate/etc.) so we don't stack our own translate
			const existing = getComputedStyle(el).transform;
			const base =
				el.dataset.parallaxBaseTransform ??
				(existing === 'none' ? '' : existing);
			// cache it to avoid reading a translate we applied earlier
			if (!el.dataset.parallaxBaseTransform) {
				el.dataset.parallaxBaseTransform = base;
			}
			return { el, base };
		});
		if (!entries.length) return;

		// Render loop (RAF) so scroll work is cheap & smooth
		let raf = 0;
		const tick = () => {
			const y = window.scrollY || 0;
			const x = window.scrollX || 0;
			for (const { el, base } of entries) {
				const speed = parseFloat(el.dataset.speed || '0');
				const t =
					axis === 'y' ? `translate3d(0, ${y * speed}px, 0)` : `translate3d(${x * speed}px, 0, 0)`;
				// append to the existing transform so scale/rotate classes remain intact
				el.style.transform = `${base ? `${base} ` : ''}${t}`;
				el.style.willChange = 'transform';
			}
		};
		const onScroll = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(tick);
		};

		// Re-measure/rebind helper (for refresh, image load, resize)
		const rebind = () => {
			entries = qsa(selector).map((el) => {
				const existing = getComputedStyle(el).transform;
				const base =
					el.dataset.parallaxBaseTransform ??
					(existing === 'none' ? '' : existing);
				if (!el.dataset.parallaxBaseTransform) {
					el.dataset.parallaxBaseTransform = base;
				}
				return { el, base };
			});
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

'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Props = {
	/** CSS selector or id for the element whose top should align after scroll */
	anchor?: string; // e.g. '#shop-filters'
	/** Space to keep for sticky header */
	offset?: number; // e.g. 80
	/** If we're already close enough, don't scroll */
	threshold?: number; // e.g. 40
};

export default function ShopScrollManager({
	anchor = '#shop-filters',
	offset = 80,
	threshold = 40,
}: Props) {
	const sp = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const prevC = useRef<string | null>(null);

	const findTargetY = () => {
		const sel = anchor.startsWith('#') ? anchor : `#${anchor}`;
		const el = document.querySelector<HTMLElement>(sel);
		if (!el) return null;
		const rect = el.getBoundingClientRect();
		return Math.max(0, rect.top + window.scrollY - offset);
	};

	const maybeScroll = () => {
		const y = findTargetY();
		if (y == null) return;
		const delta = Math.abs((window.scrollY || 0) - y);
		if (delta > threshold) {
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	};

	// Case 1: Coming from product page with ?s=1 → scroll once, then clean the URL.
	useEffect(() => {
		if (sp.get('s') === '1') {
			requestAnimationFrame(maybeScroll);
			const params = new URLSearchParams(sp.toString());
			params.delete('s');
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Case 2: Filter changes (?c=...) → scroll the filters to the same top position.
	useEffect(() => {
		const c = sp.get('c') || null;
		if (prevC.current === null) {
			prevC.current = c; // first render, no scroll
			return;
		}
		if (prevC.current !== c) {
			prevC.current = c;
			requestAnimationFrame(maybeScroll);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sp.toString()]);

	return null;
}

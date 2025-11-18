// src/modules/common/components/LenisProvider.tsx
'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
		(window as any).__lenis = lenis;

		let rafId = 0;
		const raf = (t: number) => {
			lenis.raf(t);
			rafId = requestAnimationFrame(raf);
		};
		rafId = requestAnimationFrame(raf);

		return () => {
			cancelAnimationFrame(rafId);
			lenis.destroy();
		};
	}, []);

	return <>{children}</>;
}

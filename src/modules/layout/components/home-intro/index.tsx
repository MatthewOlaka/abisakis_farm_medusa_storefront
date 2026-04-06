'use client';

import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@lib/lib/utils';

const HOME_INTRO_HOLD_MS = 900;
const HOME_INTRO_EXIT_MS = 1500;

type HomeIntroContextValue = {
	isActive: boolean;
	isExiting: boolean;
	isIntroRoute: boolean;
	introKind: 'home' | 'product' | null;
	markReady: () => void;
};

const HomeIntroContext = createContext<HomeIntroContextValue | null>(null);

function getIntroKind(pathname: string): 'home' | 'product' | null {
	const segments = pathname.split('/').filter(Boolean);
	const first = segments[0] ?? '';
	const hasCountryPrefix = /^[a-z]{2}$/i.test(first);
	const routeSegments = hasCountryPrefix ? segments.slice(1) : segments;

	if (routeSegments.length === 0) return 'home';

	if (routeSegments.length === 2 && routeSegments[0] === 'products') {
		return routeSegments[1] === 'coffee' || routeSegments[1] === 'honey' ? 'product' : null;
	}

	return null;
}

export function HomeIntroProvider({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const introKind = getIntroKind(pathname);
	const isIntroRoute = introKind !== null;
	const [isActive, setIsActive] = useState(isIntroRoute);
	const [isExiting, setIsExiting] = useState(false);
	const revealStartedRef = useRef(false);
	const timeoutsRef = useRef<number[]>([]);

	useLayoutEffect(() => {
		timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
		timeoutsRef.current = [];
		revealStartedRef.current = false;
		setIsExiting(false);
		setIsActive(isIntroRoute);
	}, [isIntroRoute, pathname]);

	function markReady() {
		if (!isIntroRoute || !isActive || revealStartedRef.current) return;

		revealStartedRef.current = true;

		const exitTimer = window.setTimeout(() => {
			setIsExiting(true);
		}, HOME_INTRO_HOLD_MS);

		const completeTimer = window.setTimeout(() => {
			setIsActive(false);
			setIsExiting(false);
			timeoutsRef.current = [];
		}, HOME_INTRO_HOLD_MS + HOME_INTRO_EXIT_MS);

		timeoutsRef.current = [exitTimer, completeTimer];
	}

	return (
		<HomeIntroContext.Provider value={{ isActive, isExiting, isIntroRoute, introKind, markReady }}>
			{children}
		</HomeIntroContext.Provider>
	);
}

export function HomeIntroOverlay() {
	const context = useHomeIntro();

	if (!context.isIntroRoute || !context.isActive) {
		return null;
	}

	return (
		<div
			className={cn('fixed inset-0 isolate flex items-center justify-center overflow-hidden')}
			style={{
				backgroundColor: '#E6DFAD',
				backgroundImage:
					'radial-gradient(circle at top, rgba(231, 201, 49, 0.24), transparent 48%), linear-gradient(180deg, #E6DFAD 0%, #d7cf95 100%)',
				backfaceVisibility: 'hidden',
				WebkitBackfaceVisibility: 'hidden',
				height: '100dvh',
				transform: context.isExiting ? 'translate3d(0, -100%, 0)' : 'translate3d(0, 0, 0)',
				transition: `transform ${HOME_INTRO_EXIT_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
				willChange: 'transform',
				zIndex: 2147483647,
			}}
			aria-hidden="true"
		>
			<div className="absolute inset-x-0 bottom-0 h-px bg-green-900/20" />

			<div className="relative z-10 flex max-w-xl flex-col items-center px-6 text-center text-green-900">
				<div className="relative h-28 w-40 md:h-72 md:w-96">
					<Image
						src="/images/logo.png"
						alt="Abisaki's Farm"
						fill
						priority
						className="object-contain"
						sizes="208px"
					/>
				</div>
				<p className="text-sm font-semibold uppercase tracking-[0.35em] text-green-900/65">
					Abisaki&apos;s Farm
				</p>
				<p className="mt-2 max-w-md text-xl font-serif font-bold leading-tight md:text-4xl text-green-900">
					Pure Kenyan honey, coffee, and much more.
				</p>
			</div>
		</div>
	);
}

export function HomeIntroNavShell({ children }: { children: React.ReactNode }) {
	const context = useHomeIntro();

	if (context.introKind !== 'home') {
		return <>{children}</>;
	}

	if (!context.isActive) {
		return <>{children}</>;
	}

	const shouldShowNav = !context.isActive || (context.introKind === 'home' && context.isExiting);

	return (
		<div
			className={cn(
				'transition-all duration-700 ease-out',
				shouldShowNav
					? 'translate-y-0 opacity-100'
					: 'pointer-events-none -translate-y-6 opacity-0',
			)}
		>
			{children}
		</div>
	);
}

export function useHomeIntro() {
	const context = useContext(HomeIntroContext);

	if (!context) {
		throw new Error('useHomeIntro must be used within a HomeIntroProvider');
	}

	return context;
}

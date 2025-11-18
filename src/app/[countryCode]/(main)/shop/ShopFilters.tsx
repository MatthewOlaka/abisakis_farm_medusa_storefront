'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { categories, categoryImages, categoryLabels } from '@lib/constants';
import { ICategory } from 'types/global';

export default function ShopFilters({
	active,
	id = 'shop-filters',
}: {
	active: string;
	id?: string;
}) {
	const pathname = usePathname();
	const sp = useSearchParams();

	return (
		<nav
			id={id}
			aria-label="Shop categories"
			className="flex flex-wrap items-center justify-center gap-4"
		>
			{categories.map((c: ICategory) => {
				const params = new URLSearchParams(sp.toString());
				params.set('c', c);
				const href = `${pathname}?${params.toString()}`;
				const isActive = active === c;
				return (
					<Link
						key={c}
						href={href}
						scroll={false} // prevent Next from jumping to top
						prefetch
						aria-current={isActive ? 'page' : undefined}
						className={[
							'group inline-flex flex-col items-center justify-end rounded-2xl px-4 py-3 md:min-h-52 min-w-40',
							'transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
							isActive
								? 'bg-yellow-500 text-green-900 shadow-sm ring-1 ring-amber-300'
								: 'bg-yellow-200 text-green-900 hover:bg-yellow-300',
						].join(' ')}
					>
						<div className="hidden md:block">
							<Image
								src={categoryImages[c]}
								alt={categoryLabels[c]}
								width={100}
								height={100}
								priority={isActive}
								className="object-contain pointer-events-none transition-transform duration-200 group-hover:scale-105"
							/>
						</div>
						<span className="mt-2 font-serif text-2xl">{categoryLabels[c]}</span>
					</Link>
				);
			})}
		</nav>
	);
}

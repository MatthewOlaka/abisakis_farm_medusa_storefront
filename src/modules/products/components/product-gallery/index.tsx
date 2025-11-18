'use client';

import SafeImage from '@modules/generic/safe-image';
import { useCallback, useMemo, useState } from 'react';

type Props = {
	// mainSrc: string;
	mainSrc: any;
	alt: string;
	// thumbs?: string[]; // extra images (we'll include main as a selectable thumb too)
	thumbs?: any; // extra images (we'll include main as a selectable thumb too)
	className?: string; // wrapper
	mainBoxClass?: string; // size of big image box (Tailwind)
	mainSizes?: string; // sizes for <Image fill> in main box
};

export default function ProductGallery({
	mainSrc,
	alt,
	thumbs = [],
	className = '',
	// parent must be positioned (relative) AND have an explicit height/width for next/image's `fill` to work
	// use a concrete Tailwind height utility (h-100 is not a built-in utility) or an arbitrary value like h-[400px]
	mainBoxClass = 'relative h-80 w-full',
	mainSizes = '(max-width:768px) 90vw, 400px', // adjust to your layout
}: Props) {
	// Build list: main first, then extras, deduped but keep order
	const images = useMemo(() => {
		const seen = new Set<string>();
		const list = [mainSrc, ...thumbs];
		return list.filter((src) => (seen.has(src) ? false : (seen.add(src), true)));
	}, [mainSrc, thumbs]);

	const [idx, setIdx] = useState(0);

	const select = useCallback((i: number) => setIdx(i), []);
	const onKey = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			setIdx(i);
		}
	}, []);

	return (
		<div className={`flex h-full w-full max-w-full flex-col items-center ${className}`}>
			{/* Big image */}
			<div className={mainBoxClass}>
				<SafeImage
					src={images[idx]}
					alt={alt}
					fill
					sizes={mainSizes}
					className="rounded-sm object-cover"
				/>
			</div>

			{/* Thumbnails row */}
			<div className="mt-3 flex w-full max-w-full items-center gap-2 overflow-x-auto p-5 pt-1">
				{images.map((src, i) => {
					const active = i === idx;
					return (
						<button
							key={`${src}-${i}`}
							type="button"
							onClick={() => select(i)}
							onKeyDown={(e) => onKey(e, i)}
							aria-label={`Show image ${i + 1}`}
							className={`relative h-16 w-16 shrink-0 rounded-md ring-2 transition ${active ? 'ring-yellow-400' : 'ring-transparent hover:ring-white/40 focus-visible:ring-yellow-400'} focus:outline-none`}
						>
							<div className="absolute inset-0 overflow-hidden rounded-[6px] bg-white/5">
								<SafeImage
									src={src}
									alt={`${alt} ${i + 1}`}
									fill
									sizes="64px"
									className="object-cover"
								/>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}

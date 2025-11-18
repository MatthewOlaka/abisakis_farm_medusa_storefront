'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

export default function SafeImage(props: ImageProps) {
	const { src, alt, ...rest } = props;
	const [broken, setBroken] = useState(false);

	if (broken) {
		return (
			<div className="flex h-full w-full items-center justify-center rounded bg-green-900/5 text-green-900/70">
				<span className="text-xs">Image unavailable</span>
			</div>
		);
	}

	return <Image src={src} alt={alt} onError={() => setBroken(true)} {...rest} />;
}

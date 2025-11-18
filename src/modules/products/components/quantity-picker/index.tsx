'use client';

import { useCallback } from 'react';

type Props = {
	// initial?: number;
	min?: number;
	max?: number;
	className?: string;
	qty: number;
	setQty: any;
};

export default function QuantityPicker({
	min = 0,
	max = 99,
	className = '',
	qty = 1,
	setQty,
}: Props) {
	// const [qty, setQty] = useState(initial);

	const clamp = useCallback((n: number) => Math.max(min, Math.min(max, n)), [min, max]);

	const dec = useCallback(() => setQty((q: number) => clamp(q - 1)), [clamp, setQty]);
	const inc = useCallback(() => setQty((q: number) => clamp(q + 1)), [clamp, setQty]);

	const minusDisabled = qty <= min;

	return (
		<div
			className={`mb-2 flex gap-1 h-16 w-full items-center justify-center rounded-md ${className}`}
		>
			<button
				type="button"
				aria-label="Decrease quantity"
				onClick={dec}
				disabled={minusDisabled}
				className={`flex h-full w-20 items-center justify-center rounded-l-sm border-r-3 border-green-900 text-3xl text-green-900 ${minusDisabled ? 'cursor-not-allowed bg-yellow-500/50' : 'cursor-pointer bg-yellow-500 hover:bg-amber-400'}`}
			>
				–
			</button>

			<div
				className="flex h-full w-full max-w-40 items-center justify-center bg-yellow-500 font-serif text-3xl text-green-900 select-none"
				aria-live="polite"
			>
				{qty}
			</div>

			<button
				type="button"
				aria-label="Increase quantity"
				onClick={inc}
				className="flex h-full w-20 cursor-pointer items-center justify-center rounded-r-sm border-l-3 border-green-900 bg-yellow-500 text-3xl text-green-900 hover:bg-amber-400"
			>
				+
			</button>
		</div>
	);
}

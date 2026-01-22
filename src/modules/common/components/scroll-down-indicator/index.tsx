import { cn } from '@lib/lib/utils';

type ScrollDownIndicatorProps = {
	className?: string;
	label?: string;
};

const ScrollDownIndicator = ({ className, label = 'Scroll down' }: ScrollDownIndicatorProps) => {
	return (
		<div className={cn('flex flex-col items-center gap-3 text-green-900', className)}>
			<span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-600">
				{label}
			</span>
			<div className="relative flex flex-col items-center">
				<div className="relative flex h-16 w-10 items-center justify-center rounded-full border-2 border-yellow-500/60 bg-white/80 shadow-[0_14px_35px_rgba(0,0,0,0.12)] backdrop-blur-sm">
					<span
						aria-hidden
						className="h-2.5 w-2.5 rounded-full bg-yellow-500 motion-safe:animate-scroll-dot"
					/>
					<span
						aria-hidden
						className="absolute inset-x-2 bottom-[6px] h-[6px] rounded-full bg-yellow-500/25 blur-[3px]"
					/>
				</div>
				<svg
					aria-hidden
					viewBox="0 0 24 24"
					className="mt-3 h-5 w-5 text-yellow-500 motion-safe:animate-bounce"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 4v14m0 0-5-5m5 5 5-5"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
		</div>
	);
};

export default ScrollDownIndicator;

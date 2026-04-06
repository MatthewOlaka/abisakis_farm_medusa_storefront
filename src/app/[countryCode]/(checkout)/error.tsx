'use client';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
			<h1 className="font-serif text-4xl font-bold text-green-900">Checkout Error</h1>
			<p className="mt-4 max-w-md text-green-900/80">
				Something went wrong during checkout. Please try again.
			</p>
			<button
				onClick={reset}
				className="mt-8 rounded-full bg-yellow-500 px-8 py-3 font-semibold text-green-900 transition-colors hover:bg-amber-400"
			>
				Try Again
			</button>
		</div>
	);
}

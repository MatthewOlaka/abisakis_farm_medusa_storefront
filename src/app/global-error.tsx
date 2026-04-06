'use client';

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="en">
			<body>
				<div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
					<h1 className="font-serif text-4xl font-bold text-green-900">Something went wrong</h1>
					<p className="mt-4 max-w-md text-green-900/80">
						An unexpected error occurred. Please try again.
					</p>
					<button
						onClick={reset}
						className="mt-8 rounded-full bg-yellow-500 px-8 py-3 font-semibold text-green-900 transition-colors hover:bg-amber-400"
					>
						Try Again
					</button>
				</div>
			</body>
		</html>
	);
}

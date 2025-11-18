export default function GridSkeleton() {
	return (
		<div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{Array.from({ length: 8 }).map((_, i) => (
				<div key={i} className="h-50 w-60 animate-pulse rounded-2xl bg-green-900/10" />
			))}
		</div>
	);
}

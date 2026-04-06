export default function GridSkeleton() {
	return (
		<div className="flex w-full justify-center">
			<div className="xs:mt-40 xs:gap-y-32 mt-20 grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className="flex flex-col items-center">
						{/* Image placeholder — floats above the card like real ItemCard */}
						<div className="h-40 w-40 animate-pulse rounded-full bg-green-900/10" />

						{/* Card body */}
						<div className="-mt-8 flex h-52 w-60 flex-col justify-end rounded-2xl bg-yellow-200/60 px-5 pb-3 shadow-sm">
							{/* Title lines */}
							<div className="mt-auto flex flex-col gap-2">
								<div className="h-4 w-36 animate-pulse rounded bg-green-900/10" />
								<div className="h-4 w-24 animate-pulse rounded bg-green-900/10" />
							</div>
							{/* Price + button row */}
							<div className="mt-2 flex items-center justify-between">
								<div className="h-4 w-16 animate-pulse rounded bg-green-900/10" />
								<div className="h-10 w-10 animate-pulse rounded-full bg-green-900/10" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

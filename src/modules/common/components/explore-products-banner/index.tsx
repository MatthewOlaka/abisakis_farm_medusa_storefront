import Image from 'next/image';
import { Button } from '../button';

const ExploreProductsBanner = () => {
	return (
		<div className="xs:h-64 relative flex h-95 w-full justify-between overflow-hidden rounded-3xl bg-green-900 md:max-w-[850px]">
			{/* Left honey spoon */}
			<div className="xs:relative xs:h-60 xs:w-52 xs:-mt-10 pointer-events-none absolute z-0 h-32 w-32 select-none">
				<Image
					src="/images/honeySpoon.png"
					alt="Honey Spoon"
					fill
					priority
					className="mt-6 object-contain"
					onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
				/>
			</div>

			{/* Center content */}
			<div className="xs:mt-5 xs:ml-7 z-10 mt-25 flex w-full flex-col items-center justify-center gap-5">
				<div>
					<h1 className="text-center font-serif text-5xl text-white md:text-6xl">
						Explore Other
						<br /> Products
					</h1>
					<div className="xs:h-20 xs:w-20 absolute z-10 h-12 w-12">
						<Image
							src="/images/chilli.png"
							alt="Chilli"
							fill
							priority
							className="xs:-mt-4 -mt-3 ml-10 object-contain"
							onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
						/>
					</div>
				</div>
				<Button
					text="Shop Now"
					size="medium"
					borderRadius="rounded-xl"
					wrapperClass="mt-10 xs:mt-0 max-w-46 z-100 font-semibold"
				/>
			</div>

			{/* Right branch (rotated) */}
			<div className="xs:relative xs:h-72 xs:w-72 xs:-right-0 pointer-events-none absolute top-0 -right-8 z-0 h-56 w-56 rotate-[60deg] will-change-transform select-none">
				<Image
					src="/images/editedBranch.png"
					alt="Branch"
					fill
					priority
					className="mt-0 -ml-14 object-contain"
					onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
				/>
			</div>
		</div>
	);
};

export default ExploreProductsBanner;

'use client';

import { Button } from '@modules/common/components/button';
import TeamCard from '@modules/common/components/team-card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const members = [
	{
		name: 'Catherine Olaka',
		title: 'CEO & Founder',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum dolor sit amet.  Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		src: '/images/MTT1.png',
		isFounder: true,
	},
	{
		name: 'Habil Olaka',
		title: 'Founder',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
		src: '/images/MTT2.png',
		isFounder: true,
	},
	{
		name: 'Stephanie Olaka',
		title: 'Founder',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
		src: '/images/MTT3.png',
		isFounder: true,
	},
	{
		name: 'Matthew Olaka',
		title: 'Family Friend',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
		src: '/images/MTT4.png',
		isFounder: true,
	},
	{
		name: 'Catherine Olaka',
		title: 'Cherry Picker',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit,Lorem ipsum dolor sit amet.',
		src: '/images/MTT1.png',
	},
	{
		name: 'Habil Olaka',
		title: 'Cherry Picker',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
		src: '/images/MTT2.png',
	},
	{
		name: 'Stephanie Olaka',
		title: 'Cherry Picker',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
		src: '/images/MTT3.png',
	},
	{
		name: 'Matthew Olaka',
		title: 'Cherry Picker',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
		src: '/images/MTT4.png',
	},
	{
		name: 'Catherine Olaka',
		title: 'Cherry Picker',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit,Lorem ipsum dolor sit amet.',
		src: '/images/MTT1.png',
	},
	{
		name: 'Habil Olaka',
		title: 'Cherry Picker',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
		src: '/images/MTT2.png',
	},
	{
		name: 'Stephanie Olaka',
		title: 'Cherry Picker',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
		src: '/images/MTT3.png',
	},
	{
		name: 'Matthew Olaka',
		title: 'Cherry Picker',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
		src: '/images/MTT4.png',
	},
];

export default function TeamPage() {
	const router = useRouter();
	return (
		<section className="flex flex-col items-center py-5 md:py-12 ">
			<div className="flex w-full flex-col items-center justify-center text-center">
				<h1 className="xs:text-6xl font-serif text-5xl font-bold text-green-900 md:text-7xl">
					Meet Our Team
				</h1>
				<p className="max-w-[800px] px-5 pt-5 font-sans text-sm text-green-900 md:text-lg">
					Our philosophy is simple: bring together exceptional people and empower them with the
					tools and support they need to thrive — not just in their careers, but in life.
				</p>
			</div>

			<div className="xs:grid-cols-2 mx-auto mt-20 grid w-full max-w-[900px] grid-cols-1 place-items-center gap-y-10 md:grid-cols-3 lg:grid-cols-4">
				{members.map((member, idx) => (
					<TeamCard key={idx} {...member} />
				))}
			</div>
			<div className="flex w-full justify-center px-5 md:px-25">
				{/* <div className="my-40 flex h-120 w-full flex-col items-center justify-center rounded-4xl bg-green-800/20 md:h-70 md:max-w-4xl md:flex-row"> */}
				<div className="my-40 flex h-[480px] w-full flex-col items-center justify-center rounded-3xl bg-gradient-to-tl from-green-600/70 to-green-800 md:h-72 md:max-w-3xl md:flex-row">
					<div className="flex flex-col items-center gap-5 px-5 md:max-w-1/2">
						{/* <h1 className="font-serif text-5xl font-bold text-green-900"> */}
						<h1 className="font-serif text-4xl font-bold text-white lg:text-5xl">
							We&apos;re Hiring!
						</h1>
						{/* <h2 className="max-w-sm text-center font-serif text-xl font-bold text-green-900"> */}
						<h2 className="max-w-sm text-center font-serif text-lg font-bold text-white lg:text-xl">
							We are always looking for great people to work and connect with. Chat to our team.
						</h2>
						<Button
							wrapperClass="hover:bg-yellow-400 !text-green-900 px-16 py-3 rounded-full border border-amber-300 text-nowrap"
							text="View Openings"
							onClick={() => router.push('/careers')}
						/>
					</div>
					<div>
						<div className="flex items-center pt-10 md:pt-0">
							{members.slice(0, 4).map((m, i) => (
								<div
									key={`${m.name}-${i}`}
									className={[
										// coin shell
										'relative h-24 w-24 rounded-full border-2 shadow-md',
										// alternate background colors (change these two to your palette)
										i % 2 === 0
											? 'border-green-700 bg-yellow-500'
											: 'border-yellow-500 bg-gray-200',
										// overlap to the left (skip the first one)
										i > 0 ? '-ml-3' : '',
									].join(' ')}
									// make the right coin appear on top
									style={{ zIndex: i + 1 }}
									title={m.name}
								>
									{/* inner clip for the image */}
									<div className="relative h-full w-full overflow-hidden rounded-full">
										<Image
											src={m.src}
											alt={`${m.name} headshot`}
											fill
											sizes="86px"
											className="object-cover"
											onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

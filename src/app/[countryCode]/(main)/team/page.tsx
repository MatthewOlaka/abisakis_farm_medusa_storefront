import { listTeamMembers } from '@lib/data/team';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import TeamCard from '@modules/common/components/team-card';
import { Metadata } from 'next';
import Image from 'next/image';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: "Our Team | Abisaki's Farm",
	description:
		"Meet the passionate team behind Abisaki's Farm — dedicated to bringing you the finest Kenyan honey and coffee.",
	openGraph: {
		title: "Our Team | Abisaki's Farm",
		description: "Meet the passionate team behind Abisaki's Farm.",
	},
};

export default async function TeamPage() {
	const members = await listTeamMembers();

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

			{members.length > 0 ? (
				<div className="xs:grid-cols-2 mx-auto mt-20 grid w-full max-w-[900px] grid-cols-1 place-items-center gap-y-10 md:grid-cols-3 lg:grid-cols-4">
					{members.map((member) => (
						<TeamCard key={member.id} {...member} />
					))}
				</div>
			) : (
				<div className="mx-auto mt-20 w-full max-w-[720px] rounded-3xl border border-green-900/20 bg-green-900/5 px-6 py-10 text-center text-green-900">
					<h2 className="font-serif text-3xl font-bold">Team members are coming soon.</h2>
					<p className="mx-auto mt-4 max-w-[560px] font-sans text-sm md:text-base">
						Add rows to the <code>team_members</code> table in Supabase and they will render here
						automatically.
					</p>
				</div>
			)}
			<div className="flex w-full justify-center px-5 md:px-24">
				{/* <div className="my-40 flex h-120 w-full flex-col items-center justify-center rounded-4xl bg-green-800/20 md:h-70 md:max-w-4xl md:flex-row"> */}
				<div className="my-40 md:pr-5 flex h-[480px] w-full flex-col items-center justify-center rounded-3xl bg-gradient-to-tl from-green-600/70 to-green-800 md:h-72 md:max-w-3xl md:flex-row">
					<div className="flex flex-col items-center gap-5 px-5 md:max-w-1/2">
						{/* <h1 className="font-serif text-5xl font-bold text-green-900"> */}
						<h1 className="font-serif text-4xl font-bold text-white lg:text-5xl">
							We&apos;re Hiring!
						</h1>
						{/* <h2 className="max-w-sm text-center font-serif text-xl font-bold text-green-900"> */}
						<h2 className="max-w-sm text-center font-serif text-lg font-bold text-white lg:text-xl">
							We are always looking for great people to work and connect with. Chat to our team.
						</h2>
						<LocalizedClientLink
							href="/careers"
							className="rounded-full px-16 py-3 text-nowrap text-green-900 transition-colors hover:bg-amber-400 bg-yellow-500 !cursor-pointer"
						>
							View Openings
						</LocalizedClientLink>
					</div>
					<div>
						<div className="flex items-center pt-10 md:pt-0">
							{members.slice(0, 4).map((m, i) => (
								<div
									key={m.id}
									className={[
										// coin shell
										'relative h-24 w-24 rounded-full border-2 shadow-md',
										// alternate background colors (change these two to your palette)
										i % 2 === 0
											? 'border-green-700 bg-yellow-200'
											: 'border-yellow-200 bg-yellow-100',
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

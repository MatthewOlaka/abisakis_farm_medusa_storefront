'use client';

import { Button } from '@modules/common/components/button';
import OpeningsAccordions from '@modules/common/components/openings-accordions';
// import OpeningsAccordions from '@/components/Generic/OpeningsAccordions';
import { jobs } from '@modules/common/data/jobs';
import { useRouter } from 'next/navigation';

export default function CareersPage() {
	const router = useRouter();
	return (
		<section className="flex flex-col items-center py-5 md:py-12">
			<div className="flex w-full flex-col items-center justify-center text-center">
				<h1 className="xs:text-6xl font-serif text-5xl font-bold text-green-900 md:text-7xl">
					Careers
				</h1>
				<p className="max-w-[800px] px-5 pt-5 font-sans text-sm text-green-900 md:text-lg">
					Explore exciting opportunities at Abisaki’s farm- We believe in fostering a dynamic and
					collaborative work environment that empowers our team to showcase their excellence.
				</p>
			</div>
			<div className="xs:px-20 xs:py-20 flex w-full max-w-6xl gap-10 px-5 py-10">
				<h2 className="xs:text-4xl font-serif text-2xl font-bold whitespace-nowrap text-green-900">
					Current Openings
				</h2>
				<div className="mt-5 h-1 w-full max-w-xl border-b-2 border-gray-300"></div>
			</div>
			<OpeningsAccordions jobs={jobs} />
			<div className="xs:mt-30 mt-20 pb-20 text-center">
				<h1 className="xs:text-5xl font-serif text-3xl font-bold text-green-900">
					Can&apos;t find your position?
				</h1>
				<h2 className="xs:text-2xl xs:py-6 py-4 font-serif text-lg text-green-900">
					We would still love to hear from you...
				</h2>
				<Button
					wrapperClass="hover:bg-yellow-400 px-16 text-sm xs:text-md py-3 rounded-full border border-amber-300"
					text="Let's Connect"
					onClick={() => router.push('/contact')}
				/>
			</div>
		</section>
	);
}

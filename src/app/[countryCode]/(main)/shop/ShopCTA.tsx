'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@modules/common/components/button';
import { useRouter } from 'next/navigation';

const ShopCTA = () => {
	const router = useRouter();
	return (
		<div className="flex w-full justify-center">
			<div className="bg-brown-700 my-40 flex h-[500px] w-full flex-col items-center justify-center gap-5 rounded-3xl md:h-72 md:max-w-4xl md:flex-row">
				<div className="xs:h-60 xs:w-60 relative h-40 w-40">
					<Image
						src="/images/beeMailbox.png"
						alt="Mailbox"
						fill
						priority
						className="object-contain"
						onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
					/>
				</div>
				<div className="flex flex-col items-center gap-5 px-5 md:max-w-1/2">
					<h1 className="pt-5 text-center font-serif text-4xl font-bold text-white">
						Have an Export Inquiry?
					</h1>
					<h2 className="max-w-sm text-center font-sans text-md font-medium text-white">
						We make big orders easy. Consistent quality with fair bulk pricing. Tell us your specs
						and timeline.
					</h2>
					<Button
						wrapperClass="hover:bg-yellow-400 px-16 py-3 xs:mb-8 rounded-full border border-amber-300"
						text="Contact Our Team"
						onClick={() => router.push('/contact')}
					/>
				</div>
			</div>
		</div>
	);
};

export default ShopCTA;

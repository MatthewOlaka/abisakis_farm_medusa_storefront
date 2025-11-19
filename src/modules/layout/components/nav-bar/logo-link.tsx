'use client';

import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Image from 'next/image';

interface IProps {
	wrapperClassname?: string;
}

export default function LogoLink(props: IProps) {
	const { wrapperClassname } = props;
	return (
		<LocalizedClientLink href="/" className="flex items-center gap-2">
			<div className={`${wrapperClassname} relative`}>
				<Image
					src="/images/logo.png" // ensure /public/images/logo.png exists
					alt="Abisaki's Farm"
					fill
					// sizes="80px"
					className="object-contain"
					priority
				/>
			</div>
		</LocalizedClientLink>
	);
}

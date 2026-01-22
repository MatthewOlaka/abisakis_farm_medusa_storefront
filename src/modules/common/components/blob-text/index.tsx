// src/components/BlobText.tsx
'use client';

import { useId, useMemo } from 'react';
import { Button } from '../button';

interface IProps {
	title: string;
	description: string;
	/** text alignment inside the blob */
	style?: 'left' | 'right' | 'center' | 'contact-us';
	/** optional: blob fill color (default: #fff) */
	fill?: string;
	className?: string;
	heading?: string;
	scale?: string;
	staticId?: string;
}

const BlobText = ({
	title,
	description,
	style = 'center',
	fill = '#FFF',
	className = '',
	heading,
	scale,
	staticId,
}: IProps) => {
	// Stable, SSR-safe id for the clipPath (sanitize useId’s colons for url(#...))
	// const rawId = useId();
	const rawId = staticId ?? useId();
	const clipId = useMemo(() => `blobClip-${rawId.replace(/:/g, '')}`, [rawId]);
	const pathId = `${clipId}-path`;

	const align = style; // map to Tailwind text alignment
	// const textAlignClass =
	// 	align === 'left'
	// 		? 'text-left'
	// 		: align === 'right'
	// 			? 'text-right'
	// 			: 'text-center';
	const textAlignClass = 'text-center';

	return (
		<div className={`relative w-full pt-8 ${className} p-20`}>
			{style === 'center' && (
				<svg
					viewBox="0 30 190 170"
					xmlns="http://www.w3.org/2000/svg"
					// className={`h-full w-full ${scale}`}
					className={`xs:max-w-[170px] h-full w-full max-w-[110px] min-w-[110px] ${scale}`}
					aria-labelledby={`${pathId}-title ${pathId}-desc`}
					role="img"
				>
					<title id={`${pathId}-title`}>{title}</title>
					<desc id={`${pathId}-desc`}>{description}</desc>

					<defs>
						{/* The blob shape path (centered with translate) */}
						<path
							id={pathId}
							d="M45.6,-58.7C58.8,-53.1,69,-39.4,70,-25.4C70.9,-11.3,62.5,3.1,57.7,19C52.9,34.8,51.6,52.1,42.6,62.6C33.6,73,16.8,76.7,-0.8,77.8C-18.3,78.9,-36.7,77.3,-51.4,68.7C-66.1,60,-77.2,44.4,-82.8,27C-88.3,9.6,-88.3,-9.6,-80.4,-23.8C-72.6,-38,-56.9,-47.4,-42.2,-52.5C-27.5,-57.6,-13.7,-58.5,1.2,-60.2C16.2,-61.9,32.3,-64.3,45.6,-58.7Z"
							transform="translate(100 100) scale(1.1)"
						/>
						<clipPath id={clipId}>
							<use href={`#${pathId}`} />
						</clipPath>
					</defs>

					{/* Blob fill */}
					<use href={`#${pathId}`} fill={fill} />

					{/* Real HTML text clipped to the blob via foreignObject */}
					<foreignObject clipPath={`url(#${clipId})`} x="15" y="20" width="170" height="160">
						{/* Must set the XHTML namespace inside foreignObject */}
						<div className={`flex h-full w-full ${textAlignClass} items-center justify-center`}>
							<div className="max-w-[120px]">
								<h1 className="mt-1 font-serif text-[12px] leading-tight font-semibold text-green-900">
									{title}
								</h1>
								<p className="mr-2 font-serif text-[7px] leading-snug text-gray-600">
									{description}
								</p>
							</div>
						</div>
					</foreignObject>
				</svg>
			)}
			{style === 'left' && (
				<svg
					viewBox="0 10 210 180"
					xmlns="http://www.w3.org/2000/svg"
					className={`xs:max-w-[170px] h-full w-full max-w-[110px] min-w-[110px] ${scale}`}
					aria-labelledby={`${pathId}-title ${pathId}-desc`}
					role="img"
				>
					<title id={`${pathId}-title`}>{title}</title>
					<desc id={`${pathId}-desc`}>{description}</desc>

					<defs>
						{/* The blob shape path (centered with translate) */}
						<path
							id={pathId}
							// d="M32.6,-39.3C42.2,-30.9,49.8,-20.5,52.9,-8.5C56.1,3.6,54.8,17.3,50.5,33.3C46.1,49.3,38.7,67.6,25.6,73.8C12.6,80,-6.1,74.1,-25,67.7C-43.8,61.2,-62.7,54.2,-74.4,40C-86.1,25.9,-90.5,4.6,-82.9,-10.4C-75.2,-25.4,-55.5,-34,-39.7,-41.3C-23.8,-48.6,-11.9,-54.5,-0.2,-54.3C11.5,-54.1,23.1,-47.7,32.6,-39.3Z"
							d="M48.5,-55.6C64.5,-44.4,80.2,-30.6,85.1,-13.4C90,3.8,84.2,24.5,71.4,36.1C58.6,47.8,38.9,50.3,20.3,58.1C1.7,65.9,-15.9,78.9,-33.4,78.3C-50.9,77.8,-68.4,63.7,-76.7,45.9C-85.1,28.1,-84.3,6.7,-77.8,-10.8C-71.2,-28.3,-58.9,-41.9,-44.9,-53.5C-31,-65.1,-15.5,-74.8,0.4,-75.2C16.3,-75.7,32.5,-66.9,48.5,-55.6Z"
							transform="translate(100 100) scale(1.1)"
						/>
						<clipPath id={clipId}>
							<use href={`#${pathId}`} />
						</clipPath>
					</defs>

					{/* Blob fill */}
					<use href={`#${pathId}`} fill={fill} />

					{/* Real HTML text clipped to the blob via foreignObject */}
					<foreignObject clipPath={`url(#${clipId})`} x="15" y="20" width="170" height="160">
						{/* Must set the XHTML namespace inside foreignObject */}
						<div className={`flex h-full w-full ${textAlignClass} items-center justify-center`}>
							<div className="max-w-[120px]">
								<h1 className="mt-1 font-serif text-[11px] leading-tight font-semibold text-green-900">
									{title}
								</h1>
								<p className="mr-2 font-serif text-[6px] leading-snug text-gray-600">
									{description}
								</p>
							</div>
						</div>
					</foreignObject>
				</svg>
			)}
			{style === 'right' && (
				<svg
					viewBox="0 20 200 180"
					// viewBox="0 0 200 200"
					xmlns="http://www.w3.org/2000/svg"
					// className={`h-full w-full ${scale}`}
					className={`xs:max-w-[170px] h-full w-full max-w-[110px] min-w-[110px] ${scale}`}
					aria-labelledby={`${pathId}-title ${pathId}-desc`}
					role="img"
				>
					<title id={`${pathId}-title`}>{title}</title>
					<desc id={`${pathId}-desc`}>{description}</desc>

					<defs>
						{/* The blob shape path (centered with translate) */}
						<path
							id={pathId}
							d="M54.8,-56.5C70.1,-52.6,80.8,-34.3,82.8,-15.6C84.9,3,78.3,22.2,66.4,34C54.4,45.7,37.1,50,20.1,57C3,64,-13.7,73.8,-31,72.8C-48.3,71.9,-66.3,60.3,-74.6,44C-83,27.7,-81.8,6.7,-74.3,-9.1C-66.7,-25,-52.9,-35.8,-39.5,-40C-26.1,-44.2,-13,-41.9,3.4,-45.9C19.8,-50,39.6,-60.4,54.8,-56.5Z"
							transform="translate(100 100) scale(1.2)"
						/>
						<clipPath id={clipId}>
							<use href={`#${pathId}`} />
						</clipPath>
					</defs>

					{/* Blob fill */}
					<use href={`#${pathId}`} fill={fill} />

					{/* Real HTML text clipped to the blob via foreignObject */}
					<foreignObject clipPath={`url(#${clipId})`} x="0" y="30" width="170" height="160">
						{/* Must set the XHTML namespace inside foreignObject */}
						<div className={`flex h-full w-full ${textAlignClass} items-center justify-center`}>
							<div className="max-w-[120px]">
								<h1 className="mt-1 font-serif text-[12px] leading-tight font-semibold text-green-900">
									{title}
								</h1>
								<p className="mr-2 font-serif text-[7px] leading-snug text-gray-600">
									{description}
								</p>
							</div>
						</div>
					</foreignObject>
				</svg>
			)}

			{/* <svg xmlns="http://www.w3.org/2000/svg" width="222.753" height="201.337" viewBox="0 0 222.753 201.337">
  <path id="blob_1_" data-name="blob (1)" d="M104.788-56.622c20.695,13.348,35,40.343,39.445,68.987C148.817,41.01,143.4,71.3,127.983,90.8,112.427,110.3,87.01,119,62.981,125.6s-46.529,11.1-62.64,2.25-25.7-31.044-40.7-52.79S-75.633,31.712-76.883,9.516-60.216-35.626-39.1-48.823c20.973-13.2,45-16.8,70.557-18.747S84.093-69.819,104.788-56.622Z" transform="translate(76.944 68.561)" fill="#f06"/>
</svg> */}

			{style === 'contact-us' && (
				<svg
					viewBox="10 20 250 230"
					xmlns="http://www.w3.org/2000/svg"
					// className={`h-full w-full ${scale}`}
					className={`xs:max-w-[170px] h-full w-full max-w-[110px] ${scale}`}
					aria-labelledby={`${pathId}-title ${pathId}-desc`}
					role="img"
				>
					<title id={`${pathId}-title`}>{title}</title>
					<desc id={`${pathId}-desc`}>{description}</desc>

					<defs>
						{/* The blob shape path (centered with translate) */}
						<path
							id={pathId}
							// d="M51.2,-59.9C61.5,-52.4,61.6,-31.6,64,-12.1C66.4,7.4,71.3,25.7,65.3,39.4C59.4,53.2,42.7,62.4,25.1,68.6C7.5,74.9,-11,78.1,-25.1,71.8C-39.3,65.5,-49,49.7,-57.2,33.8C-65.4,18,-72,2,-72.4,-15.7C-72.8,-33.5,-66.9,-53.1,-53.8,-60.1C-40.6,-67,-20.3,-61.4,0.1,-61.5C20.5,-61.6,40.9,-67.4,51.2,-59.9Z"
							// d="M53.9,-60.6C68.8,-51.7,79.1,-33.7,82.3,-14.6C85.6,4.5,81.7,24.7,70.6,37.7C59.4,50.7,41.1,56.5,23.8,60.9C6.5,65.3,-9.7,68.3,-21.3,62.4C-32.9,56.5,-39.8,41.7,-50.6,27.2C-61.4,12.7,-76,-1.7,-76.9,-16.5C-77.8,-31.3,-64.9,-46.6,-49.7,-55.4C-34.6,-64.2,-17.3,-66.6,1.1,-67.9C19.5,-69.2,39,-69.4,53.9,-60.6Z"
							// d="M66.842-58.458C83.216-47.164,94.535-24.321,98.051-.083c3.626,24.239-.659,49.873-12.857,66.371C72.886,82.785,52.776,90.146,33.765,95.73s-36.814,9.391-49.561,1.9-20.33-26.269-32.2-44.67S-75.907,16.288-76.9-2.494s13.187-38.2,29.89-49.365C-30.412-63.027-11.4-66.072,8.82-67.722S50.468-69.626,66.842-58.458Z"
							d="M104.788-56.622c20.695,13.348,35,40.343,39.445,68.987C148.817,41.01,143.4,71.3,127.983,90.8,112.427,110.3,87.01,119,62.981,125.6s-46.529,11.1-62.64,2.25-25.7-31.044-40.7-52.79S-75.633,31.712-76.883,9.516-60.216-35.626-39.1-48.823c20.973-13.2,45-16.8,70.557-18.747S84.093-69.819,104.788-56.622Z"
							transform="translate(100 100) scale(1.1)"
						/>
						<clipPath id={clipId}>
							<use href={`#${pathId}`} />
						</clipPath>
					</defs>

					{/* Blob fill */}
					<use href={`#${pathId}`} fill={fill} />

					{/* Real HTML text clipped to the blob via foreignObject */}
					<foreignObject clipPath={`url(#${clipId})`} x="0" y="-10" width="270" height="250">
						{/* Must set the XHTML namespace inside foreignObject */}
						<div
							className={`flex h-full w-full flex-col ${textAlignClass} items-center justify-center`}
						>
							<div className="mt-6 flex h-[40px] w-full">
								{/* <Title
									wrapperClass="h-[60px] !text-3xl mt-1 w-full bg-red-500"
									title={heading ?? 'Contact Us'}
								/> */}
								<h1 className="mt-5 flex w-full items-center justify-center font-serif text-[26px] font-bold text-green-800 lg:mt-8 lg:text-2xl">
									Contact Us
								</h1>
							</div>
							<div className="flex h-full w-full max-w-[200px] flex-col items-center justify-center md:flex-row">
								<h1 className="-mt-14 hidden flex-1 pr-5 text-start font-serif text-[15px] leading-none text-green-900 md:block">
									{title}
								</h1>
								<div className="xs:mt-0 mt-3 w-[100px] flex-1">
									<form
									// onSubmit={onSubmit}
									// className="flex w-[min(90vw,520px)] flex-col gap-3 rounded-2xl bg-white/90 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur"
									>
										<input
											id="name"
											name="name"
											type="email"
											required
											placeholder="Name"
											// className="focus:border-brand-500 focus:ring-brand-200 rounded-lg border border-gray-300 px-3 text-gray-900 outline-none focus:ring-2"
											className="h-[13px] w-[100px] rounded-sm border border-gray-300 pl-1 text-[6px] text-gray-900"
											suppressHydrationWarning
										/>
										<input
											id="email"
											name="email"
											type="email"
											required
											placeholder="Email"
											// className="focus:border-brand-500 focus:ring-brand-200 rounded-lg border border-gray-300 px-3 text-gray-900 outline-none focus:ring-2"
											className="h-[13px] w-[100px] rounded-sm border border-gray-300 pl-1 text-[6px] text-gray-900"
											suppressHydrationWarning
										/>
										<input
											id="phone-number"
											name="phone-number"
											type="number"
											required
											placeholder="Phone Number"
											// className="focus:border-brand-500 focus:ring-brand-200 rounded-lg border border-gray-300 px-3 text-gray-900 outline-none focus:ring-2"
											className="h-[13px] w-[100px] rounded-sm border border-gray-300 pl-1 text-[6px] text-gray-900"
											suppressHydrationWarning
										/>
										<label className="mt-1 flex justify-start text-[6px] text-gray-500">
											Message
										</label>
										<div className="">
											{/* <textarea /> */}
											<textarea
												id="message"
												name="message"
												rows={5}
												required
												placeholder=""
												// className="focus:border-brand-500 focus:ring-brand-200 rounded-lg border border-gray-300 px-3 text-gray-900 outline-none focus:ring-2"
												className="w-[100px] resize-none rounded-sm border border-gray-300 pl-1 text-[6px] text-gray-900"
												suppressHydrationWarning
											/>
										</div>
										<div className="">
											<Button
												text="Submit"
												// onClick={() => router.push(item.href)}
												primaryColor={'bg-yellow-500'}
												secondaryColor={'text-white'}
												borderRadius="rounded-lg"
												size="x-small"
											/>
										</div>
									</form>
								</div>
							</div>
						</div>
					</foreignObject>
				</svg>
			)}
		</div>
	);
};

export default BlobText;

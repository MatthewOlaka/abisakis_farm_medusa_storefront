// src/components/BlobText.tsx
'use client';

import { type FormEvent, useId, useMemo, useState } from 'react';

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
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitState, setSubmitState] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isSubmitting) {
			return;
		}

		setSubmitState(null);
		setIsSubmitting(true);

		try {
			const form = event.currentTarget;
			const values = new FormData(form);
			const fullName = String(values.get('name') ?? '').trim();
			const [firstName = '', ...lastNameParts] = fullName.split(/\s+/);
			const safeFirstName = firstName || 'Guest';
			const safeLastName = lastNameParts.join(' ').trim() || 'N/A';
			const payload = new FormData();

			payload.append('firstName', safeFirstName);
			payload.append('lastName', safeLastName);
			payload.append('email', String(values.get('email') ?? ''));
			payload.append('phone', String(values.get('phone') ?? ''));
			payload.append('message', String(values.get('message') ?? ''));
			payload.append('reason', 'general');
			payload.append('source', 'landing-blob');
			payload.append('hp', String(values.get('hp') ?? ''));

			const response = await fetch('/api/contact', {
				method: 'POST',
				body: payload,
			});

			if (!response.ok) {
				throw new Error('Request failed');
			}

			setSubmitState({
				type: 'success',
				message: 'Thanks! We received your message.',
			});
			form.reset();
		} catch {
			setSubmitState({
				type: 'error',
				message: 'Unable to submit right now. Please try again.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Stable, SSR-safe id for the clipPath (sanitize useId’s colons for url(#...))
	const generatedId = useId();
	const rawId = staticId ?? generatedId;
	const clipId = useMemo(() => `blobClip-${rawId.replace(/:/g, '')}`, [rawId]);
	const pathId = `${clipId}-path`;
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
							className="stroke-yellow-200 stroke-[0.5px]"
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
								<p className="mt-1 mr-2 font-sans text-[5px] leading-snug text-gray-700">
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
							className="stroke-yellow-200 stroke-[0.5px]"
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
							<div className="max-w-[140px]">
								<h1 className="mt-1 font-serif text-[11px] leading-tight font-semibold text-green-900">
									{title}
								</h1>
								<p className="mt-1 mr-2 font-sans text-[5px] leading-snug text-gray-700">
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
							className="stroke-yellow-200 stroke-[0.5px]"
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
							<div className="max-w-[140px]">
								<h1 className="mt-1 font-serif text-[11px] leading-tight font-semibold text-green-900">
									{title}
								</h1>
								<p className="mt-1 font-sans text-[5px] leading-snug text-gray-700">
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
					className="h-full max-h-[800px] w-full min-w-[440px] max-w-[560px] xs:max-w-[680px] scale-150 md:scale-125"
					aria-labelledby={`${pathId}-title ${pathId}-desc`}
					role="img"
				>
					<title id={`${pathId}-title`}>{title}</title>
					<desc id={`${pathId}-desc`}>{description}</desc>

					<defs>
						<path
							id={pathId}
							d="M104.788-56.622c20.695,13.348,35,40.343,39.445,68.987C148.817,41.01,143.4,71.3,127.983,90.8,112.427,110.3,87.01,119,62.981,125.6s-46.529,11.1-62.64,2.25-25.7-31.044-40.7-52.79S-75.633,31.712-76.883,9.516-60.216-35.626-39.1-48.823c20.973-13.2,45-16.8,70.557-18.747S84.093-69.819,104.788-56.622Z"
							transform="translate(100 100) scale(1.1)"
							className="stroke-yellow-200 stroke-[0.5px]"
						/>
						<clipPath id={clipId}>
							<use href={`#${pathId}`} />
						</clipPath>
					</defs>

					<use href={`#${pathId}`} fill={fill} />

					<foreignObject clipPath={`url(#${clipId})`} x="0" y="-10" width="270" height="250">
						<div
							className={`flex h-full w-full flex-col ${textAlignClass} items-center justify-center`}
							style={{ WebkitFontSmoothing: 'antialiased' }}
						>
							<div className="mt-10 xs:mt-9 flex h-[40px] w-full">
								<h1 className="flex w-full items-center justify-center font-serif text-[26px] font-bold text-green-900 lg:text-2xl">
									{heading ?? 'Contact Us'}
								</h1>
							</div>
							<div className="flex h-full w-full max-w-[200px] flex-col items-center justify-center md:flex-row">
								<h1 className="-mt-20 hidden flex-1 pr-5 text-start font-serif text-[15px] leading-none text-green-900 md:block">
									{title}
								</h1>
								{/* <div className="xs:-mt-10 mt-3 w-[100px] flex-1"> */}
								<div className="md:-mt-5 w-[100px] flex-1">
									<form onSubmit={handleContactSubmit}>
										<input
											type="text"
											name="hp"
											autoComplete="off"
											className="hidden"
											tabIndex={-1}
										/>
										<input
											id="name"
											name="name"
											type="text"
											required
											placeholder="Name"
											className="h-[13px] w-[100px] rounded-sm border border-gray-300 pl-1 text-[5px] text-gray-900 caret-gray-400 focus:outline-none focus:border-gray-400 focus:ring-[0.5px] focus:ring-gray-300"
											suppressHydrationWarning
										/>
										<input
											id="email"
											name="email"
											type="email"
											required
											placeholder="Email"
											className="h-[13px] w-[100px] rounded-sm border border-gray-300 pl-1 text-[5px] text-gray-900 caret-gray-400 focus:outline-none focus:border-gray-400 focus:ring-[0.5px] focus:ring-gray-300"
											suppressHydrationWarning
										/>
										<input
											id="phone-number"
											name="phone"
											type="tel"
											required
											placeholder="Phone Number"
											className="h-[13px] w-[100px] rounded-sm border border-gray-300 pl-1 text-[5px] text-gray-900 caret-gray-400 focus:outline-none focus:border-gray-400 focus:ring-[0.5px] focus:ring-gray-300"
											suppressHydrationWarning
										/>
										<div>
											<label className="mt-1 flex justify-start text-[5px] text-gray-500">
												Message
											</label>
											<textarea
												id="message"
												name="message"
												rows={5}
												required
												className="w-[100px] resize-none rounded-sm border border-gray-300 pl-1 text-[5px] text-gray-900 caret-gray-400 focus:outline-none focus:border-gray-400 focus:ring-[0.5px] focus:ring-gray-300"
												suppressHydrationWarning
											/>
										</div>
										<div>
											<button
												type="submit"
												disabled={isSubmitting}
												className="text-[5px] w-full rounded-lg bg-yellow-400 py-1 font-semibold text-green-900 hover:bg-amber-400 disabled:opacity-60"
											>
												{isSubmitting ? 'Sending…' : 'Send message'}
											</button>
										</div>
										{submitState && (
											<p
												className={`mt-1 text-[6px] ${
													submitState.type === 'success' ? 'text-green-700' : 'text-red-700'
												}`}
											>
												{submitState.message}
											</p>
										)}
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

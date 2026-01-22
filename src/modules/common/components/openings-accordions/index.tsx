'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';

type Job = {
	id: string;
	position: string;
	location: string;
	type: string;
	summary?: string;
	description?: string;
	requirements?: string[];
	applyUrl?: string;
};

type Props = {
	jobs: Job[];
	className?: string;
	title?: string;
};

export default function OpeningsAccordions({ jobs, className = '', title = '' }: Props) {
	const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

	const toggle = useCallback((id: string) => {
		setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
	}, []);

	return (
		<section className={`w-full max-w-7xl px-5 md:px-10 ${className}`}>
			{title && (
				<h2 className="mb-6 font-serif text-2xl font-bold text-green-900 md:text-3xl">{title}</h2>
			)}

			{/* Header */}
			<div className="grid grid-cols-12 items-center gap-x-4 rounded-t-xl bg-green-50/40 px-4 py-3 text-xs font-semibold tracking-wide text-green-900 uppercase">
				<div className="col-span-5">Position</div>
				<div className="col-span-3">Location</div>
				<div className="col-span-3">Type</div>
				<div className="col-span-1" aria-hidden />
			</div>

			{/* Body */}
			<div className="overflow-hidden border-t-0 border-b border-green-900/20">
				{jobs.map((job, i) => {
					const isOpen = !!openMap[job.id];
					const rowId = `job-${job.id}`;
					const panelId = `panel-${job.id}`;

					return (
						<div key={job.id} className={i > 0 ? 'border-t border-green-900/10' : ''}>
							{/* Row */}
							<button
								type="button"
								className={`grid w-full ${isOpen ? 'bg-green-700/20' : 'bg-transparent'} grid-cols-12 items-center gap-x-4 px-4 py-4 text-left hover:bg-green-800/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400`}
								aria-expanded={isOpen}
								aria-controls={panelId}
								id={rowId}
								onClick={() => toggle(job.id)}
							>
								<div className="xs:text-base col-span-5 truncate text-sm font-medium text-green-900">
									{job.position}
								</div>
								<div className="xs:text-base col-span-3 truncate text-sm text-green-900/90">
									{job.location}
								</div>
								<div className="xs:text-base col-span-3 truncate text-sm text-green-900/90">
									{job.type}
								</div>

								{/* Arrow */}
								<svg
									className={`col-span-1 h-5 w-5 justify-self-end transition-transform duration-300 ${
										isOpen ? 'rotate-180' : 'rotate-0'
									}`}
									viewBox="0 0 20 20"
									fill="none"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										d="M6 8l4 4 4-4"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>

							{/* Drawer (spans all columns) */}
							<div
								id={panelId}
								role="region"
								aria-labelledby={rowId}
								className={`overflow-hidden transition-[max-height] duration-500 ease-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'} `}
							>
								<div
									className={`grid grid-cols-12 gap-x-4 bg-green-700/20 px-4 pt-1 pb-5 text-sm ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'} transition-all duration-300 ease-out`}
								>
									<div className="col-span-5"></div>
									<div className="col-span-6 text-green-900/90">
										{job.summary && <p className="mb-3 text-green-900">{job.summary}</p>}

										{job.description && <p className="mb-3 leading-relaxed">{job.description}</p>}

										{job.requirements?.length ? (
											<ul className="mb-4 list-disc pl-5 marker:text-yellow-600">
												{job.requirements.map((req, idx) => (
													<li key={idx} className="mb-1">
														{req}
													</li>
												))}
											</ul>
										) : null}

										<Link
											href={`/careers/${job.id}`}
											className="inline-flex items-center gap-2 rounded-lg bg-green-900 px-4 py-2 font-medium text-white transition-colors hover:bg-green-800"
										>
											Apply Now
											<svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
												<path d="M5 10h7.586L10.293 7.707A1 1 0 1 1 11.707 6.293l4 4a1 1 0 0 1 0 1.414l-4 4A1 1 0 1 1 10.293 14.293L12.586 12H5a1 1 0 1 1 0-2z" />
											</svg>
										</Link>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Optional: helper text */}
			{/* <p className="mt-3 text-xs text-green-900/60">Click a row to view details. Multiple rows can be open at once.</p> */}
		</section>
	);
}

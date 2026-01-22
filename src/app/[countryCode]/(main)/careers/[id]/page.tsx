// app/careers/[id]/page.tsx
import { notFound } from 'next/navigation';
import { jobs } from '@modules/common/data/jobs';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import ApplyForm from '@modules/common/components/apply-form';

type IProps = { params: Promise<{ id: string }> };

export default async function JobPage({ params }: IProps) {
	const { id } = await params;
	const job = jobs.find((j) => j.id === id);
	if (!job) return notFound();

	return (
		<main className="px-4 py-10">
			<div className="mx-auto w-full max-w-4xl">
				{/* <a href="/careers" className="text-sm text-green-900 hover:underline">
					← Back to Openings
				</a> */}
				<LocalizedClientLink
					href="/careers"
					className="flex flex-1 basis-0 items-center gap-x-2"
					// className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
					data-testid="back-to-cart-link"
				>
					<span className="hidden small:block text-sm text-green-900 hover:underline decoration-2.5">
						← Back to Openings
					</span>
				</LocalizedClientLink>

				<header className="mt-4 mb-6">
					<h1 className="font-serif text-3xl font-bold text-green-900 md:text-4xl">
						{job.position}
					</h1>
					<p className="mt-2 text-green-900/80">
						{job.location} • {job.type}
					</p>
				</header>

				<section className="prose prose-p:leading-relaxed max-w-none">
					{job.summary && <p className="text-green-900">{job.summary}</p>}
					{job.description && <p className="text-green-900">{job.description}</p>}
					{job.requirements?.length ? (
						<>
							<h3 className="mt-6 text-xl font-semibold text-green-900">Requirements</h3>
							<ul className="list-disc pl-6 text-green-900">
								{job.requirements.map((r, i) => (
									<li key={i}>{r}</li>
								))}
							</ul>
						</>
					) : null}
				</section>

				<hr className="my-8 border-green-900/20" />

				<ApplyForm jobId={job.id} jobTitle={job.position} />
			</div>
		</main>
	);
}

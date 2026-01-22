// components/ApplyForm.tsx
'use client';

import { useState } from 'react';

export default function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
	const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus('submitting');
		const form = e.currentTarget;
		const data = new FormData(form);
		data.set('jobId', jobId);
		data.set('jobTitle', jobTitle);

		try {
			const res = await fetch('/api/apply', { method: 'POST', body: data });
			if (!res.ok) throw new Error('Bad response');
			setStatus('success');
			form.reset();
		} catch {
			setStatus('error');
		}
	}

	return (
		<form
			onSubmit={onSubmit}
			encType="multipart/form-data"
			className="grid grid-cols-1 gap-4 md:grid-cols-2"
		>
			{/* First / Last */}
			<div>
				<label className="block text-sm font-medium text-green-900">First name</label>
				<input
					name="firstName"
					required
					className="mt-1 w-full rounded-lg border border-green-900/30 px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-green-900">Last name</label>
				<input
					name="lastName"
					required
					className="mt-1 w-full rounded-lg border border-green-900/30 px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
				/>
			</div>

			{/* Email / Phone */}
			<div>
				<label className="block text-sm font-medium text-green-900">Email</label>
				<input
					type="email"
					name="email"
					required
					className="mt-1 w-full rounded-lg border border-green-900/30 px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-green-900">Phone number</label>
				<input
					type="tel"
					name="phone"
					required
					className="mt-1 w-full rounded-lg border border-green-900/30 px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
				/>
			</div>

			{/* Resume / Cover letter */}
			<div className="md:col-span-1">
				<label className="block text-sm font-medium text-green-900">Attach resume (PDF/DOC)</label>
				<input
					type="file"
					name="resume"
					required
					accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					className="mt-1 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-green-900 file:px-4 file:py-2 file:text-white hover:file:bg-green-800"
				/>
			</div>
			<div className="md:col-span-1">
				<label className="block text-sm font-medium text-green-900">
					Attach cover letter (PDF/DOC)
				</label>
				<input
					type="file"
					name="coverLetter"
					accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					className="mt-1 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-green-900 file:px-4 file:py-2 file:text-white hover:file:bg-green-800"
				/>
			</div>

			{/* Submit */}
			<div className="xs:mt-20 mt-15 flex flex-col items-center pb-10 md:col-span-2 md:pb-0">
				<button
					type="submit"
					disabled={status === 'submitting'}
					className="w-full max-w-sm rounded-lg bg-yellow-400 px-4 py-3 font-semibold text-green-900 hover:bg-yellow-300 disabled:opacity-60"
				>
					{status === 'submitting' ? 'Submitting…' : 'Submit application'}
				</button>

				{status === 'success' && (
					<p className="text-md mt-2 text-green-700">Thanks! We’ve received your application.</p>
				)}
				{status === 'error' && (
					<p className="mt-2 text-sm text-red-600">Something went wrong. Please try again.</p>
				)}
			</div>
		</form>
	);
}

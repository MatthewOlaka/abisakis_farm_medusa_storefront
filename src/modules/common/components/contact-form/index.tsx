'use client';

import { useState } from 'react';
import Select, { SingleValue } from 'react-select';

type ReasonOption = { value: string; label: string };

const REASONS: ReasonOption[] = [
	{ value: 'general', label: 'General Inquiry' },
	{ value: 'support', label: 'Product Support' },
	{ value: 'partnership', label: 'Partnerships' },
	{ value: 'careers', label: 'Careers' },
	{ value: 'press', label: 'Press' },
];

export default function ContactForm() {
	const [reason, setReason] = useState<ReasonOption | null>(null);
	const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus('submitting');

		const form = e.currentTarget;
		const data = new FormData(form);
		data.set('reason', reason?.value || '');

		try {
			// Send to an API route you control
			const res = await fetch('/api/contact', {
				method: 'POST',
				body: data,
			});
			if (!res.ok) throw new Error('Bad response');
			setStatus('success');
			form.reset();
			setReason(null);
		} catch {
			setStatus('error');
		}
	}

	return (
		<form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
			{/* First / Last names inline on md+ */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label className="block text-sm font-medium text-white">First name</label>
					<input
						name="firstName"
						required
						autoComplete="given-name"
						className="mt-1 w-full rounded-lg border border-white bg-white px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-white">Last name</label>
					<input
						name="lastName"
						required
						autoComplete="family-name"
						className="mt-1 w-full rounded-lg border border-white bg-white px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label className="block text-sm font-medium text-white">Email</label>
					<input
						type="email"
						name="email"
						required
						autoComplete="email"
						className="mt-1 w-full rounded-lg border border-white bg-white px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-white">Phone number</label>
					<input
						type="tel"
						name="phone"
						autoComplete="tel"
						className="mt-1 w-full rounded-lg border border-white bg-white px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
					/>
				</div>
			</div>

			{/* Reason (react-select) */}
			<div>
				<label className="block text-sm font-medium text-white">Reason</label>
				<Select<ReasonOption, false>
					instanceId="contact-reason"
					options={REASONS}
					value={reason}
					onChange={(opt: SingleValue<ReasonOption>) => setReason(opt ?? null)}
					placeholder="Choose a reason…"
					unstyled
					classNames={{
						control: ({ isFocused }) =>
							[
								'mt-1 rounded-lg border px-2',
								'border-white bg-white',
								'min-h-[40px]',
								isFocused ? 'ring-2 ring-yellow-400' : 'ring-0',
							].join(' '),
						valueContainer: () => 'px-1 py-1',
						placeholder: () => 'text-green-900/60',
						singleValue: () => 'text-green-900',
						indicatorsContainer: () => 'pr-2',
						indicatorSeparator: () => 'hidden',
						dropdownIndicator: ({ isFocused }) =>
							['text-green-900', isFocused ? 'opacity-100' : 'opacity-70'].join(' '),
						menu: () =>
							'mt-1 overflow-hidden rounded-md border border-green-900/20 bg-white shadow-lg',
						option: ({ isFocused, isSelected }) =>
							[
								'px-3 py-2 cursor-pointer',
								isSelected ? 'bg-yellow-200 text-green-900' : '',
								!isSelected && isFocused ? 'bg-yellow-50' : '',
								'text-green-900',
							].join(' '),
						noOptionsMessage: () => 'px-3 py-2 text-sm text-green-900/60',
					}}
				/>
			</div>

			{/* Message */}
			<div>
				<label className="block text-sm font-medium text-white">Message</label>
				<textarea
					name="message"
					rows={6}
					required
					className="mt-1 w-full rounded-lg border border-white bg-white px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
					placeholder="How can we help?"
				/>
			</div>

			{/* Submit */}
			<div className="pt-1">
				<button
					type="submit"
					disabled={status === 'submitting'}
					className="w-full rounded-lg bg-yellow-400 px-4 py-3 font-semibold text-green-900 hover:bg-yellow-300 disabled:opacity-60"
				>
					{status === 'submitting' ? 'Sending…' : 'Send message'}
				</button>
				{status === 'success' && (
					<p className="mt-2 text-sm text-green-700">Thanks! Your message has been sent.</p>
				)}
				{status === 'error' && (
					<p className="mt-2 text-sm text-red-600">Something went wrong. Please try again.</p>
				)}
			</div>
		</form>
	);
}

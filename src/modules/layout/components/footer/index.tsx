'use client';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@modules/common/components/button';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
// import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LogoLink from '../nav-bar/logo-link';
import { Spinner } from '@lib/components/ui/spinner';
import AlertDialog from '@modules/generic/alert-modal';

const Footer = () => {
	const [showForm, setShowForm] = useState(false);
	const router = useRouter();
	// const [email, setEmail] = useState('');
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const [dialog, setDialog] = useState<{
		open: boolean;
		variant: 'success' | 'error';
		title: string;
		desc?: string;
	}>({
		open: false,
		variant: 'success',
		title: '',
		desc: '',
	});

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus('loading');

		const form = e.currentTarget;
		const fd = new FormData(form);
		const email = String(fd.get('email') || '').trim();
		const hp = String(fd.get('hp') || ''); // honeypot

		if (!email || hp) {
			setStatus('idle');
			return;
		}

		try {
			const res = await fetch('/api/newsletter', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ email, source: 'footer' }),
			});

			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				throw new Error(j?.error || 'Unable to subscribe.');
			}

			setStatus('success');
			setDialog({
				open: true,
				variant: 'success',
				title: '🎉 You’re subscribed! 🎉',
				desc: 'You’re on the list! Expect occasional notes with fresh harvest news, new product drops, early access to specials, and simple recipes from the farm kitchen. No spam - unsubscribe anytime.',
			});

			form.reset(); // clear the input
			setShowForm(false); // collapse the inline form (optional)
		} catch (err: any) {
			setStatus('error');
			setDialog({
				open: true,
				variant: 'error',
				title: 'Subscription failed! 🙁',
				desc:
					err?.message ??
					'Please try submit your email again. If this issue persists, kindly reach out via the contact us page below',
			});
		}
	}

	return (
		<footer className="w-full overflow-x-hidden bg-green-900">
			<div className="mx-auto flex max-w-7xl flex-col" style={{ minHeight: '480px' }}>
				{/* Section 1: Subscription (top section) */}
				<section className="flex items-center justify-center px-7 py-6">
					<div className="flex w-full max-w-7xl flex-col items-center justify-center px-5 md:flex-row md:justify-between">
						<div className="pb-5 md:pb-0">
							<h1 className="pointer-events-none flex items-start text-center font-serif text-2xl font-bold text-white">
								Join our growing farm family
							</h1>
							<h1 className="text-md pointer-events-none text-center font-serif font-bold text-white">
								Subscribe for up to date farm stories and news.
							</h1>
						</div>
						<div className="relative">
							<div
								className={[
									'relative overflow-hidden',
									'transition-[width,height] duration-500 ease-[cubic-bezier(.2,.6,.2,1)]',
									showForm ? 'h-[44px] w-[350px]' : 'h-[44px] w-[280px]',
								].join(' ')}
							>
								{/* BUTTON STATE */}
								<button
									onClick={() => setShowForm(true)}
									className={[
										'absolute inset-0 flex items-center justify-center text-center',
										'rounded-lg border bg-green-900 px-6 font-sans text-sm font-semibold text-yellow-500 shadow-lg ring-1 ring-black/5 backdrop-blur',
										'transition-all duration-300',
										showForm
											? 'pointer-events-none scale-95 opacity-0'
											: 'scale-100 opacity-100 hover:bg-white hover:text-green-900',
									].join(' ')}
								>
									Subscribe To Our Newsletter
								</button>
								{/* INLINE INPUT STATE */}
								<form
									onSubmit={onSubmit}
									className={[
										'absolute inset-0 flex items-center justify-end transition-all duration-300',
										showForm
											? 'translate-y-0 opacity-100'
											: 'pointer-events-none translate-y-1 opacity-0',
									].join(' ')}
								>
									{/* Honeypot - hidden from users, bots often fill it */}
									<input
										tabIndex={-1}
										autoComplete="off"
										name="hp"
										aria-hidden="true"
										className="hidden"
									/>

									<div className="flex h-[44px] w-dvw items-center justify-center rounded-sm border border-white/70 bg-white px-1 shadow-lg ring-1 ring-black/5 backdrop-blur md:max-w-[350px] md:justify-end">
										<input
											name="email"
											type="email"
											required
											placeholder="Enter your email"
											className="flex-1 bg-white px-3 text-sm text-gray-800 placeholder-gray-800 outline-none"
										/>
										<button
											type="submit"
											aria-label="Subscribe"
											className="ml-2 inline-flex h-[36px] items-center justify-center rounded-sm border-2 px-3 text-sm font-semibold text-gray-800 transition hover:border-yellow-500 hover:bg-yellow-500 hover:text-green-800"
											disabled={status === 'loading'}
										>
											{status === 'loading' ? (
												<Spinner className="text-amber-600" />
											) : (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
												</svg>
											)}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</section>

				{/* Divider */}
				<div className="flex w-full justify-center">
					<hr className="w-11/12 border-gray-400" />
				</div>

				{/* Section 2: Main content (largest section) */}
				<section className="flex flex-1 flex-col items-center justify-between px-12 py-8 md:flex-row">
					<div className="flex flex-col items-center gap-2 md:items-start">
						{/* <div className="relative h-20 w-28 md:h-25 md:w-35">
							<Image
								src="/images/logo.png"
								alt="Abisaki's Farm"
								fill
								className="object-cover"
								onError={(e) => {
									(e.target as HTMLImageElement).style.display = 'none';
								}}
							/>
						</div> */}
						<LogoLink wrapperClassname="h-20 w-28 md:h-28 md:w-44" />
						<h2 className="pointer-events-none text-center font-serif text-lg text-white">
							Where soil meets soul
						</h2>
						<h1 className="pointer-events-none text-center font-serif text-2xl text-white">
							Nurturing life with every season
						</h1>
					</div>
					<div className="mt-6 flex gap-10 text-white md:mt-0">
						<div className="flex flex-col gap-2">
							<h2 className="pointer-events-none pb-1 font-serif text-xl font-bold text-yellow-500">
								Quick Links
							</h2>
							<LocalizedClientLink href="/" className="cursor-pointer font-sans text-sm">
								About Us
							</LocalizedClientLink>
							<LocalizedClientLink
								className="cursor-pointer font-sans text-sm"
								href="/products/honey"
							>
								Honey
							</LocalizedClientLink>
							<LocalizedClientLink
								className="cursor-pointer font-sans text-sm"
								href="/products/coffee"
							>
								Coffee
							</LocalizedClientLink>
							<LocalizedClientLink className="cursor-pointer font-sans text-sm" href="/team">
								Team
							</LocalizedClientLink>
							<LocalizedClientLink className="cursor-pointer font-sans text-sm" href="/contact">
								Contact Us
							</LocalizedClientLink>
							<div className="pt-2">
								<Button
									text="SHOP"
									onClick={() => router.push('/shop')}
									primaryColor={'bg-yellow-500'}
									secondaryColor={'text-white'}
									borderRadius="rounded-lg"
									size="small"
								/>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<h2 className="pointer-events-none pb-1 font-serif text-xl font-bold text-yellow-500">
								Information
							</h2>
							<LocalizedClientLink
								className="cursor-pointer font-sans text-sm"
								href="/products/honey"
							>
								Terms of Service
							</LocalizedClientLink>
							<LocalizedClientLink
								className="cursor-pointer font-sans text-sm"
								href="/products/coffee"
							>
								Privacy Policy
							</LocalizedClientLink>
							<LocalizedClientLink className="cursor-pointer font-sans text-sm" href="/careers">
								Careers
							</LocalizedClientLink>
						</div>
					</div>
				</section>

				{/* Divider */}
				<div className="flex w-full justify-center">
					<hr className="w-11/12 border-gray-400" />
				</div>

				{/* Section 3: Bottom (small section ~15% of total height) */}
				<section
					className="flex items-center justify-between px-12 py-4 pb-8"
					style={{ minHeight: '15%' }}
				>
					<p className="xs:text-sm text-xs text-white">
						YDH Coffee Estate © 2020. All rights reserved.
					</p>
					<div className="flex gap-2">
						<a
							href="https://www.instagram.com/"
							target="_blank"
							rel="noreferrer"
							aria-label="Instagram"
						>
							<FontAwesomeIcon
								icon={faInstagram}
								className="text-2xl text-white transition-all duration-300 hover:scale-110 hover:text-purple-500"
							/>
						</a>
						<a
							href="https://www.facebook.com/"
							target="_blank"
							rel="noreferrer"
							aria-label="Facebook"
						>
							<FontAwesomeIcon
								icon={faFacebook}
								className="text-2xl text-white transition-all duration-300 hover:scale-110 hover:text-blue-600"
							/>
						</a>
						<a
							href="https://www.instagram.com/"
							target="_blank"
							rel="noreferrer"
							aria-label="Envelope"
						>
							<FontAwesomeIcon
								icon={faEnvelope}
								className="text-2xl text-white transition-all duration-300 hover:scale-110 hover:text-red-700"
							/>
						</a>
						<a
							href="https://www.instagram.com/"
							target="_blank"
							rel="noreferrer"
							aria-label="Phone"
						>
							<FontAwesomeIcon
								icon={faPhone}
								className="text-2xl text-white transition-all duration-300 hover:scale-110 hover:text-yellow-400"
							/>
						</a>
					</div>
				</section>
			</div>
			<AlertDialog
				open={dialog.open}
				onOpenChange={(v) => setDialog((d) => ({ ...d, open: v }))}
				variant={dialog.variant}
				title={dialog.title}
				description={dialog.desc}
				primary={{ label: 'Close', onClick: () => setDialog((d) => ({ ...d, open: false })) }}
			/>
		</footer>
	);
};

export default Footer;

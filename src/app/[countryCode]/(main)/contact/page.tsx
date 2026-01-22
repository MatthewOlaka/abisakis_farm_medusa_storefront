import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContactForm from '@modules/common/components/contact-form';
import MapCard from '@modules/common/components/map-card';
import Image from 'next/image';

export default function ContactPage() {
	return (
		<main className="xs:px-15 px-5 py-10">
			<div className="mx-auto w-full max-w-6xl">
				<header className="mb-16 text-center">
					<div className="flex w-full flex-col items-center justify-center text-center">
						<h1 className="xs:text-6xl font-serif text-5xl font-bold text-green-900 md:text-7xl">
							Contact Us
						</h1>
						<p className="max-w-[800px] px-5 pt-5 font-sans text-sm text-green-900 md:text-lg">
							We would love to hear from you! Whether you have questions about our products, need
							assistance, or want to provide feedback, our team is here.
						</p>
					</div>
				</header>

				{/* Top two-column section */}
				<div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-8">
					{/* Left: form (stretches to the tallest content) */}
					<div className="h-full">
						<div className="h-full rounded-md border border-green-900/20 bg-green-900 p-5 md:p-6">
							<ContactForm />
						</div>
					</div>

					{/* Right: image (matches form height because they share the same grid row) */}
					<div className="relative h-[280px] overflow-hidden rounded-md border border-green-900/20 md:h-auto">
						<Image
							src="/images/contact.jpg" // <-- replace with your actual image
							alt="Our office"
							fill
							className="object-cover"
							priority
						/>
						<div
							className={[
								'pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-500',
								'[background:radial-gradient(140%_90%_at_0%_100%,rgba(0,0,0,.28))]',
							].join(' ')}
						/>
						{/* 2 x 2 overlay grid */}
						<div className="absolute inset-0 z-20 grid grid-cols-2 grid-rows-2 items-center justify-items-center gap-4 p-4">
							{/* Email */}
							<a
								href="mailto:info@abisakisfarm.com?subject=Website%20inquiry"
								className="group flex h-full max-h-[200px] w-full max-w-[200px] flex-col items-center justify-center rounded-2xl bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-sm transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
								aria-label="Email us at info@abisakisfarm.com"
								title="Email Address"
								target="_blank"
							>
								<FontAwesomeIcon
									icon={faEnvelope}
									className="text-5xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-500"
								/>
								<h1 className="md:text-md mt-2 font-sans text-sm font-bold text-white">
									Email Address
								</h1>
								<h2 className="font-sans text-xs text-white md:text-sm">info@abisakisfarm.com</h2>
							</a>

							{/* Phone */}
							<a
								href="tel:+254712345678"
								className="group flex h-full max-h-[200px] w-full max-w-[200px] flex-col items-center justify-center rounded-2xl bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-sm transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
								aria-label="Call us at +254 712 345 678"
								title="Phone Number"
								target="_blank"
							>
								<FontAwesomeIcon
									icon={faPhone}
									className="text-5xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-500"
								/>
								<h1 className="md:text-md mt-2 font-sans text-sm font-bold text-white">
									Phone Number
								</h1>
								<h2 className="font-sans text-xs text-white md:text-sm">+254 712 345 678</h2>
							</a>

							{/* WhatsApp */}
							<a
								href="https://wa.me/254712345688?text=Hi%20Abisaki%27s%20Farm%2C%20I%27d%20love%20to%20chat!"
								target="_blank"
								rel="noopener noreferrer"
								className="group flex h-full max-h-[200px] w-full max-w-[200px] flex-col items-center justify-center rounded-2xl bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-sm transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
								aria-label="Chat with us on WhatsApp"
								title="WhatsApp"
							>
								<FontAwesomeIcon
									icon={faWhatsapp}
									className="text-5xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-500"
								/>
								<h1 className="md:text-md mt-2 font-sans text-sm font-bold text-white">WhatsApp</h1>
								<h2 className="font-sans text-xs text-white md:text-sm">+254 712 345 688</h2>
							</a>

							{/* Location */}
							<a
								href="https://maps.app.goo.gl/uQjiEDzP8T1LzmiJ6"
								target="_blank"
								rel="noopener noreferrer"
								className="group flex h-full max-h-[200px] w-full max-w-[200px] flex-col items-center justify-center rounded-2xl bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-sm transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
								aria-label="Open our location in Google Maps"
								title="Location"
							>
								<FontAwesomeIcon
									icon={faLocationDot}
									className="text-5xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-500"
								/>
								<h1 className="md:text-md mt-2 font-sans text-sm font-bold text-white">Location</h1>
								<h2 className="font-sans text-xs text-white md:text-sm">Kitale, Kenya</h2>
							</a>
						</div>
					</div>

					{/* Bottom: full-width map spanning both columns */}
					{/* <div className="mt-2 md:col-span-2">
						<div className="relative max-h-[250px] w-full overflow-hidden rounded-xl border-2 border-yellow-500/90">
							<div className="relative aspect-[16/9] w-full">
								<iframe
									className="absolute inset-0 h-full max-h-[250px] w-full"
									// Replace 'Your+Address+Here' with your real address/search query
									src="https://www.google.com/maps?q=Your+Address+Here&output=embed"
									loading="lazy"
								/>
							</div>
						</div>
					</div> */}
					<div className="mt-2 rounded-2xl border-3 border-yellow-500 md:col-span-2">
						{/* Add multiple estate markers with quick info cards */}
						<MapCard
							center={{ lat: 0.9941949, lng: 35.1327557 }}
							zoom={17}
							markerTitle="YDH Coffee Estate"
							// className="h-[360px] md:h-[460px]" // optional responsive height
							className="h-[260px]" // optional responsive height
							perimeter={[
								{ lat: 0.9966, lng: 35.1323 },
								{ lat: 0.997, lng: 35.1337 },
								{ lat: 0.9918, lng: 35.1339 },
								{ lat: 0.9915, lng: 35.1312 },
							]}
							markers={[
								{
									title: 'Bee hives',
									position: { lat: 0.996162, lng: 35.132909 },
									description: '50 colonized bee hives',
									imageSrc: '/images/YDcoffeeBag2.png',
								},
								{
									title: 'Cluster 1',
									position: { lat: 0.995779, lng: 35.132868 },
									description: 'Processing, roasting',
									imageSrc: '/images/YDcoffeeBag2.png',
								},
								{
									title: 'Factory',
									position: { lat: 0.994905, lng: 35.13232 },
									description: 'Processing, roasting, and packaging hub.',
									imageSrc: '/images/YDcoffeeBag2.png',
								},
								{
									title: 'Poultry housing',
									position: { lat: 0.994767, lng: 35.13215 },
									description: 'Processing, roasting, and packaging hub.',
									imageSrc: '/images/YDcoffeeBag2.png',
								},
								{
									title: 'Villa',
									position: { lat: 0.995179, lng: 35.132842 },
									description: 'Processing, roasting, and packaging hub.',
									imageSrc: '/images/YDcoffeeBag2.png',
								},
								{
									title: 'Avocado trees',
									position: { lat: 0.9947, lng: 35.132845 },
									description: 'Processing, roasting, and packaging hub.',
									imageSrc: '/images/YDcoffeeBag2.png',
								},
								{
									title: 'Cluster 2',
									position: { lat: 0.995274, lng: 35.133355 },
									description: 'Processing, roasting, and packaging hub.',
									imageSrc: '/images/YDcoffeeBag2.png',
								},
								{
									title: 'Cluster 3',
									position: { lat: 0.993779, lng: 35.132706 },
									description: 'Processing, roasting, and packaging hub.',
									imageSrc: '/images/YDcoffeeBag2.png',
								},
								{
									title: 'Cluster 4',
									position: { lat: 0.992103, lng: 35.132579 },
									description: 'Processing, roasting, and packaging hub.',
									imageSrc: '/images/YDcoffeeBag2.png',
								},
							]}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}

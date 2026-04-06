import { getBaseURL } from '@lib/util/env';

/**
 * Organization JSON-LD structured data for Google/AI rich results.
 * Renders in the root layout so every page inherits it.
 */
export default function OrganizationJsonLd() {
	const baseUrl = getBaseURL();

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: "Abisaki's Farm",
		url: baseUrl,
		logo: `${baseUrl}/images/logo.png`,
		description: 'Pure Kenyan honey, artisan coffee, and farm-fresh products.',
		contactPoint: {
			'@type': 'ContactPoint',
			email: 'info@abisakisfarm.com',
			contactType: 'customer service',
		},
		sameAs: [],
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}

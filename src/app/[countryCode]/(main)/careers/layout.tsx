import { Metadata } from 'next';

export const metadata: Metadata = {
	title: "Careers | Abisaki's Farm",
	description:
		"Explore exciting career opportunities at Abisaki's Farm. Join our team and help bring the finest Kenyan honey and coffee to the world.",
	openGraph: {
		title: "Careers | Abisaki's Farm",
		description: "Join the Abisaki's Farm team — explore open positions.",
	},
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
	return children;
}

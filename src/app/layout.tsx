import { getBaseURL } from '@lib/util/env';
import { Metadata } from 'next';
import { Inter, Judson } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const judson = Judson({
	subsets: ['latin'],
	weight: ['400', '700'],
	variable: '--font-judson',
	display: 'swap',
});

export const metadata: Metadata = {
	title: "Abisaki's Farm",
	description: 'Pure Kenyan honey, coffee, and more.',
	metadataBase: new URL(getBaseURL()),
};

export default function RootLayout(props: { children: React.ReactNode }) {
	return (
		<html lang="en" data-mode="light" className={`${inter.variable} ${judson.variable}`}>
			<body>
				<main className="relative">{props.children}</main>
			</body>
		</html>
	);
}

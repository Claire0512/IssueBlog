import type { ReactNode } from 'react';

import { getServerSession } from 'next-auth/next';
import { Inter } from 'next/font/google';

import Provider from '@/src/app/context/client-provider';

import { options } from './api/auth/[...nextauth]/options';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	description:
		'A personal blog system built on GitHub Issues, featuring GitHub OAuth for authentication and GitHub API for post management. Utilizes modern front-end technologies including Next.js, TypeScript, and TailwindCSS for a responsive and user-friendly interface.',
	title: 'DINU Blog - A GitHub Issues Based Blogging Platform',
};

async function RootLayout({ children }: { children: ReactNode }) {
	const session = await getServerSession(options);
	return (
		<html lang="en">
			<body className={`${inter.className} min-h-screen bg-gray-100`}>
				<Provider session={session}>{children}</Provider>
			</body>
		</html>
	);
}

export default RootLayout;

import type { ReactNode } from 'react';

import Navbar from '@/src/components/Navbar';

function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col bg-[#F9F1E0]">
			<Navbar />
			{children}
		</div>
	);
}

export default Layout;

import { ReactNode } from 'react';

import Navbar from '@/src/components/Navbar';

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="min-h-screen bg-[#F9F1E0]">
			<Navbar />
			<main>{children}</main>
		</div>
	);
};

export default Layout;

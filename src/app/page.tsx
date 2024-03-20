import Link from 'next/link';

import SignInButton from '@/src/components/SignInButton';

function HomePage() {
	return (
		<div className="flex min-h-screen items-center justify-center border-[80px] border-[#FAC13E] bg-[#F9F1E0] p-4">
			<div className=" mx-auto flex max-w-screen-lg flex-col items-center p-4">
				<h1 className="mb-8 text-center text-[128px] font-extrabold text-[#412517]">
					DINU's Blog
				</h1>
				<Link
					href="/home"
					className="rounded-[25px] bg-[#412517] px-10 py-2 text-[32px] text-[#F9F1E0]"
				>
					View
				</Link>
				<SignInButton />
			</div>
		</div>
	);
}

export default HomePage;

'use client';

import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { buttonVariants } from '@/src/components/ui/button';
import { Button } from '@/src/components/ui/button';

function Navbar() {
	const { data: session } = useSession();
	return (
		<nav className="flex h-[100px] items-center justify-between bg-[#FAC13E] px-6">
			<h1 className="px-16 text-[36px] font-bold text-[#412517]">DINU's Blog</h1>
			<div>
				<Link
					href="/home"
					className={`text-[28px] font-semibold text-[#412517] ${buttonVariants({ variant: 'ghost' })}`}
				>
					Home
				</Link>
				<Link
					href="/post"
					className={`text-[28px] font-semibold text-[#412517] ${buttonVariants({ variant: 'ghost' })}`}
				>
					Post
				</Link>
				{session ? (
					<Link
						href="/profile"
						className={`text-[28px] font-semibold text-[#412517] ${buttonVariants({ variant: 'ghost' })}`}
					>
						Profile
					</Link>
				) : (
					<Button
						variant="ghost"
						className="text-[28px] font-semibold text-[#412517] "
						onClick={() => signIn('github', { callbackUrl: '/profile' })}
					>
						Login
					</Button>
				)}
			</div>
		</nav>
	);
}

export default Navbar;

'use client';

import { signOut } from 'next-auth/react';

import { Button } from '@/src/components/ui/button';

function SignOutButton() {
	return (
		<div className="flex justify-center">
			<Button
				variant="outline"
				onClick={() => signOut({ callbackUrl: '/' })}
				className="bg-white px-10 py-5 text-2xl hover:bg-gray-200"
			>
				Sign Out
			</Button>
		</div>
	);
}

export default SignOutButton;

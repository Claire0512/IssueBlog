'use client';

import { signIn } from 'next-auth/react';

import { GitHubLogoIcon } from '@radix-ui/react-icons';

import { Button } from '@/src/components/ui/button';

function SignInButton() {
	return (
		<div className="flex justify-center">
			<Button
				variant="outline"
				onClick={() => signIn('github', { callbackUrl: '/profile' })}
				className="bg-white px-10 py-10 text-2xl hover:bg-gray-200"
			>
				<GitHubLogoIcon className="mr-5 h-10 w-10" />
				Sign In With GitHub
			</Button>
		</div>
	);
}

export default SignInButton;

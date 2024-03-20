'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

import SignOutButton from '@/src/components/SignOutButton';
import { fetchGithubData } from '@/src/lib/actions';

function ProfilePage() {
	const [githubData, setGithubData] = useState({
		issuesCount: 0,
		commentsCount: 0,
		reactionsCount: 0,
	});

	const { data: session, status } = useSession();

	useEffect(() => {
		const fetchData = async () => {
			const githubData = await fetchGithubData();
			setGithubData(githubData);
		};
		fetchData();
	}, [session, status]);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div>
				<h1 className="text-center text-7xl">Profile</h1>
				<div className="mt-8 text-center">
					{session?.user?.name && <h2 className="text-4xl">{session.user.name}</h2>}
					{session?.user?.image && (
						<div className="flex justify-center">
							<Image
								src={session.user.image}
								width={200}
								height={200}
								alt={`Profile Pic for ${session.user.name}`}
								priority={true}
								className="mt-8 rounded-full"
							/>
						</div>
					)}
				</div>
				<div className="mt-8 text-center">
					<p>Issues Published: {githubData.issuesCount}</p>
					<p>Total Comments on Issues: {githubData.commentsCount}</p>
					<p>Total Reactions on Issues: {githubData.reactionsCount}</p>
				</div>
				<div className="mt-8 flex justify-center">
					<SignOutButton />
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;

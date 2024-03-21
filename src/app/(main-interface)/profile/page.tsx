'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
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
		<div className="flex flex-1 justify-center pt-32">
			<div className="w-full">
				<div className="mt-8 text-center">
					{session?.user?.image && (
						<div className="flex justify-center">
							<Image
								src={session.user.image}
								width={180}
								height={180}
								alt={`Profile Pic for ${session.user.name}`}
								priority={true}
								className="mt-8 rounded-full"
							/>
						</div>
					)}
					{session?.user?.name && (
						<h2 className="mt-8 text-center text-4xl text-[#412517]">
							{session.user.name}
						</h2>
					)}
				</div>
				<div className="mt-8 flex w-full items-center justify-center gap-4">
					<Card className="w-[14%]">
						<CardContent className="rounded-xl bg-white">
							<CardHeader className="text-center text-2xl text-[#412517]">
								Post
							</CardHeader>
							<p className="text-bold text-center text-4xl">
								{githubData.issuesCount}
							</p>
						</CardContent>
					</Card>
					<Card className="w-[14%]">
						<CardContent className="rounded-xl bg-white">
							<CardHeader className="text-center text-2xl text-[#412517]">
								Comments
							</CardHeader>
							<p className="text-bold text-center text-4xl">
								{githubData.commentsCount}
							</p>
						</CardContent>
					</Card>
					<Card className="w-[14%]">
						<CardContent className="rounded-xl bg-white">
							<CardHeader className="text-center text-2xl text-[#412517]">
								Reactions
							</CardHeader>
							<p className="text-bold text-center text-4xl">
								{githubData.reactionsCount}
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;

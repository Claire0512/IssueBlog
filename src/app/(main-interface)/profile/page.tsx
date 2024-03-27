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
		<div className="flex h-full w-full flex-1 items-center justify-center pt-20">
			<div className="h-full w-full">
				<div className="text-center">
					{session?.user?.image && (
						<div className="flex justify-center">
							<Image
								src={session.user.image}
								width={150}
								height={150}
								alt={`Profile Pic for ${session.user.name}`}
								priority={true}
								className="rounded-full"
							/>
						</div>
					)}
					{session?.user?.name && (
						<h2 className="mt-8 text-center text-3xl text-[#412517]">
							{session.user.name}
						</h2>
					)}
				</div>
				{session?.username === process.env.NEXT_PUBLIC_USER_NAME && (
					<div className="mt-8 flex w-full items-center justify-center gap-4">
						<Card className="w-[14%]">
							<CardContent className="rounded-xl border-l-[16px] border-[#FAC13E] bg-white">
								<CardHeader className="text-center text-xl text-[#412517]">
									發布的文章
								</CardHeader>
								<p className="text-bold text-center text-2xl text-[#412517]">
									{githubData.issuesCount} 則
								</p>
							</CardContent>
						</Card>
						<Card className="w-[14%]">
							<CardContent className="rounded-xl border-l-[16px] border-[#FAC13E] bg-white">
								<CardHeader className="text-center text-xl text-[#412517]">
									文章被留言
								</CardHeader>
								<p className="text-bold text-center text-2xl">
									{githubData.commentsCount} 次
								</p>
							</CardContent>
						</Card>
						<Card className="w-[14%]">
							<CardContent className="rounded-xl border-l-[16px] border-[#FAC13E] bg-white">
								<CardHeader className="text-center text-xl text-[#412517]">
									獲得的表情
								</CardHeader>
								<p className="text-bold text-center text-2xl">
									{githubData.reactionsCount} 個
								</p>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
}

export default ProfilePage;

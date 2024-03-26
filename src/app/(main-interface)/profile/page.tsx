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
				<div className="text-center">
					{session?.user?.image && (
						<div className="flex justify-center">
							<Image
								src={session.user.image}
								width={100}
								height={100}
								alt={`Profile Pic for ${session.user.name}`}
								priority={true}
								className="mt-8 rounded-full"
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

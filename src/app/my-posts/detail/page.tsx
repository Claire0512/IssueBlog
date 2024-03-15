'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { fetchIssueDetails } from '@/src/lib/actions';
import type { IssueDetailsData, CustomSession, ReactionData } from '@/src/lib/type';

function IssueDetailsPage() {
	const { data: session } = useSession();
	const searchParams = useSearchParams();

	const issueId = searchParams.get('issueId');
	const repoName = searchParams.get('repoName');
	const repoOwner = searchParams.get('repoOwner');

	const [issueDetails, setIssueDetails] = useState<IssueDetailsData | null>(null);

	useEffect(() => {
		const fetchDetails = async () => {
			if (session && issueId) {
				const details = await fetchIssueDetails(
					session as CustomSession,
					repoName ?? '',
					repoOwner ?? '',
					parseInt(issueId as string, 10),
				);
				setIssueDetails(details);
			}
		};
		fetchDetails();
	}, [session, issueId]);

	const reactionEmojis: { [key: string]: string } = {
		'+1': '👍',
		'-1': '👎',
		laugh: '😄',
		hooray: '🎉',
		confused: '😕',
		heart: '❤️',
		rocket: '🚀',
		eyes: '👀',
	};

	if (!issueDetails) return <div>Loading...</div>;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold">{issueDetails.title}</h1>
			<div className="mt-4">
				<Image
					src={issueDetails.avatarUrl}
					alt="Author's avatar"
					width={50}
					height={50}
					className="rounded-full"
				/>
				<p>Author: {issueDetails.userName}</p>
			</div>
			<p className="mt-4">{issueDetails.content}</p>

			<div className="mt-4">
				{Object.entries(issueDetails.reactions).map(([key, value]) => {
					if (key in reactionEmojis && typeof value === 'number' && value > 0) {
						return (
							<span key={key} className="mr-2">
								{reactionEmojis[key]} {value}
							</span>
						);
					}
					return null;
				})}
			</div>

			<h2 className="mb-4 mt-8 text-xl font-bold">Comments</h2>
			{issueDetails.comments.map((comment) => (
				<div key={comment.id} className="mb-4 rounded-lg border p-4">
					<div className="flex items-center">
						<Image
							src={comment.user.avatarUrl}
							alt="Commenter's avatar"
							width={40}
							height={40}
							className="rounded-full"
						/>
						<span className="ml-2">{comment.user.login}</span>
					</div>
					<p className="mt-2">{comment.body}</p>
				</div>
			))}
		</div>
	);
}

export default IssueDetailsPage;

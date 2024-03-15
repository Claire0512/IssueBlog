'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { fetchIssueDetails } from '@/src/lib/actions';
import type { IssueDetailsData, CustomSession } from '@/src/lib/type';

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

			<h2 className="mb-4 mt-8 text-xl font-bold">Comments</h2>
			{/* {issueDetails.comments.map((comment) => (
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
			))} */}

			<h2 className="mb-4 mt-8 text-xl font-bold">Reactions</h2>
			<div className="flex gap-4">
				{/* {issueDetails.reactions.map((reaction) => (
					<span key={reaction.id}>{reaction.content}</span>
				))} */}
			</div>
		</div>
	);
}

export default IssueDetailsPage;

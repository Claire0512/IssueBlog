'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { ChevronLeftIcon } from '@radix-ui/react-icons';

import IssueComment from '@/src/components/IssueComment';
import IssueDetailCard from '@/src/components/IssueDetailCard';
import { fetchIssueDetails } from '@/src/lib/githubApi';
import type { IssueDetailsData } from '@/src/lib/type';

function IssueDetailsPage() {
	const searchParams = useSearchParams();
	const issueId = searchParams.get('issueId');
	const repoName = searchParams.get('repoName');
	const repoOwner = searchParams.get('repoOwner');
	const [issueDetails, setIssueDetails] = useState<IssueDetailsData | null>(null);

	useEffect(() => {
		const fetchAndProcessIssueDetails = async () => {
			if (!issueId) return;
			try {
				const details = await fetchIssueDetails(
					repoName ?? '',
					repoOwner ?? '',
					parseInt(issueId, 10),
				);
				setIssueDetails(details);
			} catch (error) {
				console.error('Failed to fetch or process issue details:', error);
			}
		};

		fetchAndProcessIssueDetails();
	}, [issueId, repoName, repoOwner]);

	if (!issueDetails) return <div>Loading...</div>;
	
	return (
		<div className="flex w-full flex-col items-center justify-center p-24">
			<div className="absolute left-0 top-24 ml-[15%] mt-4">
				<Link href="/post">
					<ChevronLeftIcon className="h-10 w-10" />
				</Link>
			</div>
			<h1 className="mb-8 mt-4 w-1/2 text-center text-3xl font-bold">{issueDetails.title}</h1>
			<IssueDetailCard issueDetails={issueDetails} />
			{issueDetails.comments.map((comment) => (
				<IssueComment key={comment.id} comment={comment} />
			))}
		</div>
	);
}

export default IssueDetailsPage;

import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import IssueEdit from '@/src/components/IssueEdit';
import { updateIssue } from '@/src/lib/githubApi';
import type { IssueDetailCardProps } from '@/src/lib/type';

import IssueHeader from './IssueHeader';
import IssueView from './IssueView';

function IssueDetailCard({ issueDetails, setIssueDetails }: IssueDetailCardProps) {
	const router = useRouter();
	const { data: session } = useSession();
	const [issue, setIssue] = useState(issueDetails);
	const isAuthor = session?.username === issueDetails.userName;
	const [isEditing, setIsEditing] = useState(false);

	const handleCancelClick = () => {
		setIsEditing(false);
	};

	const handleSaveClick = async (title: string, content: string) => {
		await updateIssue({
			session,
			repoOwner: issue.repoOwner,
			repoName: issue.repoName,
			issueNumber: issue.number,
			title: title,
			body: content,
		});
		setIsEditing(false);
		const newIssueDetails = {
			...issueDetails,
			title: title,
			content: content,
		};
		setIssueDetails(newIssueDetails);
		setIssue(newIssueDetails);
	};

	const handleDeleteClick = async () => {
		await updateIssue({
			session,
			repoOwner: issue.repoOwner,
			repoName: issue.repoName,
			issueNumber: issue.number,
			state: 'closed',
		});
		setIsEditing(false);
		router.push('/post');
	};

	useEffect(() => {
		setIssue(issueDetails);
	}, [issueDetails]);

	return (
		<div className="flex w-full pb-8 sm:w-[70%]">
			<Image
				src={issue.avatarUrl}
				alt="Author's avatar"
				width={60}
				height={60}
				priority={true}
				className="me-6 self-start rounded-full"
			/>
			<div className="flex flex-1 flex-col overflow-auto rounded-lg bg-white bg-opacity-40">
				<IssueHeader
					username={issue.userName}
					createdAt={issue.createdAt}
					canEdit={isAuthor && !isEditing}
					handleEditClick={() => setIsEditing(true)}
				/>
				{isEditing ? (
					<IssueEdit
						title={issue.title}
						content={issue.content}
						handleSaveClick={handleSaveClick}
						handleCancelClick={handleCancelClick}
						handleDeleteClick={handleDeleteClick}
					/>
				) : (
					<IssueView html={issue.bodyHtml} reactions={issue.reactions} />
				)}
			</div>
		</div>
	);
}

export default IssueDetailCard;

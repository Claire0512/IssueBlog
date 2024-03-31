import React, { useState } from 'react';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import markdownToHtml from '../lib/markdownToHtml';

import IssueEdit from '@/src/components/IssueEdit';
import { updateIssue } from '@/src/lib/githubApi';
import type { IssueDetailCardProps } from '@/src/lib/type';

import IssueHeader from './IssueHeader';
import IssueView from './IssueView';

function IssueDetailCard({ issueDetails, setIssueDetails }: IssueDetailCardProps) {
	const router = useRouter();
	const { data: session } = useSession();
	const isAuthor = session?.username === issueDetails.userName;
	const [isEditing, setIsEditing] = useState(false);

	const handleCancelClick = () => {
		setIsEditing(false);
	};

	const handleSaveClick = async (title: string, content: string) => {
		await updateIssue({
			session,
			repoOwner: issueDetails.repoOwner,
			repoName: issueDetails.repoName,
			issueNumber: issueDetails.number,
			title: title,
			body: content,
		});
		setIsEditing(false);
		const bodyHtml = await markdownToHtml(content);
		const newIssueDetails = {
			...issueDetails,
			title: title,
			content: content,
			bodyHtml,
		};
		setIssueDetails(newIssueDetails);
	};

	const handleDeleteClick = async () => {
		await updateIssue({
			session,
			repoOwner: issueDetails.repoOwner,
			repoName: issueDetails.repoName,
			issueNumber: issueDetails.number,
			state: 'closed',
		});
		setIsEditing(false);
		setTimeout(() => {
			router.push('/post');
		}, 3000);
	};

	return (
		<div className="flex w-full pb-8 sm:w-[70%]">
			<Image
				src={issueDetails.avatarUrl}
				alt="Author's avatar"
				width={60}
				height={60}
				priority={true}
				className="me-6 self-start rounded-full"
			/>
			<div className="flex flex-1 flex-col overflow-auto rounded-lg bg-white bg-opacity-40">
				<IssueHeader
					username={issueDetails.userName}
					createdAt={issueDetails.createdAt}
					canEdit={isAuthor && !isEditing}
					handleEditClick={() => setIsEditing(true)}
				/>
				{isEditing ? (
					<IssueEdit
						title={issueDetails.title}
						content={issueDetails.content}
						handleSaveClick={handleSaveClick}
						handleCancelClick={handleCancelClick}
						handleDeleteClick={handleDeleteClick}
					/>
				) : (
					<IssueView html={issueDetails.bodyHtml} reactions={issueDetails.reactions} />
				)}
			</div>
		</div>
	);
}

export default IssueDetailCard;

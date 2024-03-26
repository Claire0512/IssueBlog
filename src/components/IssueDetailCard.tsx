import React, { useState } from 'react';

import Image from 'next/image';

import type { IssueDetailCardProps } from '@/src/lib/type';
import IssueHeader from './IssueHeader';
import IssueView from './IssueView';
import IssueEdit from '@/src/components/IssueEdit';

import { updateIssue } from '@/src/lib/githubApi';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

function IssueDetailCard({
	issueDetails,
	isAuthor,
	editedTitle,
	setEditedTitle,
	editedContent,
	setEditedContent,
	issuesHtml,
}: IssueDetailCardProps) {

	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const {data: session} = useSession();

	const handleCancelClick = () => {
		setIsEditing(false);
		setEditedTitle(issueDetails?.title || '');
		setEditedContent(issueDetails?.content || '');
	};

	const handleSaveClick = async () => {
		await updateIssue({
			session,
			repoOwner: issueDetails.repoOwner,
			repoName: issueDetails.repoName,
			issueNumber: issueDetails.number,
			title: editedTitle,
			body: editedContent,
		});
		setIsEditing(false);
		router.refresh();
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
		router.push('/post');
	};

	return (
		<div className="flex w-[70%] pb-8">
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
				{ isEditing ?
					<IssueEdit
						editedTitle={editedTitle}
						setEditedTitle={setEditedTitle}
						editedContent={editedContent}
						setEditedContent={setEditedContent}
						initialHtml={issuesHtml}
						handleSaveClick={handleSaveClick}
						handleCancelClick={handleCancelClick}
						handleDeleteClick={handleDeleteClick}
					/> :
					<IssueView html={issuesHtml} reactions={issueDetails.reactions} />
				}
			</div>
		</div>
	);
}

export default IssueDetailCard;

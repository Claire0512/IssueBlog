import React from 'react';

import Image from 'next/image';

import IssueDetailsEdit from '@/src/components/IssueDetailsEdit';
import getTimeDifference from '@/src/lib/getTimeDifference';
import type { IssueDisplayEditProps } from '@/src/lib/type';

function IssueDetailCard({
	issueDetails,
	isAuthor,
	isEditing,
	previewMode,
	editedTitle,
	setEditedTitle,
	editedContent,
	setEditedContent,
	issuesHtml,
	handleEditClick,
	handleSaveClick,
	handleCancelClick,
	handlePreviewClick,
	reactionEmojis,
}: IssueDisplayEditProps) {
	return (
		<div className="flex w-2/3 pb-8">
			<Image
				src={issueDetails.avatarUrl}
				alt="Author's avatar"
				width={70}
				height={70}
				className="me-6 self-start rounded-full"
			/>
			<div className="flex flex-1 flex-col rounded-lg bg-white bg-opacity-40 ">
				<div className="mb-4 flex w-full flex-1 items-center justify-between rounded-t-lg bg-[#fac23e80] p-2">
					<div className="flex items-center">
						<p className="ml-4 text-left font-bold text-black">
							{issueDetails.userName}
						</p>
						<div className="ml-4 text-left text-sm text-gray-500">
							{getTimeDifference(issueDetails.createdAt)}
						</div>
					</div>
					{isAuthor && !isEditing && (
						<button
							onClick={handleEditClick}
							className="px-4 py-2 text-right font-semibold text-gray-800"
						>
							Edit
						</button>
					)}
				</div>
				<IssueDetailsEdit
					isEditing={isEditing}
					previewMode={previewMode}
					editedTitle={editedTitle}
					setEditedTitle={setEditedTitle}
					editedContent={editedContent}
					setEditedContent={setEditedContent}
					issuesHtml={issuesHtml}
					handleSaveClick={handleSaveClick}
					handleCancelClick={handleCancelClick}
					handlePreviewClick={handlePreviewClick}
					reactionEmojis={reactionEmojis}
					issueDetails={issueDetails}
				/>
			</div>
		</div>
	);
}

export default IssueDetailCard;

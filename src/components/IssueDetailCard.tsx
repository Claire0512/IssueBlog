import React from 'react';

import Image from 'next/image';

import IssueContent from '@/src/components/IssueContent';
import getTimeDifference from '@/src/lib/getTimeDifference';
import type { IssueDetailCardProps } from '@/src/lib/type';

function IssueDetailCard({
	issueDetails,
	isAuthor,
	isEditing,
	previewMode,
	editedTitle,
	setEditedTitle,
	setState,
	editedContent,
	setEditedContent,
	issuesHtml,
	handleEditClick,
	handleSaveClick,
	handleCancelClick,
	handlePreviewClick,
	handleDeleteClick,
	reactionEmojis,
}: IssueDetailCardProps) {
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
				<div className="flex w-full flex-1 items-center justify-between rounded-t-lg bg-[#fac23e80] p-2">
					<div className="flex items-center">
						<p className="ml-4 text-left font-bold text-black">
							{issueDetails.userName}
						</p>
						<div className="ml-4 flex items-center justify-center text-left text-sm text-gray-500">
							{getTimeDifference(issueDetails.createdAt)}
						</div>
					</div>
					{isAuthor && !isEditing && (
						<button
							onClick={handleEditClick}
							className="pe-4 text-right font-semibold text-gray-800"
						>
							Edit
						</button>
					)}
				</div>
				<IssueContent
					isEditing={isEditing}
					previewMode={previewMode}
					editedTitle={editedTitle}
					setEditedTitle={setEditedTitle}
					setState={setState}
					editedContent={editedContent}
					setEditedContent={setEditedContent}
					issuesHtml={issuesHtml}
					handleSaveClick={handleSaveClick}
					handleCancelClick={handleCancelClick}
					handlePreviewClick={handlePreviewClick}
					handleDeleteClick={handleDeleteClick}
					reactionEmojis={reactionEmojis}
					issueDetails={issueDetails}
				/>
			</div>
		</div>
	);
}

export default IssueDetailCard;

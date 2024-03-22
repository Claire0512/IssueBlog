import React from 'react';

import type { IssueDetailsEditProps } from '../lib/type';

function IssueDetailsEdit({
	isEditing,
	previewMode,
	editedTitle,
	setEditedTitle,
	editedContent,
	setEditedContent,
	issuesHtml,
	handleSaveClick,
	handleCancelClick,
	handlePreviewClick,
	reactionEmojis,
	issueDetails,
}: IssueDetailsEditProps) {
	return isEditing ? (
		<>
			<div className="m-4">
				<label htmlFor="issue-title" className="block text-sm font-medium text-gray-700">
					Title:
				</label>
				<input
					id="issue-title"
					value={editedTitle}
					onChange={(e) => setEditedTitle(e.target.value)}
					className="title-input"
					placeholder="Enter title here"
				/>
			</div>
			<div className="m-4 mt-0 flex flex-1 flex-col">
				<label htmlFor="issue-content" className="block text-sm font-medium text-gray-700">
					Content:
				</label>
				{previewMode ? (
					<article
						className="prose m-4"
						dangerouslySetInnerHTML={{ __html: issuesHtml }}
					/>
				) : (
					<textarea
						id="issue-content"
						value={editedContent}
						onChange={(e) => setEditedContent(e.target.value)}
						className="content-textarea"
						placeholder="Enter markdown content here"
					/>
				)}
			</div>
			<div className="flex justify-end gap-4 p-4">
				<button onClick={handleSaveClick} disabled={!editedTitle.trim()}>
					Save
				</button>
				<button onClick={handleCancelClick}>Cancel</button>
				<button onClick={handlePreviewClick}>
					{previewMode ? 'Back to Edit' : 'Preview'}
				</button>
			</div>
		</>
	) : (
		<>
			<article className="prose m-6" dangerouslySetInnerHTML={{ __html: issuesHtml }} />
			<div className="flex p-4">
				{Object.entries(issueDetails.reactions).map(
					([key, value]) =>
						key in reactionEmojis &&
						typeof value === 'number' &&
						value > 0 && (
							<span key={key} className="mr-2">
								{reactionEmojis[key]} {value}
							</span>
						),
				)}
			</div>
		</>
	);
}

export default IssueDetailsEdit;
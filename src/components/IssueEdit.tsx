import React, { useState } from 'react';
import type { IssueEditProps } from '../lib/type';
import markdownToHtml from '@/src/lib/markdownToHtml';

function IssueEdit({
	editedTitle,
	setEditedTitle,
	editedContent,
	setEditedContent,
	initialHtml,
	handleSaveClick,
	handleDeleteClick,
	handleCancelClick,
}: IssueEditProps) {

	const [previewMode, setPreviewMode] = useState(false);
	const [issuesHtml, setIssuesHtml] = useState(initialHtml);

	const handlePreviewClick = async () => {
		if (!previewMode) {
			const html = await markdownToHtml(editedContent);
			setIssuesHtml(html);
		}
		setPreviewMode(!previewMode);
	};

	return (
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
						className="prose m-4 max-w-none break-words"
						dangerouslySetInnerHTML={{ __html: issuesHtml }}
					/>
				) : (
					<textarea
						id="issue-content"
						value={editedContent}
						onChange={(e) => setEditedContent(e.target.value)}
						className="content-textarea w-full break-words"
						placeholder="Enter markdown content here"
					/>
				)}
			</div>
			<div className="flex justify-end gap-4">
				<button onClick={handleSaveClick} disabled={!editedTitle.trim()}>
					Save
				</button>
				<button onClick={handleDeleteClick} disabled={!editedTitle.trim()}>
					Delete
				</button>
				<button onClick={handleCancelClick}>Cancel</button>
				<button onClick={handlePreviewClick}>
					{previewMode ? 'Back to Edit' : 'Preview'}
				</button>
			</div>
		</>
	)
}

export default IssueEdit;

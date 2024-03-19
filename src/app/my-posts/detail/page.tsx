'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { fetchIssueDetails, updateIssue } from '@/src/lib/githubApi';
import markdownToHtml from '@/src/lib/markdownToHtml';
import type { IssueDetailsData, CustomSession } from '@/src/lib/type';

function IssueDetailsPage() {
	const { data: session } = useSession();
	const searchParams = useSearchParams();

	const issueId = searchParams.get('issueId');
	const repoName = searchParams.get('repoName');
	const repoOwner = searchParams.get('repoOwner');

	const [issueDetails, setIssueDetails] = useState<IssueDetailsData | null>(null);
	const [issuesHtml, setIssuesHtml] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState('');
	const [editedContent, setEditedContent] = useState('');
	const isAuthor = session?.user?.name === issueDetails?.userName;
	const handleEditClick = () => setIsEditing(true);
	const [previewMode, setPreviewMode] = useState(false);
	const handlePreviewClick = async () => {
		if (!previewMode) {
			const html = await markdownToHtml(editedContent);
			setIssuesHtml(html);
		}
		setPreviewMode(!previewMode);
	};

	const handleCancelClick = () => {
		setIsEditing(false);
		setEditedTitle(issueDetails?.title || '');
		setEditedContent(issueDetails?.content || '');
	};

	const handleSaveClick = async () => {
		if (session && repoName && repoOwner && issueId) {
			await updateIssue({
				session: session as CustomSession,
				repoOwner,
				repoName,
				issueNumber: parseInt(issueId, 10),
				title: editedTitle,
				body: editedContent,
			});
			setIsEditing(false);
		}
	};

	useEffect(() => {
		const fetchAndProcessIssueDetails = async () => {
			if (!session || !issueId) return;

			try {
				const details = await fetchIssueDetails(
					session as CustomSession,
					repoName ?? '',
					repoOwner ?? '',
					parseInt(issueId, 10),
				);

				const processedComments = await Promise.all(
					details.comments.map(async (comment) => {
						const html = await markdownToHtml(comment.body);
						return { ...comment, bodyHtml: html };
					}),
				);

				setIssueDetails({ ...details, comments: processedComments });

				if (details.content) {
					const contentHtml = await markdownToHtml(details.content);
					setIssuesHtml(contentHtml);
				}

				setEditedTitle(details.title || '');
				setEditedContent(details.content || '');
			} catch (error) {
				console.error('Failed to fetch or process issue details:', error);
			}
		};

		fetchAndProcessIssueDetails();
	}, [session, issueId, repoName, repoOwner]);

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
			{isEditing ? (
				<div className="flex flex-col gap-4">
					<div className="mt-4">
						<label
							htmlFor="issue-title"
							className="block text-sm font-medium text-gray-700"
						>
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
					<div className="mt-4 flex flex-1 flex-col">
						<label
							htmlFor="issue-content"
							className="block text-sm font-medium text-gray-700"
						>
							Content:
						</label>
						{previewMode ? (
							<article
								className="prose p-4"
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

					<button onClick={handleSaveClick} disabled={!editedTitle.trim()}>Save</button>
					<button onClick={handleCancelClick}>Cancel</button>
					<button onClick={handlePreviewClick}>
						{previewMode ? 'Back to Edit' : 'Preview'}
					</button>
				</div>
			) : (
				<>
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
					<article className="prose" dangerouslySetInnerHTML={{ __html: issuesHtml }} />
					{isAuthor && <button onClick={handleEditClick}>Edit</button>}
				</>
			)}

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

					<article
						className="prose mt-2"
						dangerouslySetInnerHTML={{ __html: comment.bodyHtml ?? '...' }}
					/>

					<div className="mt-2">
						{Object.entries(comment.reactions).map(([key, value]) => {
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
				</div>
			))}
		</div>
	);
}

export default IssueDetailsPage;

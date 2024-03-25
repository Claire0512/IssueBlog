'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

import { ChevronLeftIcon } from '@radix-ui/react-icons';

import IssueComment from '@/src/components/IssueComment';
import IssueDetailCard from '@/src/components/IssueDetailCard';
import { fetchIssueDetails, updateIssue } from '@/src/lib/githubApi';
import markdownToHtml from '@/src/lib/markdownToHtml';
import type { IssueDetailsData } from '@/src/lib/type';

export const reactionEmojis: { [key: string]: string } = {
	'+1': '👍',
	'-1': '👎',
	laugh: '😄',
	hooray: '🎉',
	confused: '😕',
	heart: '❤️',
	rocket: '🚀',
	eyes: '👀',
};
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
	const router = useRouter();
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
				session,
				repoOwner,
				repoName,
				issueNumber: parseInt(issueId, 10),
				title: editedTitle,
				body: editedContent,
			});
			setIsEditing(false);
			router.refresh();
		}
	};

	useEffect(() => {
		const fetchAndProcessIssueDetails = async () => {
			if (!issueId) return;

			try {
				const details = await fetchIssueDetails(
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
			<IssueDetailCard
				issueDetails={issueDetails}
				isAuthor={isAuthor}
				isEditing={isEditing}
				previewMode={previewMode}
				editedTitle={editedTitle}
				setEditedTitle={setEditedTitle}
				editedContent={editedContent}
				setEditedContent={setEditedContent}
				issuesHtml={issuesHtml}
				handleEditClick={handleEditClick}
				handleSaveClick={handleSaveClick}
				handleCancelClick={handleCancelClick}
				handlePreviewClick={handlePreviewClick}
				reactionEmojis={reactionEmojis}
			/>
			{issueDetails.comments.map((comment) => (
				<IssueComment key={comment.id} comment={comment} />
			))}
		</div>
	);
}

export default IssueDetailsPage;

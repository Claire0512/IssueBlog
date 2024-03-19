'use server';

import axios from 'axios';

import { aggregateReactions } from './dataProcessing';
import type {
	CustomSession,
	GitHubIssueApiResponse,
	CommentAPIResponse,
	ReactionData,
	UpdateIssueParams,
} from './type';
import type { CommentData, IssueDetailsData } from './type';

async function fetchIssueComments(
	commentUrl: string,
	repoName: string,
	repoOwner: string,
): Promise<CommentData[]> {
	const commentsResponse = await axios.get(commentUrl, {
		headers: { Authorization: `token ${process.env.GITHUB_PAT}` },
	});

	const commentsWithReactions = await Promise.all(
		commentsResponse.data.map(async (comment: CommentAPIResponse) => {
			const reactions = await fetchReactionsForComment(repoOwner, repoName, comment.id);

			return {
				id: comment.id,
				user: {
					login: comment.user.login,
					avatarUrl: comment.user.avatar_url,
				},
				body: comment.body,
				createdAt: comment.created_at,
				reactions,
			};
		}),
	);

	return commentsWithReactions;
}

export const fetchIssueDetails = async (
	session: CustomSession | null,
	repoName: string,
	repoOwner: string,
	issueNumber: number,
): Promise<IssueDetailsData> => {
	if (!session?.user?.name || !session?.user?.image) {
		throw new Error('Session or user information is missing');
	}

	try {
		const issueResponse = await axios.get(
			`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issueNumber}`,
			{
				headers: {
					Authorization: `token ${process.env.GITHUB_PAT}`,
				},
			},
		);
		const issue: GitHubIssueApiResponse = issueResponse.data;
		const comments = await fetchIssueComments(issue.comments_url ?? '', repoName, repoOwner);
		const reactions = issue.reactions;
		return {
			number: issue.number,
			htmlUrl: issue.html_url,
			title: issue.title,
			userName: issue.user.login,
			avatarUrl: issue.user.avatar_url,
			content: issue.body,
			comments: comments ?? [],
			reactions: reactions ?? [],
			repoOwner: issue.repository_url.split('/')[4],
			repoName: issue.repository_url.split('/')[5],
		};
	} catch (error) {
		console.error('Error fetching issue details:', error);
		throw error;
	}
};
async function fetchReactionsForComment(
	owner: string,
	repo: string,
	commentId: number,
): Promise<ReactionData> {
	const reactionsUrl = `https://api.github.com/repos/${owner}/${repo}/issues/comments/${commentId}/reactions`;
	const reactionsResponse = await axios.get(reactionsUrl, {
		headers: {
			Authorization: `token ${process.env.GITHUB_PAT}`,
			Accept: 'application/vnd.github.squirrel-girl-preview+json',
		},
	});
	return aggregateReactions(reactionsResponse.data);
}

export const updateIssue = async ({
	repoOwner,
	repoName,
	issueNumber,
	title,
	body,
	session,
}: UpdateIssueParams): Promise<void> => {
	if (!session || !repoOwner || !repoName || !issueNumber) {
		console.error('Missing required parameters or session information');
		return;
	}

	try {
		const response = await axios.patch(
			`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issueNumber}`,
			{
				title,
				body,
			},
			{
				headers: {
					Authorization: `token ${session.accessToken}`,
					Accept: 'application/vnd.github.v3+json',
				},
			},
		);

		console.log('Issue updated successfully:', response.data);
	} catch (error) {
		console.error('Failed to update GitHub issue:', error);
	}
};

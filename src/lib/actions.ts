'use server';

import axios from 'axios';

import type {
	CustomSession,
	IssueData,
	RepoData,
	IssueStatistic,
	CreateIssueParams,
	GitHubIssueApiResponse,
	CommentAPIResponse,
	ReactionData,
	GitHubReaction,
} from './type';
import type { CommentData, IssueDetailsData } from './type';

export const fetchIssueData = async (session: CustomSession | null): Promise<IssueData[]> => {
	if (!session?.user?.name || !session?.user?.image) {
		return [];
	}
	const userId = session.user.image?.split('/').pop()?.split('?')[0];
	const userInfoResponse = await axios.get(`https://api.github.com/user/${userId}`);
	const username = userInfoResponse.data.login;
	let issuesData: IssueData[] = [];
	try {
		const issuesResponse = await axios.get(
			`https://api.github.com/search/issues?q=author:${username}+is:issue+user:${username}&sort=created&order=desc`,
			{
				headers: {
					Authorization: `token ${process.env.GITHUB_PAT}`,
				},
			},
		);
		issuesData = issuesResponse.data.items.map((issue: GitHubIssueApiResponse) => ({
			number: issue.number,
			htmlUrl: issue.html_url,
			title: issue.title,
			userName: issue.user.login,
			avatarUrl: issue.user.avatar_url,
			content: issue.body,
			repoOwner: issue.repository_url.split('/')[4],
			repoName: issue.repository_url.split('/')[5],
		}));
	} catch (error) {
		console.error('Failed to fetch GitHub issues:', error);
	}

	return issuesData;
};

export const fetchGithubData = async (session: CustomSession | null): Promise<IssueStatistic> => {
	const answer: IssueStatistic = {
		issuesCount: 0,
		commentsCount: 0,
		reactionsCount: 0,
	};
	if (!session?.user?.name || !session?.user?.image) {
		return answer;
	}
	const username = session.username;

	try {
		const issuesResponse = await axios.get(
			`https://api.github.com/search/issues?q=author:${username}+is:issue+user:${username}&sort=created&order=desc`,
			{
				headers: {
					Authorization: `token ${process.env.GITHUB_PAT}`,
				},
			},
		);
		const issues = issuesResponse.data.items;
		answer.issuesCount = issues.length;
		let reactionsResponse;
		for (const issue of issues) {
			const commentsResponse = await axios.get(issue.comments_url, {
				headers: {
					Authorization: `token ${process.env.GITHUB_PAT}`,
				},
			});
			answer.commentsCount += commentsResponse.data.length;
			reactionsResponse = await axios.get(`${issue.url}/reactions`, {
				headers: {
					Authorization: `token ${process.env.GITHUB_PAT}`,
				},
			});
			answer.reactionsCount += reactionsResponse.data.length;
		}
	} catch (error) {
		console.error('Failed to fetch GitHub data:', error);
		return answer;
	}
	return answer;
};

export const createIssue = async ({
	repoOwner,
	repoName,
	title,
	body,
	session,
}: CreateIssueParams): Promise<void> => {
	if (!session || !repoOwner || !repoName || !title) {
		console.error('Missing required parameters or session information');
		return;
	}

	try {
		const response = await axios.post(
			`https://api.github.com/repos/${repoOwner}/${repoName}/issues`,
			{
				title,
				body,
			},
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			},
		);

		console.log('Issue created successfully:', response.data);
	} catch (error) {
		console.error('Failed to create GitHub issue:', error);
	}
};

export const fetchUserRepoList = async (session: CustomSession | null): Promise<RepoData[]> => {
	if (!session?.username) {
		console.error('Session or username is missing');
		return [];
	}
	const username = session.username;
	try {
		const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
			headers: {
				Authorization: `token ${process.env.GITHUB_PAT}`,
			},
		});

		return response.data.map((repo: RepoData) => ({
			name: repo.name,
			owner: repo.owner,
		}));
	} catch (error) {
		console.error('Failed to fetch user repositories:', error);
		return [];
	}
};
function aggregateReactions(reactions: GitHubReaction[]): ReactionData {
	const initialReactionData: ReactionData = {
		url: '',
		total_count: 0,
		'+1': 0,
		'-1': 0,
		laugh: 0,
		hooray: 0,
		confused: 0,
		heart: 0,
		rocket: 0,
		eyes: 0,
	};

	const reactionData = reactions.reduce((acc, reaction) => {
		if (reaction.content in acc) {
			acc[reaction.content]++;
		}
		acc.total_count++;
		return acc;
	}, initialReactionData);

	return reactionData;
}

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

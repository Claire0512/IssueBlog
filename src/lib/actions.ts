'use server';

import type { Session } from 'next-auth';

import axios from 'axios';

export type IssueData = {
	id: number;
	html_url: string;
	title: string;
	name: string;
	avatar_url: string;
	content: string;
};

export type GitHubIssueApiResponse = {
	id: number;
	html_url: string;
	title: string;
	body: string; 
	user: {
		login: string; 
		avatar_url: string;
	};
};

export const fetchIssueData = async (session: Session | null): Promise<IssueData[]> => {
	if (!session?.user?.name || !session?.user?.image) {
		return [];
	}
	const userId = session.user.image?.split('/').pop()?.split('?')[0];
	const userInfoResponse = await axios.get(`https://api.github.com/user/${userId}`);
	const username = userInfoResponse.data.login;
	let issuesData: IssueData[] = [];
	try {
		const issuesResponse = await axios.get(
			`https://api.github.com/search/issues?q=author:${username}+is:issue&sort=created&order=desc`,
		);
		issuesData = issuesResponse.data.items.map((issue: GitHubIssueApiResponse) => ({
			id: issue.id,
			html_url: issue.html_url,
			title: issue.title,
			name: issue.user.login,
			avatar_url: issue.user.avatar_url,
			content: issue.body,
		}));
	} catch (error) {
		console.error('Failed to fetch GitHub issues:', error);
	}

	return issuesData;
};

export type GithubData = {
	issuesCount: number;
	commentsCount: number;
	reactionsCount: number;
};

export const fetchGithubData = async (session: Session | null): Promise<GithubData> => {
	const answer: GithubData = {
		issuesCount: 0,
		commentsCount: 0,
		reactionsCount: 0,
	};
	if (!session?.user?.name || !session?.user?.image) {
		return answer;
	}
	const userId = session.user.image?.split('/').pop()?.split('?')[0];
	const userInfoResponse = await axios.get(`https://api.github.com/user/${userId}`);
	const username = userInfoResponse.data.login;

	try {
		const issuesResponse = await axios.get(
			`https://api.github.com/search/issues?q=author:${username}+is:issue&sort=created&order=desc`,
		);
		const issues = issuesResponse.data.items;
		answer.issuesCount = issues.length;
		let reactionsResponse;
		for (const issue of issues) {
			const commentsResponse = await axios.get(issue.comments_url);
			answer.commentsCount += commentsResponse.data.length;
			reactionsResponse = await axios.get(`${issue.url}/reactions`);
			answer.reactionsCount += reactionsResponse.data.length;
		}
	} catch (error) {
		console.error('Failed to fetch GitHub data:', error);
		return answer;
	}
	return answer;
};

'use server';

import type { Session } from 'next-auth';

import axios from 'axios';

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
			`https://api.github.com/search/issues?q=author:${username}`,
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

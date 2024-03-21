'use server';

import axios from 'axios';

import type {
	IssueData,
	RepoData,
	IssueStatistic,
	CreateIssueParams,
	GitHubIssueApiResponse,
} from './type';

export const fetchIssueData = async (
	page: number,
	perPage = 5,
	sort = 'created',
): Promise<IssueData[]> => {
	if (!process.env.GITHUB_PAT) {
		console.error('GitHub Personal Access Token is not set.');
		return [];
	}

	let issuesData: IssueData[] = [];
	try {
		const issuesResponse = await axios.get(
			`https://api.github.com/search/issues?q=author:${process.env.User_Name}+is:issue+user:${process.env.User_Name}&sort=${sort}&order=desc&page=${page}&per_page=${perPage}`,
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
			created_at: issue.created_at,
		}));
	} catch (error: any) {
		console.error(
			'Failed to fetch GitHub issues:',
			error.response ? error.response.data : error.message,
		);
	}

	return issuesData;
};
export const fetchGithubData = async (): Promise<IssueStatistic> => {
	const answer: IssueStatistic = {
		issuesCount: 0,
		commentsCount: 0,
		reactionsCount: 0,
	};

	try {
		const issuesResponse = await axios.get(
			`https://api.github.com/search/issues?q=author:${process.env.User_Name}+is:issue+user:${process.env.User_Name}&sort=created&order=desc`,
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

export const fetchUserRepoList = async (): Promise<RepoData[]> => {
	try {
		const response = await axios.get(
			`https://api.github.com/users/${process.env.User_Name}/repos`,
			{
				headers: {
					Authorization: `token ${process.env.GITHUB_PAT}`,
				},
			},
		);

		return response.data.map((repo: RepoData) => ({
			name: repo.name,
			owner: repo.owner,
		}));
	} catch (error) {
		console.error('Failed to fetch user repositories:', error);
		return [];
	}
};

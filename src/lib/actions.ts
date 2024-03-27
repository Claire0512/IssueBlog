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
	perPage = 10,
	sort = 'created',
	order = 'desc',
): Promise<IssueData[]> => {
	if (!process.env.AUTHOR_GITHUB_PAT) {
		console.error('GitHub Personal Access Token is not set.');
		return [];
	}

	let issuesData: IssueData[] = [];
	try {
		const issuesResponse = await axios.get(
			`https://api.github.com/search/issues?q=author:${process.env.NEXT_PUBLIC_AUTHOR_GITHUB_USERNAME}+is:issue+user:${process.env.NEXT_PUBLIC_AUTHOR_GITHUB_USERNAME}+state:open&sort=${sort}&order=${order}&page=${page}&per_page=${perPage}`,
			{
				headers: {
					Authorization: `token ${process.env.AUTHOR_GITHUB_PAT}`,
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
	} catch (error) {
		console.error('Failed to fetch GitHub issues:', error);
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
			`https://api.github.com/search/issues?q=author:${process.env.NEXT_PUBLIC_AUTHOR_GITHUB_USERNAME}+is:issue+user:${process.env.NEXT_PUBLIC_AUTHOR_GITHUB_USERNAME}&sort=created&order=desc`,
			{
				headers: {
					Authorization: `token ${process.env.AUTHOR_GITHUB_PAT}`,
				},
			},
		);

		const issues = issuesResponse.data.items;
		answer.issuesCount = issues.length;

		const commentsPromises = issues.map((issue: GitHubIssueApiResponse) => {
			return axios.get(issue.comments_url as string, {
				headers: {
					Authorization: `token ${process.env.AUTHOR_GITHUB_PAT}`,
				},
			});
		});

		const reactionsPromises = issues.map((issue: GitHubIssueApiResponse) => {
			return axios.get(`${issue.url}/reactions`, {
				headers: {
					Authorization: `token ${process.env.AUTHOR_GITHUB_PAT}`,
				},
			});
		});

		const commentsResponses = await Promise.all(commentsPromises);
		const reactionsResponses = await Promise.all(reactionsPromises);

		commentsResponses.forEach((commentsResponse) => {
			answer.commentsCount += commentsResponse.data.length;
		});

		reactionsResponses.forEach((reactionsResponse) => {
			answer.reactionsCount += reactionsResponse.data.length;
		});
		return answer;
	} catch (error) {
		console.error('Error fetching issues:', error);
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
			`https://api.github.com/users/${process.env.NEXT_PUBLIC_AUTHOR_GITHUB_USERNAME}/repos`,
			{
				headers: {
					Authorization: `token ${process.env.AUTHOR_GITHUB_PAT}`,
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

import type { Session } from 'next-auth';

export type IssueData = {
	number: number;
	repoName: string;
	repoOwner: string;
	htmlUrl: string;
	title: string;
	userName: string;
	avatarUrl: string;
	content: string;
};

export type ReactionData = {
	url: string;
	total_count: number;
	'+1': number;
	'-1': number;
	laugh: number;
	hooray: number;
	confused: number;
	heart: number;
	rocket: number;
	eyes: number;
};
export type GitHubIssueApiResponse = {
	number: number;
	repository_url: string;
	html_url: string;
	title: string;
	body: string;
	user: {
		login: string;
		avatar_url: string;
	};
	reactions?: ReactionData[];
	comments_url?: string;
};

export type IssueStatistic = {
	issuesCount: number;
	commentsCount: number;
	reactionsCount: number;
};

export type CustomSession = Session & { username: string; accessToken: string };

export type CreateIssueParams = {
	repoOwner: string;
	repoName: string;
	title: string;
	body: string;
	session: CustomSession | null;
};

export type RepoData = {
	name: string;
	owner: string;
};

export interface CommentAPIResponse {
	id: number;
	user: {
		login: string;
		avatar_url: string;
	};
	body: string;
	created_at: string;
}
export interface CommentData {
	id: number;
	user: {
		login: string;
		avatarUrl: string;
	};
	body: string;
	createdAt: string;
	bodyHtml?: string;
}

export interface IssueDetailsData {
	number: number;
	htmlUrl: string;
	repoOwner: string;
	repoName: string;
	title: string;
	userName: string;
	avatarUrl: string;
	content: string;
	comments: CommentData[];
	reactions: ReactionData[];
}

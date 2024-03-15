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

// Type definition for a comment on a GitHub issue
export interface CommentData {
	id: number; // Unique identifier for the comment
	user: {
		login: string; // Username of the commenter
		avatarUrl: string; // URL of the commenter's avatar
	};
	body: string; // The body of the comment
	createdAt: string; // The creation date of the comment
}

// Type definition for the details of a GitHub issue, including comments and reactions
export interface IssueDetailsData {
	number: number; // Unique identifier for the issue
	htmlUrl: string; // URL to view the issue on GitHub
	repoOwner: string; // Owner of the repository where the issue is located
	repoName: string; // Name of the repository where the issue is located
	title: string; // Title of the issue
	userName: string; // Username of the issue creator
	avatarUrl: string; // URL of the issue creator's avatar
	content: string; // Body content of the issue
	comments: CommentData[]; // Array of comments on the issue
	reactions: ReactionData[]; // Array of reactions to the issue
}

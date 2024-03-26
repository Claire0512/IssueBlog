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
	contentHtml?: string;
	created_at: string;
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

export type GitHubReaction = {
	content: '+1' | '-1' | 'laugh' | 'confused' | 'heart' | 'hooray' | 'rocket' | 'eyes';
};

export type GitHubIssueApiResponse = {
	number: number;
	url: string;
	repository_url: string;
	html_url: string;
	title: string;
	body: string;
	user: {
		login: string;
		avatar_url: string;
	};
	reactions: ReactionData;
	comments_url?: string;
	created_at: string;
};

export type IssueStatistic = {
	issuesCount: number;
	commentsCount: number;
	reactionsCount: number;
};

export type CreateIssueParams = {
	repoOwner: string;
	repoName: string;
	title: string;
	body: string;
	session: Session | null;
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
	reactions: ReactionData;
}

export type IssueDetailsData = {
	number: number;
	htmlUrl: string;
	repoOwner: string;
	repoName: string;
	title: string;
	userName: string;
	avatarUrl: string;
	content: string;
	comments: CommentData[];
	reactions: ReactionData;
	createdAt: string;
	bodyHtml: string;
};

export type UpdateIssueParams = {
	repoOwner: string;
	repoName: string;
	issueNumber: number;
	title?: string;
	body?: string;
	state?: string;
	session: Session | null;
};

export type IssueEditProps = {
	title: string;
	content: string;
	handleSaveClick: (title: string, content: string) => Promise<void>;
	handleCancelClick: () => void;
	handleDeleteClick: () => Promise<void>;
};

export type IssueDetailCardProps = {
	issueDetails: Omit<IssueDetailsData, 'comment'>;
};

export type IssueUpdate = {
	title?: string;
	body?:string;
	state?: string;
}

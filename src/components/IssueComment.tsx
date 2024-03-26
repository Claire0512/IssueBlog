import React from 'react';

import Image from 'next/image';

import type { CommentData } from '@/src/lib/type';

import IssueHeader from './IssueHeader';
import IssueView from './IssueView';

function IssueComment({ comment }: { comment: CommentData }) {
	return (
		<div className="flex w-[70%] pb-8">
			<Image
				src={comment.user.avatarUrl}
				alt="Author's avatar"
				width={60}
				height={60}
				priority={true}
				className="me-6 self-start rounded-full"
			/>
			<div className="flex flex-1 flex-col overflow-auto rounded-lg bg-white bg-opacity-40">
				<IssueHeader username={comment.user.login} createdAt={comment.createdAt} />
				<IssueView html={comment.bodyHtml ?? '...'} reactions={comment.reactions} />
			</div>
		</div>
	);
}

export default IssueComment;

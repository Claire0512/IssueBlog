import React from 'react';

import Image from 'next/image';

import { reactionEmojis } from '@/src/app/(main-interface)/post/detail/page';
import getTimeDifference from '@/src/lib/getTimeDifference';
import type { CommentData } from '@/src/lib/type';

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
				<div className="flex w-full flex-1 items-center justify-between rounded-t-lg bg-[#fac23e80] p-2">
					<div className="item-center flex  ">
						<p className="ml-4 text-left font-bold text-black">{comment.user.login}</p>
						<div className="ml-4 flex items-center justify-center text-left text-sm text-gray-500">
							{getTimeDifference(comment.createdAt)}
						</div>
					</div>
				</div>

				<article
					className="prose m-6 max-w-none break-words"
					dangerouslySetInnerHTML={{ __html: comment.bodyHtml ?? '...' }}
				/>

				<div className="flex p-4">
					{Object.entries(comment.reactions).map(
						([key, value]) =>
							key in reactionEmojis &&
							typeof value === 'number' &&
							value > 0 && (
								<span key={key} className="mr-2">
									{reactionEmojis[key]} {value}
								</span>
							),
					)}
				</div>
			</div>
		</div>
	);
}

export default IssueComment;

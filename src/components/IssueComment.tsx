import React from 'react';

import Image from 'next/image';

import { reactionEmojis } from '@/src/app/(main-interface)/post/detail/page';
import getTimeDifference from '@/src/lib/getTimeDifference';
import type { CommentData } from '@/src/lib/type';

function IssueComment({ comment }: { comment: CommentData }) {
	return (
		<div className="flex w-2/3 pb-8">
			<Image
				src={comment.user.avatarUrl}
				alt="Author's avatar"
				width={70}
				height={70}
				className="me-6 self-start rounded-full"
			/>
			<div className="flex flex-1 flex-col rounded-lg bg-white bg-opacity-40">
				<div className="mb-4 flex w-full flex-1 items-center justify-between rounded-t-lg bg-[#41251780] p-4">
					<div className="item-center flex ">
						<p className="ml-4 text-left font-bold text-black">{comment.user.login}</p>
						<div className="ml-4 text-left text-sm text-gray-500">
							{getTimeDifference(comment.createdAt)}
						</div>
					</div>
				</div>

				<article
					className="prose m-6"
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

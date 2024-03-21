'use client';

import { useEffect, useState, useRef } from 'react';
import React from 'react';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import { useScroll } from '@react-hooks-library/core';

import NewPostDialog from '@/src/components/NewPostDialog';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/src/components/ui/select';
import { fetchIssueData, fetchUserRepoList } from '@/src/lib/actions';
import getTimeDifference from '@/src/lib/getTimeDifference';
import markdownToHtml from '@/src/lib/markdownToHtml';
import type { CustomSession, RepoData, IssueData } from '@/src/lib/type';

function MyPostsPage() {
	const { data: session } = useSession();
	const [issues, setIssues] = useState<IssueData[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [selectedRepo, setSelectedRepo] = useState('');
	const [issueTitle, setIssueTitle] = useState('');
	const [issueContent, setIssueContent] = useState('');
	const [previewMode, setPreviewMode] = useState(false);
	const [sortOption, setSortOption] = useState('created');
	const togglePreviewMode = () => setPreviewMode(!previewMode);

	const [repos, setRepos] = useState<RepoData[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [scroll, setScroll] = useState({ x: NaN, y: NaN });
	const [consecutiveFetch, setConsecutiveFetch] = useState(false);

	const refScroll = useRef<HTMLDivElement>(null);
	useScroll(refScroll, ({ scrollX, scrollY }) => setScroll({ x: scrollX, y: scrollY }));

	const cantScroll = refScroll.current?.scrollHeight === refScroll.current?.clientHeight;
	const isBottom = (scroll.y > 0.9 || cantScroll) && !consecutiveFetch;

	const [htmlContent, setHtmlContent] = useState('');

	useEffect(() => {
		const processMarkdown = async () => {
			if (previewMode && issueContent) {
				const html = await markdownToHtml(issueContent);
				setHtmlContent(html);
			}
		};

		processMarkdown();
	}, [previewMode, issueContent]);

	useEffect(() => {
		if (consecutiveFetch) setConsecutiveFetch(false);

		const fetchData = async () => {
			const issueData = await fetchIssueData(page, 5, sortOption);
			if (issueData.length < 5) {
				setHasMore(false);
			}
			setIssues((prev) => [...prev, ...issueData]);
			setPage(page + 1);
		};
		if (isBottom && hasMore) {
			fetchData().then(() => {
				setConsecutiveFetch(true);
				setScroll({ x: 0, y: 0 });
			});
		}
	}, [isBottom, page, hasMore, consecutiveFetch, sortOption]);

	useEffect(() => {
		const fetchData = async () => {
			const repoData = await fetchUserRepoList();
			setRepos(repoData);
		};
		fetchData();
	}, [session]);
	if (session)
		console.log((session as CustomSession).username, process.env.NEXT_PUBLIC_USER_NAME);
	return (
		<div className="flex-1 overflow-auto p-32" ref={refScroll}>
			<div className="flex-start flex w-[20%] items-center space-x-8">
				<h1 className="whitespace-nowrap text-4xl font-bold text-[#412517]">Sort by:</h1>
				<Select onValueChange={setSortOption} value={sortOption}>
					<SelectTrigger
						aria-label="Sort"
						className="text-md inline-flex items-center justify-center rounded-md border border-transparent bg-[#412517] py-6 font-medium text-white shadow-sm hover:bg-[#5a2d0c] focus:outline-none focus:ring-2 focus:ring-[#412517] focus:ring-offset-2"
					>
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent className="text-md mt-1 rounded-md bg-white shadow-lg">
						<SelectItem value="created">Created</SelectItem>
						<SelectItem value="updated">Updated</SelectItem>
						<SelectItem value="comments">Comments</SelectItem>
						<SelectItem value="reactions">Reactions</SelectItem>{' '}
					</SelectContent>
				</Select>
			</div>
			<div className="mt-4 flex flex-col gap-4 p-16">
				{issues.map((issue, index) => (
					<div
						key={index}
						className="mb-4 flex items-center justify-between rounded-[15px] border bg-white p-8"
					>
						<div className="flex items-center">
							<Image
								src={issue.avatarUrl}
								width={60}
								height={60}
								alt={`Profile Pic for ${issue.userName}`}
								className="rounded-full"
							/>
							<div className="ml-4">
								<div className="text-base font-medium">{issue.userName}</div>
								<div className="text-sm text-gray-500">
									{getTimeDifference(issue.created_at)}
								</div>
							</div>
							<p className="ml-8 text-xl font-bold">{issue.title}</p>{' '}
						</div>

						<Link
							href={`/post/detail?issueId=${issue.number}&repoName=${issue.repoName}&repoOwner=${issue.repoOwner}`}
							className="rounded bg-[#412517] px-4 py-2 text-sm text-[#F9F1E0]"
						>
							View More
						</Link>
					</div>
				))}

				{hasMore && <div>Loading more...</div>}
			</div>
			{session &&
				(session as CustomSession).username === process.env.NEXT_PUBLIC_USER_NAME && (
					<NewPostDialog repos={repos} />
				)}
		</div>
	);
}

export default MyPostsPage;

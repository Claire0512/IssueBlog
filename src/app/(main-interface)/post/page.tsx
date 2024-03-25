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
import type { RepoData, IssueData } from '@/src/lib/type';

function MyPostsPage() {
	const { data: session } = useSession();
	const [issues, setIssues] = useState<IssueData[]>([]);
	const [sortOption, setSortOption] = useState('created');

	const [repos, setRepos] = useState<RepoData[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [scroll, setScroll] = useState({ x: NaN, y: NaN });
	const [consecutiveFetch, setConsecutiveFetch] = useState(false);
	const refScroll = useRef<HTMLDivElement>(null);
	useScroll(refScroll, ({ scrollX, scrollY }) => setScroll({ x: scrollX, y: scrollY }));

	const cantScroll = refScroll.current?.scrollHeight === refScroll.current?.clientHeight;
	const isBottom = (scroll.y > 0.9 || cantScroll) && !consecutiveFetch;

	const changeSortOption = (option: string) => {
		setSortOption(option);
		setPage(1);
		setIssues([]);
		setHasMore(true);
	};

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
		if (page === 1 || (isBottom && hasMore)) {
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

	return (
		<div className="flex h-screen w-full flex-col overflow-auto p-40 pb-0 pt-32">
			<div className="flex-start flex w-[20%] items-center space-x-8">
				<h1 className="whitespace-nowrap text-3xl font-bold text-[#412517]">Sort by:</h1>
				<Select onValueChange={changeSortOption} value={sortOption}>
					<SelectTrigger
						aria-label="Sort"
						className=" inline-flex items-center  justify-center rounded-md border border-transparent bg-[#412517] py-4 text-lg font-medium text-white shadow-sm hover:bg-[#5a2d0c] focus:outline-none focus:ring-2 focus:ring-[#412517] focus:ring-offset-2"
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
			<div className="m-8 mb-0 flex flex-1 flex-col gap-3 overflow-auto" ref={refScroll}>
				{issues.map((issue, index) => (
					<div
						key={index}
						className="mb-1 flex items-center justify-between rounded-[15px] border bg-white p-6"
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
								<div className="text-md font-medium">{issue.userName}</div>
								<div className="text-sm text-gray-500">
									{getTimeDifference(issue.created_at)}
								</div>
							</div>
							<p className="ml-8 text-xl font-bold">{issue.title}</p>{' '}
						</div>

						<Link
							href={`/post/detail?issueId=${issue.number}&repoName=${issue.repoName}&repoOwner=${issue.repoOwner}`}
							className="px-4  py-2 text-lg font-bold text-[#412517]"
						>
							View More
						</Link>
					</div>
				))}

				{hasMore && <div>Loading more...</div>}
			</div>
			{session && session.username === process.env.NEXT_PUBLIC_USER_NAME && (
				<NewPostDialog repos={repos} />
			)}
		</div>
	);
}

export default MyPostsPage;

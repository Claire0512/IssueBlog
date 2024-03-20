'use client';

import { useEffect, useState, useRef } from 'react';
import React from 'react';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import { useScroll } from '@react-hooks-library/core';

import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/src/components/ui/select';
import { fetchIssueData, createIssue, fetchUserRepoList } from '@/src/lib/actions';
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

	const createIssues = async () => {
		const owner = selectedRepo.split('/')[0];
		const repo = selectedRepo.split('/')[1];
		await createIssue({
			repoOwner: owner,
			repoName: repo,
			title: issueTitle,
			body: issueContent,
			session: session as CustomSession,
		});
		setShowModal(false);
	};
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
			const issueData = await fetchIssueData(page);
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
	}, [isBottom, page, hasMore, consecutiveFetch]);

	useEffect(() => {
		const fetchData = async () => {
			const repoData = await fetchUserRepoList();
			setRepos(repoData);
		};
		fetchData();
	}, [session]);

	return (
		<div className="flex-1 overflow-auto p-32" ref={refScroll}>
			<h1 className="mb-4 text-2xl font-bold">My GitHub Issues</h1>
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
			{session && (session as CustomSession).username == process.env.User_Name && (
				<button
					className="fixed bottom-4 right-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
					onClick={() => setShowModal(true)}
				>
					Create New Issue
				</button>
			)}

			{showModal && (
				<div
					className="fixed inset-0 z-10 overflow-y-auto bg-gray-600 bg-opacity-50"
					id="my-modal"
				>
					<div className="relative top-10 mx-auto flex min-h-[80%] w-[60%] flex-col justify-between rounded-md border bg-white p-5 shadow-lg">
						<h2 className="text-center text-3xl font-bold">New Issue</h2>
						<div className="flex flex-1 flex-col">
							<div className="mt-4">
								<label
									htmlFor="repo-select"
									className="block text-sm font-medium text-gray-700"
								>
									Repo:
								</label>
								<Select onValueChange={setSelectedRepo} value={selectedRepo}>
									<SelectTrigger aria-label="Repository">
										<SelectValue placeholder="Select a repository" />
									</SelectTrigger>
									<SelectContent className="bg-white">
										{repos.map((repo, index) => (
											<SelectItem key={index} value={repo.name}>
												{repo.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="mt-4">
								<label
									htmlFor="issue-title"
									className="block text-sm font-medium text-gray-700"
								>
									Title:
								</label>
								<input
									type="text"
									id="issue-title"
									placeholder="Issue Title"
									className="w-full border px-2 py-2"
									value={issueTitle}
									onChange={(e) => setIssueTitle(e.target.value)}
								/>
							</div>
							<div className="mt-4 flex flex-1 flex-col">
								<label
									htmlFor="issue-content"
									className="block text-sm font-medium text-gray-700"
								>
									Content:
								</label>
								{previewMode ? (
									<article
										className="prose h-full flex-1 overflow-auto border p-2"
										dangerouslySetInnerHTML={{ __html: htmlContent }}
									/>
								) : (
									<textarea
										id="issue-content"
										placeholder="Issue Content"
										className="h-full w-full flex-1 border p-2"
										value={issueContent}
										onChange={(e) => setIssueContent(e.target.value)}
									/>
								)}
							</div>
						</div>
						<div className="flex justify-end space-x-2 p-2">
							<button
								onClick={togglePreviewMode}
								className="rounded border px-4 py-2"
							>
								{previewMode ? 'Edit' : 'Preview'}
							</button>
							<button
								className="rounded border bg-blue-500 px-4 py-2 text-white"
								onClick={createIssues}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default MyPostsPage;

'use client';

import { useEffect, useState } from 'react';
import React from 'react';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/src/components/ui/select';
import { fetchIssueData, createIssue, fetchUserRepoList } from '@/src/lib/actions';
import type { CustomSession, RepoData, IssueData } from '@/src/lib/type';

function MyPostsPage() {
	const { data: session } = useSession();
	const [issues, setIssues] = useState<IssueData[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [selectedRepo, setSelectedRepo] = useState('');
	const [issueTitle, setIssueTitle] = useState('');
	const [issueContent, setIssueContent] = useState('');

	const [repos, setRepos] = useState<RepoData[]>([]);

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
	useEffect(() => {
		const fetchData = async () => {
			if (session) {
				const issueData = await fetchIssueData(session as CustomSession);
				setIssues(issueData);
				const repoData = await fetchUserRepoList(session as CustomSession);
				setRepos(repoData);
			}
		};

		fetchData();
	}, [session]);

	return (
		<div className="p-4">
			<h1 className="mb-4 text-2xl font-bold">My GitHub Issues</h1>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{issues.map((issue) => (
					<div key={issue.number} className="rounded-lg border p-4">
						<Link
							href={`/my-posts/detail?issueId=${issue.number}&repoName=${issue.repoName}&repoOwner=${issue.repoOwner}`}
							className="font-bold"
						>
							{issue.title}
						</Link>
						<p className="text-gray-600">{issue.content}</p>
						<div className="mt-4 flex items-center">
							<Image
								src={issue.avatarUrl}
								width={40}
								height={40}
								alt={`Profile Pic for ${issue.userName}`}
								priority={true}
								className="rounded-full"
							/>
							<span>{issue.userName}</span>
						</div>
					</div>
				))}
			</div>
			<button
				className="fixed bottom-4 right-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
				onClick={() => setShowModal(true)}
			>
				Create New Issue
			</button>

			{showModal && (
				<div
					className="fixed inset-0 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50"
					id="my-modal"
				>
					<div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
						<div className="mt-3 text-center">
							<div className="mt-2">
								<Select onValueChange={setSelectedRepo} value={selectedRepo}>
									<SelectTrigger aria-label="Repository">
										<SelectValue placeholder="Select a repository" />
									</SelectTrigger>
									<SelectContent>
										{repos.map((repo) => (
											<SelectItem key={repo.name} value={repo.name}>
												{repo.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<input
									type="text"
									placeholder="Issue Title"
									className="mt-2 border p-2"
									value={issueTitle}
									onChange={(e) => setIssueTitle(e.target.value)}
								/>
								<textarea
									placeholder="Issue Content"
									className="mt-2 border p-2"
									rows={3}
									value={issueContent}
									onChange={(e) => setIssueContent(e.target.value)}
								></textarea>
							</div>
							<div className="items-center px-4 py-3">
								<button
									className="w-full rounded-md bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
									onClick={createIssues}
								>
									Submit
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default MyPostsPage;

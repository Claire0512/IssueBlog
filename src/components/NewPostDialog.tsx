'use client';

import { useState } from 'react';

import { useSession } from 'next-auth/react';

import { CopyIcon } from '@radix-ui/react-icons';

import { Button } from '@/src/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectItem,
	SelectContent,
} from '@/src/components/ui/select';
import { createIssue } from '@/src/lib/actions';
import type { CustomSession, RepoData } from '@/src/lib/type';

function NewPostDialog({ repos }: { repos: RepoData[] }) {
	const [issueTitle, setIssueTitle] = useState('');
	const [issueContent, setIssueContent] = useState('');
	const [selectedRepo, setSelectedRepo] = useState('');
	const [previewMode, setPreviewMode] = useState(false);
	const { data: session } = useSession();
	const togglePreviewMode = () => setPreviewMode(!previewMode);
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
	};
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="fixed bottom-8 right-8 rounded bg-[#412517] px-4 py-2 font-bold text-[#F9F1E0] ">
					New Post
				</Button>
			</DialogTrigger>
			<DialogContent className="fixed  overflow-y-auto bg-white">
				<DialogHeader className="relative top-10 mx-auto min-h-[80%] w-[60%] rounded-md border bg-white p-5 shadow-lg">
					<DialogTitle>New Issue</DialogTitle>
				</DialogHeader>
				<Label htmlFor="repo-select">Repo:</Label>
				<Select onValueChange={setSelectedRepo} value={selectedRepo}>
					<SelectTrigger aria-label="Repository">
						<SelectValue placeholder="Select a repository" />
					</SelectTrigger>
					<SelectContent>
						{repos.map((repo, index) => (
							<SelectItem key={index} value={repo.name}>
								{repo.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Label htmlFor="issue-title">Title:</Label>
				<Input
					id="issue-title"
					placeholder="Issue Title"
					value={issueTitle}
					onChange={(e) => setIssueTitle(e.target.value)}
				/>
				<Label htmlFor="issue-content">Content:</Label>
				{previewMode ? (
					<article dangerouslySetInnerHTML={{ __html: issueContent }} />
				) : (
					<textarea
						id="issue-content"
						placeholder="Issue Content"
						value={issueContent}
						onChange={(e) => setIssueContent(e.target.value)}
					/>
				)}
				<DialogFooter>
					<Button onClick={togglePreviewMode}>{previewMode ? 'Edit' : 'Preview'}</Button>
					<Button onClick={createIssues}>Submit</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
export default NewPostDialog;

'use client';

import { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from '@/src/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
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
import markdownToHtml from '@/src/lib/markdownToHtml';
import type { RepoData } from '@/src/lib/type';

function NewPostDialog({ repos }: { repos: RepoData[] }) {
	const [issueTitle, setIssueTitle] = useState('');
	const [issueContent, setIssueContent] = useState('');
	const [selectedRepo, setSelectedRepo] = useState('');
	const [previewMode, setPreviewMode] = useState(false);
	const [titleError, setTitleError] = useState('');
	const [contentError, setContentError] = useState('');
	const [open, setOpen] = useState(false);
	const { data: session } = useSession();
	const [htmlContent, setHtmlContent] = useState('');
	const togglePreviewMode = () => setPreviewMode(!previewMode);
	const [repoError, setRepoError] = useState('');
	const router = useRouter();
	const createIssues = async () => {
		setTitleError('');
		setContentError('');

		setRepoError('');
		if (!issueTitle.trim()) {
			setTitleError('Title is required.');
			return;
		}
		if (!selectedRepo) {
			setRepoError('Repository selection is required.');
			return;
		}

		if (issueContent.trim().length < 30) {
			setContentError('Content must be at least 30 characters.');
			return;
		}

		try {
			await createIssue({
				repoOwner: session?.username,
				repoName: selectedRepo,
				title: issueTitle,
				body: issueContent,
				session: session,
			});

			setIssueTitle('');
			setIssueContent('');
			setSelectedRepo('');
			setPreviewMode(false);
			setHtmlContent('');
			setOpen(false);
			router.refresh();
		} catch (error) {
			console.error('Error creating issue:', error);
		}
	};

	useEffect(() => {
		const processMarkdown = async () => {
			if (previewMode && issueContent) {
				const html = await markdownToHtml(issueContent);
				setHtmlContent(html);
			}
		};

		processMarkdown();
	}, [previewMode, issueContent]);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="fixed bottom-8 right-8 rounded-xl bg-[#412517]  px-4 py-2 text-xl  text-white">
					New Post
				</Button>
			</DialogTrigger>
			<DialogContent className="fixed flex min-h-[80%] flex-col  overflow-y-auto bg-white">
				<DialogHeader className="mx-auto h-full w-[60%] rounded-md p-4 text-center text-2xl  font-bold text-[#412517]">
					New Post
				</DialogHeader>
				<Label htmlFor="repo-select">Repo:</Label>
				<Select onValueChange={setSelectedRepo} value={selectedRepo}>
					<SelectTrigger
						aria-label="Repository"
						className={`rounded-md border-[1px] ${repoError ? 'border-red-500' : 'border-[#4125172f]'} p-4 focus:ring-0`}
					>
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
				<Label htmlFor="issue-title">Title:</Label>
				<Input
					id="issue-title"
					placeholder="Issue Title"
					value={issueTitle}
					onChange={(e) => setIssueTitle(e.target.value)}
					className={`rounded-md border-[1px] border-[#4125172f] p-4  border-${titleError ? 'red-500' : '[#4125172f]'} focus:ring-[#412517]`}
				/>
				<Label htmlFor="issue-content">Content:</Label>
				{previewMode ? (
					<article
						className="prose flex-1 break-words rounded-md border-[1px] border-[#4125172f] p-4 focus:outline-[#412517]"
						dangerouslySetInnerHTML={{ __html: htmlContent }}
					/>
				) : (
					<textarea
						id="issue-content"
						placeholder="Issue Content"
						value={issueContent}
						onChange={(e) => setIssueContent(e.target.value)}
						className={`flex-1 rounded-md border-[1px] border-${contentError ? 'red-500' : '[#4125172f]'} p-4 focus:ring-[#412517]`}
					/>
				)}
				<DialogFooter>
					<Button
						onClick={togglePreviewMode}
						className="w-1/4 bg-[#F9F1E0] text-[#412517]"
					>
						{previewMode ? 'Edit' : 'Preview'}
					</Button>
					<Button onClick={createIssues} className="w-1/4 bg-[#412517] text-[#F9F1E0]">
						Submit
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
export default NewPostDialog;

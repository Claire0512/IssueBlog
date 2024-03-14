'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

import { fetchIssueData, type IssueData } from '@/src/lib/actions';

function MyPostsPage() {
	const { data: session } = useSession();
	const [issues, setIssues] = useState<IssueData[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			if (session) {
				const data = await fetchIssueData(session);
				setIssues(data);
			}
		};

		fetchData();
	}, [session]);

	return (
		<div className="p-4">
			<h1 className="mb-4 text-2xl font-bold">My GitHub Issues</h1>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{issues.map((issue) => (
					<div key={issue.id} className="rounded-lg border p-4">
						<a
							href={issue.html_url}
							target="_blank"
							rel="noopener noreferrer"
							className="font-bold"
						>
							{issue.title}
						</a>
						<p className="text-gray-600">{issue.content}</p>
						<div className="mt-4 flex items-center">
							<Image
								src={issue.avatar_url}
								width={40}
								height={40}
								alt={`Profile Pic for ${issue.name}`}
								priority={true}
								className="rounded-full"
							/>
							<span>{issue.name}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default MyPostsPage;

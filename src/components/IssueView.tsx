import type { ReactionData } from '../lib/type';

import EmojiBar from './EmojiBar';

function IssueView({ html, reactions }: { html: string; reactions: ReactionData }) {
	return (
		<>
			<article
				className="prose m-6 max-w-none break-words"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
			<EmojiBar reactions={reactions} />
		</>
	);
}

export default IssueView;

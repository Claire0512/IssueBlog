import EmojiBar from "./EmojiBar"
import { ReactionData } from "../lib/type";

export default function IssueView({html, reactions}: {html: string, reactions: ReactionData}) {
	return (
		<>
			<article
				className="prose m-6 max-w-none break-words"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
			<EmojiBar reactions={reactions} />
		</>
	)
}

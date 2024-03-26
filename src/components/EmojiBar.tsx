import { ReactionData } from '../lib/type';

const reactionEmojis: { [key: string]: string } = {
	'+1': '👍',
	'-1': '👎',
	laugh: '😄',
	hooray: '🎉',
	confused: '😕',
	heart: '❤️',
	rocket: '🚀',
	eyes: '👀',
};

export default function EmojiBar({ reactions }: { reactions: ReactionData }) {
	return (
		<div className="flex p-4">
			{Object.entries(reactions).map(
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
	);
}

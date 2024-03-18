'use server';

import type { ReactionData, GitHubReaction } from './type';

export function aggregateReactions(reactions: GitHubReaction[]): ReactionData {
	const initialReactionData: ReactionData = {
		url: '',
		total_count: 0,
		'+1': 0,
		'-1': 0,
		laugh: 0,
		hooray: 0,
		confused: 0,
		heart: 0,
		rocket: 0,
		eyes: 0,
	};

	const reactionData = reactions.reduce((acc, reaction) => {
		if (reaction.content in acc) {
			acc[reaction.content]++;
		}
		acc.total_count++;
		return acc;
	}, initialReactionData);

	return reactionData;
}

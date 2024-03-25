import type { Account, Session, User, Profile } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import GitHubProvider from 'next-auth/providers/github';

export const options = {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_ID || '',
			clientSecret: process.env.GITHUB_SECRET || '',
			authorization: {
				params: { scope: 'read:user user:email public_repo' },
			},
		}),
	],
	callbacks: {
		async session({
			session,
			token,
		}: {
			session: Session;
			token: JWT;
			user: User;
		}): Promise<Session> {
			session.username = token.username;
			session.accessToken = token.accessToken;
			return session;
		},
		async jwt({
			token,
			account,
			profile,
		}: {
			token: JWT;
			account: Account | null;
			profile?: Profile | undefined;
		}): Promise<JWT> {
			if (profile) {
				token.username = profile.login;
			}
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
	},
	secret: process.env.NEXTAUTH_SECRET!,
};

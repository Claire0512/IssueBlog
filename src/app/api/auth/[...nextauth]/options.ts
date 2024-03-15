import GitHubProvider from 'next-auth/providers/github';

export const options = {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_ID || '',
			clientSecret: process.env.GITHUB_SECRET || '',
			authorization: {
				params: { scope: 'read:user user:email repo' },
			},
		}),
	],
	callbacks: {
		async session({ session, user, token }: any) {
			session.username = token.username;
			session.accessToken = token.accessToken;
			return session;
		},
		async jwt({ token, user, account, profile, isNewUser }: any) {
			if (profile) {
				token.username = profile.login;
			}
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

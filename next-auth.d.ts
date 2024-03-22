import NextAuth, { Account, DefaultSession, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface Session {
		accessToken?: Account.accessToken;
		username?: Account.username;
	}
	interface Profile {
		login?: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: Account.accessToken;
	}
}

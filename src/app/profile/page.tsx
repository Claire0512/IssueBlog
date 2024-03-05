'use server';

import { getServerSession } from 'next-auth';
import Image from 'next/image';

import { options } from '../api/auth/[...nextauth]/options';

import SignOutButton from '@/src/components/SignOutButton';

async function ProfilePage() {
	const session = await getServerSession(options);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div>
				<h1 className="text-center text-7xl">Profile</h1>
				<div className="mt-8 text-center">
					{session?.user?.name && <h2 className="text-4xl">{session.user.name}</h2>}

					{session?.user?.image && (
						<div className="flex justify-center">
							<Image
								src={session.user.image}
								width={200}
								height={200}
								alt={`Profile Pic for ${session.user.name}`}
								priority={true}
								className="mt-8 rounded-full"
							/>
						</div>
					)}
				</div>
				<div className="mt-8 flex justify-center">
					<SignOutButton />
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;

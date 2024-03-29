'use client';

import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import { buttonVariants } from '@/src/components/ui/button';
import { Button } from '@/src/components/ui/button';

function Navbar() {
	const { data: session } = useSession();

	return (
		<Disclosure as="nav" className="fixed min-h-[72px] w-full  bg-[#FAC13E] px-8">
			{({ open }) => (
				<>
					<div className="relative flex h-[72px] items-center pr-0">
						<h1 className="text-left text-[32px] font-bold text-[#412517] sm:ml-8">
							DINU's Blog
						</h1>
						<div className="hidden sm:ml-auto  sm:flex ">
							<Link
								href="/home"
								className={`text-[24px] font-semibold text-[#412517] ${buttonVariants({ variant: 'ghost' })}`}
							>
								Home
							</Link>
							<Link
								href="/post"
								className={`text-[24px] font-semibold text-[#412517] ${buttonVariants({ variant: 'ghost' })}`}
							>
								Post
							</Link>
							{session ? (
								<>
									<Link
										href="/profile"
										className={`text-[24px] font-semibold text-[#412517] ${buttonVariants({ variant: 'ghost' })}`}
									>
										Profile
									</Link>
									<Button
										variant="ghost"
										className="text-[24px] font-semibold text-[#412517] "
										onClick={() => signOut({ callbackUrl: '/' })}
									>
										Logout
									</Button>
								</>
							) : (
								<Button
									variant="ghost"
									className="text-[24px] font-semibold text-[#412517] "
									onClick={() => signIn('github', { callbackUrl: '/profile' })}
								>
									Login
								</Button>
							)}
						</div>
						<div className="absolute right-0 top-6 text-[#412517] sm:hidden">
							<Disclosure.Button>
								{open ? (
									<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
								) : (
									<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
								)}
							</Disclosure.Button>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden ">
						<div className="space-y-1 px-2 pb-3 pt-2 text-xl font-medium">
							<Disclosure.Button
								as={Link}
								href="/home"
								className={'block rounded-md px-3 py-2 '}
							>
								Home
							</Disclosure.Button>
							<Disclosure.Button
								as={Link}
								href="/post"
								className={'block rounded-md px-3 py-2'}
							>
								Post
							</Disclosure.Button>
							{session ? (
								<>
									<Disclosure.Button
										as={Link}
										href="/profile"
										className={'block rounded-md px-3 py-2'}
									>
										Profile
									</Disclosure.Button>
									<Disclosure.Button
										as={Button}
										variant="ghost"
										onClick={() => signOut({ callbackUrl: '/' })}
										className={'block rounded-md px-3 py-2'}
									>
										Logout
									</Disclosure.Button>
								</>
							) : (
								<Disclosure.Button
									as={Button}
									variant="ghost"
									onClick={() => signIn('github', { callbackUrl: '/profile' })}
									className={'block rounded-md px-3 py-2'}
								>
									Login
								</Disclosure.Button>
							)}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}

export default Navbar;

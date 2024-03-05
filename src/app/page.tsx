import SignInButton from '@/src/components/SignInButton';

function HomePage() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div>
				<h1 className="mb-8 text-center text-7xl">IssueBlog</h1>
				<SignInButton />
			</div>
		</div>
	);
}

export default HomePage;

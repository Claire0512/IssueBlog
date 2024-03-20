import Image from 'next/image';

function HomePage() {
	return (
		<div className="mt-40  flex items-center justify-center">
			<Image src="/0.png" alt="Image" width={1000} height={600} />
		</div>
	);
}

export default HomePage;

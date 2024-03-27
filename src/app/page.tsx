import Image from 'next/image';
import Link from 'next/link';

function HomePage() {
	return (
		<>
			<div className="relative flex min-h-screen items-center justify-center border-[72px] border-[#FAC13E] bg-[#F9F1E0] p-4">
				<div className="z-10 mx-auto flex max-w-screen-lg flex-col items-center p-4">
					<h1 className="mb-8 text-center text-[102px] font-extrabold text-[#412517]">
						DINU's Blog
					</h1>
					<Link
						href="/home"
						className="rounded-[25px] bg-[#412517] px-10 py-2 text-[32px] text-[#F9F1E0]"
					>
						View
					</Link>
				</div>
			</div>
			<div className="absolute bottom-0 right-0 p-1">
				<Image src="/author2.png" alt="" width={350} height={350} priority={true} />
			</div>
		</>
	);
}

export default HomePage;

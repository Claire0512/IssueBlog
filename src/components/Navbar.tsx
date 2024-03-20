import Link from 'next/link';

function Navbar() {
	return (
		<nav className="flex h-[100px] items-center justify-between bg-[#FAC13E] px-6">
			<h1 className="px-16 text-[36px] font-bold text-[#412517]">DINU's Blog</h1>
			<div>
				<Link href="/home" className="px-16 text-[28px] font-semibold text-[#412517]">
					Home
				</Link>
				<Link href="/post" className="px-16 text-[28px] font-semibold text-[#412517]">
					Post
				</Link>
				<Link href="/profile" className="px-16 text-[28px] font-semibold text-[#412517]">
					Profile
				</Link>
			</div>
		</nav>
	);
}

export default Navbar;

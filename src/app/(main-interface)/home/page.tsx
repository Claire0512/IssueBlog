import Image from 'next/image';

function HomePage() {
	return (
		<div className="mt-40 flex items-center justify-center">
			<div className="flex w-full max-w-6xl">
				<div className="flex w-1/2 justify-center">
					<Image src="/3.png" alt="DINU the Dog" width={500} height={600} />
				</div>

				<div className="flex w-1/2 flex-col justify-center space-y-8 px-2">
					<h1 className="text-5xl font-bold" style={{ color: '#412517' }}>
						DINU 狗
					</h1>
					<p className="text-2xl font-bold" style={{ color: '#412517' }}>
						生日:12/15 射手座(20)
					</p>
					<p className="text-2xl font-bold" style={{ color: '#412517' }}>
						是一隻經常被誤認成熊的狗，喜歡幫助朋友所以人緣很好，但異性緣意外很差，一直是萬年單身狗，目前還在積極尋找屬於自己的男性魅力中。
					</p>
					<p className="text-2xl font-bold" style={{ color: '#FAC13E' }}>
						#人緣好 #玻璃心 #開朗熱情 #害怕寂寞
					</p>
				</div>
			</div>
		</div>
	);
}

export default HomePage;

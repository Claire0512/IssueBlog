import Image from 'next/image';

function HomePage() {
	return (
		<div className="flex h-full w-full flex-1 items-center justify-center pt-20">
			<div className="flex h-full flex-col sm:w-2/3 sm:flex-row">
				<div className="flex justify-center sm:w-1/2">
					<Image
						src="/author.png"
						alt="DINU the Dog"
						width={350}
						height={350}
						priority={true}
					/>
				</div>

				<div className="flex flex-col justify-center space-y-8 p-8 sm:w-1/2 sm:p-0 sm:pe-12">
					<h1 className="text-4xl font-bold" style={{ color: '#412517' }}>
						DINU 狗
					</h1>
					<p className="text-xl font-bold" style={{ color: '#412517' }}>
						生日:12/15 射手座(20)
					</p>
					<p className="text-xl font-bold" style={{ color: '#412517' }}>
						是一隻經常被誤認成熊的狗，喜歡幫助朋友所以人緣很好，但異性緣意外很差，一直是萬年單身狗，目前還在積極尋找屬於自己的男性魅力中。
					</p>
					<p className="text-xl font-bold" style={{ color: '#FAC13E' }}>
						#人緣好 #玻璃心 #開朗熱情 #害怕寂寞
					</p>
				</div>
			</div>
		</div>
	);
}

export default HomePage;

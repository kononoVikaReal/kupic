import Image from 'next/image'

const UserBar = () => {
	return (
		<div className='flex items-center justify-center p-2 lg:p-4 border-2 rounded-full border-[#EEEDF2] dark:border-[#444]'>
			<div className='flex items-center gap-3'>
				<div className='w-10 h-10 rounded-full bg-[#E2D6F7] dark:bg-[#3C3C3C] relative overflow-hidden'>
					<Image
						src='/userLogo.webp'
						alt='User Logo'
						layout='fill'
						objectFit='cover'
						className='p-1'
					/>
				</div>
				<span className='text-xl text-gray-800 dark:text-gray-200'>
					Привет, гость!
				</span>
				<svg
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className='cursor-pointer'
				>
					<path
						d='M7 11C7 11 12.1554 18 14 18C15.8447 18 21 11 21 11'
						stroke='black'
						strokeWidth='1.75'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</div>
		</div>
	)
}

export default UserBar

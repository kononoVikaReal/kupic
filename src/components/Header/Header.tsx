import Link from 'next/link'
import UserBar from '../UserBar/UserBar'

const Header = () => {
	return (
		<div className='flex justify-between items-center flex-col lg:flex-row p-3 lg:p-6  gap-4'>
			<Link href={'/'} className='cursor-pointer text-2xl lg:text-4xl'>
				KUPI-{'>'}C
			</Link>
			<UserBar />
		</div>
	)
}

export default Header

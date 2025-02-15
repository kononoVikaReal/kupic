'use client'
import SubmitForm from '@/components/SubmitForm/SubmitForm'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const FormPage = () => {
	const [isAuth, setIsAuth] = useState<boolean>(false)
	useEffect(() => {
		const checkSession = async () => {
			const response = await fetch('/api/verifySession', {
				method: 'GET',
				credentials: 'include',
			})
			if (response.status === 200) {
				setIsAuth(true)
			}
		}
		checkSession()
	}, [])
	if (!isAuth) {
		return (
			<div className='flex w-full h-full items-center justify-center p-4'>
				<div className='flex flex-col items-center space-y-2 p-6 border border-gray-300 rounded-lg shadow-lg bg-white text-center'>
					<div className='flex items-center space-x-4'>
						<Image
							src='/unauthorized.webp'
							alt='Unauthorized'
							width={50}
							height={50}
						/>
						<span className='text-base xsm:text-lg md:text-xl lg:text-2xl font-semibold'>
							Вы не авторизованы
						</span>
					</div>
					<span className='text-gray-600 text-sm md:text-base lg:text-lg'>
						Авторизуйтесь, пожалуйста! (˃ᆺ˂)
					</span>
				</div>
			</div>
		)
	}
	return (
		<div className='container mx-auto p-4 my-auto'>
			<SubmitForm />
		</div>
	)
}

export default FormPage

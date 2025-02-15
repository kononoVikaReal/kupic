'use client'
import { Button } from '@/components/ui/button'
import { getItems } from '@/db/db'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ItemType } from '../list/page'

const DashboardPage = () => {
	const [isAuth, setIsAuth] = useState<boolean>(false)
	const [userItems, setUserItems] = useState<number[]>([])
	const [items, setItems] = useState<ItemType[]>([])
	const router = useRouter()
	useEffect(() => {
		const checkSession = async () => {
			try {
				const response = await fetch('/api/verifySession', {
					method: 'GET',
					credentials: 'include',
				})
				if (response.status === 200) {
					setIsAuth(true)
				}
				const res = await fetch(`/api/items?welcome=true`)
				const data = await res.json()
				setItems(data.items)
				const userData = getItems()
				setUserItems(userData)
			} catch (err) {
				console.error('Ошибка проверки сессии:', err)
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
		<div className='mx-[10%] mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
			{items.map(
				item =>
					userItems.includes(item.id) && (
						<div
							key={item.id}
							className='flex flex-col h-full rounded-xl shadow-lg border border-gray-200 overflow-hidden bg-white transition-transform hover:scale-105'
						>
							<div className='relative h-48 bg-gradient-to-r from-purple-600 to-pink-600'>
								{item.image ? (
									<Image
										src={item.image}
										alt='Фотография товара'
										layout='fill'
										objectFit='cover'
										className='rounded-t-xl'
									/>
								) : (
									<Image
										src='/zaglushka.webp'
										alt='Заглушка'
										layout='fill'
										objectFit='cover'
										className='rounded-t-xl'
									/>
								)}
							</div>
							<div className='p-4 flex flex-col flex-grow gap-4'>
								<div className='flex flex-col gap-2'>
									<h2 className='text-lg font-semibold text-gray-800'>
										{item.name}
									</h2>
									<div className='flex items-center gap-2 text-gray-600 text-sm'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 24 24'
											width={16}
											height={16}
											fill='currentColor'
										>
											<path
												d='M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18'
												stroke='currentColor'
												strokeWidth='1.5'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
										</svg>
										<span>{item.location}</span>
									</div>
								</div>
								<div className='text-sm text-gray-700'>
									<span className='inline-block bg-gray-100 text-gray-500 rounded-full px-3 py-1 text-xs font-medium'>
										{item.type}
									</span>
									<p className='mt-2 line-clamp-3'>{item.description}</p>
								</div>
							</div>
							{/* Кнопка действия */}
							<div className='mt-auto p-4 border-t border-gray-200'>
								<Button
									className='w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2 rounded-lg hover:opacity-90'
									onClick={() => router.push(`/item/${item.id}`)}
								>
									Открыть
								</Button>
							</div>
						</div>
					)
			)}
		</div>
	)
}

export default DashboardPage

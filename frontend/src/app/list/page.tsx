'use client'
import CategorySelector from '@/components/CategorySelector/CategorySelector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getItems } from '@/db/db'

import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

// Для пагинации
const ITEMS_PER_PAGE = 5

export type ItemType = {
	id: number
	name: string
	description: string
	location: string
	type: string
	image?: string | null
}

export interface FiltersState {
	[key: string]: string | number
}

const AdsPage = () => {
	const [isAuth, setIsAuth] = useState<boolean>(false)
	const [userItems, setUserItems] = useState<number[]>([])
	const [items, setItems] = useState<ItemType[]>([])
	const [page, setPage] = useState(1)
	const [searchQuery, setSearchQuery] = useState('')
	const [category, setCategory] = useState('')
	const [subFilters, setSubFilters] = useState<FiltersState>({})
	// Оптимизация, чтобы каждый раз не показывался Loader
	const [debouncedFilters, setDebouncedFilters] = useState(subFilters)
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedFilters(subFilters)
		}, 500)
		// Очищаем таймер, если subFilters изменяется до завершения задержки
		return () => {
			clearTimeout(handler)
		}
	}, [subFilters])

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [showLoader, setShowLoader] = useState<boolean>(isLoading)
	useEffect(() => {
		let timeout: NodeJS.Timeout

		if (isLoading) {
			timeout = setTimeout(() => {
				setShowLoader(true)
			}, 300) // Задержка 300 мс
		} else {
			setShowLoader(false) // Убираем лоадер мгновенно при завершении загрузки
		}

		return () => {
			clearTimeout(timeout) // Очищаем таймер при размонтировании или изменении isLoading
		}
	}, [isLoading])

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

	const router = useRouter()

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
		// console.log('Changed search query on ->', searchQuery)
		setPage(1)
	}

	useEffect(() => {
		const fetchItems = async () => {
			setIsLoading(true)
			function buildQueryParams(params: Record<string, unknown>): string {
				return (
					Object.entries(params)
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						.filter(([key, value]) => value !== undefined && value !== null)
						.map(
							([key, value]) =>
								`${encodeURIComponent(key)}=${encodeURIComponent(
									String(value)
								)}`
						)
						.join('&')
				)
			}

			const queryParams = buildQueryParams({
				category,
				page,
				searchQuery,
				...subFilters, // Подкатегории
			})

			const res = await fetch(
				`/api/items?page=${page}&limit=${ITEMS_PER_PAGE}&${queryParams}`
			)
			const data = await res.json()

			const userData = getItems()
			setUserItems(userData)
			// console.log('UserData -> ', userData)
			// console.log(
			// 	'ItemsData -> ',
			// 	data.items.map((data: { id: unknown }) => data.id)
			// )

			setItems(data.items)
			setIsLoading(false)
		}
		fetchItems()
	}, [page, searchQuery, category, debouncedFilters])

	// JSON.stringify превращает объект в строку, и React может сравнивать строки, чтобы определить, изменились ли зависимости. Иначе, даже если объект subFilters не изменился внутри, React видит его как новый при каждом рендере. Это вызывает ошибку.
	const memoizedSubFilters = useMemo(
		() => subFilters,
		[JSON.stringify(subFilters)]
	)
	useEffect(() => {
		setPage(1)
	}, [category, memoizedSubFilters])

	return (
		<div className='container mx-auto p-4 mb-32 lg:-mt-10'>
			<div className='flex flex-col items-center sm:flex-row justify-center gap-4'>
				<div className='w-full max-w-sm items-center gap-1.5'>
					<Input
						type='text'
						id='email'
						placeholder='Введите название объявления'
						value={searchQuery}
						onChange={handleSearch}
					/>
				</div>

				{isAuth && (
					<div className=''>
						<Button onClick={() => router.push(`/form`)} className=''>
							Разместить объявление
						</Button>
					</div>
				)}
			</div>
			{showLoader && (
				<div className='flex gap-12 justify-center items-center h-[80vh]'>
					<div className='flex flex-col items-center'>
						<Image
							src={'/loading.webp'}
							alt={'loading logo'}
							width={200}
							height={200}
						/>
						<span className='text-4xl'>Загружаемся!</span>
					</div>
					<Spin
						indicator={<LoadingOutlined style={{ fontSize: 128 }} spin />}
					/>
				</div>
			)}
			<div className='flex flex-col lg:flex-row gap-4'>
				{!showLoader && (
					<CategorySelector
						category={category}
						setCategory={setCategory}
						subFilters={subFilters}
						setSubFilters={setSubFilters}
					/>
				)}
				{/* Карточки объявлений */}
				<div className='mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{items.map(item => (
						<div
							key={item.id}
							className='flex flex-col h-full rounded-xl shadow-lg border border-gray-200 overflow-hidden bg-white transition-transform hover:scale-105'
						>
							{/* Изображение */}
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

							{/* Контент карточки */}
							<div className='p-4 flex flex-col flex-grow gap-4'>
								{/* Название и Локация */}
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

								{/* Тип и описание */}
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
									onClick={() => router.push(`/item/${item.id}`)}
									className='w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2 rounded-lg hover:opacity-90'
								>
									{/* Это объявления пользователя или нет? */}
									{userItems.includes(item.id)
										? 'Открыть (это ваше объявление)'
										: 'Открыть'}
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Пагинация */}
			{!isLoading && (
				<div className='fixed inset-x-0 bottom-0 py-4'>
					<div className='flex gap-4 items-center justify-center mx-auto max-w-xs rounded-full shadow-md border px-4 py-3 backdrop-filter backdrop-blur-[3px] '>
						<Button
							disabled={page === 1}
							onClick={() => setPage(prev => prev - 1)}
							className='px-4 py-2'
						>
							Назад
						</Button>
						<span className='text-gray-700 font-medium'>Страница {page}</span>
						<Button
							disabled={items.length < ITEMS_PER_PAGE}
							onClick={() => setPage(prev => prev + 1)}
							className='px-4 py-2'
						>
							Вперёд
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}

export default AdsPage

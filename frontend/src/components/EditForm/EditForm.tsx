'use client'
import { editAd } from '@/action'
import { getItems } from '@/db/db'
import { getExperienceLabel } from '@/lib/utils'
import Image from 'next/image'
import { useActionState, useEffect, useRef, useState } from 'react'

export type ItemDataType = {
	id: number
	userId: string
	name: string
	description: string
	location: string
	image: string
	type: string
	propertyType: string
	area: number
	rooms: number
	price: number
	brand?: string
	model?: string
	year?: number
	mileage?: number
	serviceType?: string
	experience?: number
	cost?: number
	workSchedule?: string
}

// Компонент для показа информации об объявлении
const AdCard = ({
	itemData,
	isUserAd,
	onEdit,
}: {
	itemData: ItemDataType
	isUserAd: boolean
	onEdit: () => void
}) => (
	<div className='flex items-center justify-center min-h-screen bg-gray-100'>
		<div className='bg-white rounded-lg shadow-lg overflow-hidden max-w-xl w-full'>
			<div className='relative w-full h-64 sm:h-96'>
				<div className='absolute inset-0'>
					<Image
						src={itemData.image ? itemData.image : '/zaglushka.webp'}
						alt={itemData.name}
						layout='fill'
						className='blur-lg object-cover w-full h-full'
						priority
					/>
				</div>
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
					<div className='relative w-40 sm:w-80 xsm:w-52 h-40 xsm:h-52 sm:h-80'>
						<Image
							src={itemData.image ? itemData.image : '/zaglushka.webp'}
							alt={itemData.name}
							layout='fill'
							className='object-cover rounded-lg shadow-lg'
							priority
						/>
					</div>
				</div>
				<div className='absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full z-10'>
					{itemData.type}
				</div>
			</div>

			<div className='p-6'>
				<h2 className='text-2xl font-bold text-gray-800 mb-2'>
					{itemData.name}
				</h2>
				<p className='text-gray-600 mb-4'>{itemData.description}</p>

				<div className='flex items-center text-gray-500 mb-4'>
					<svg
						className='h-5 w-5 mr-2'
						fill='none'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
						<path d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
					</svg>
					{itemData.location}
				</div>

				{itemData.type === 'Недвижимость' && (
					<div className='space-y-2 mb-4'>
						<div className='flex justify-between text-gray-600'>
							<span>Тип недвижимости:</span>
							<span className='font-semibold'>{itemData.propertyType}</span>
						</div>
						<div className='flex justify-between text-gray-600'>
							<span>Площадь:</span>
							<span className='font-semibold'>{itemData.area} м²</span>
						</div>
						<div className='flex justify-between text-gray-600'>
							<span>Количество комнат:</span>
							<span className='font-semibold'>{itemData.rooms}</span>
						</div>
					</div>
				)}

				{itemData.type === 'Авто' && (
					<div className='space-y-2 mb-4'>
						<div className='flex justify-between text-gray-600'>
							<span>Марка:</span>
							<span className='font-semibold'>{itemData.brand}</span>
						</div>
						<div className='flex justify-between text-gray-600'>
							<span>Модель:</span>
							<span className='font-semibold'>{itemData.model}</span>
						</div>
						<div className='flex justify-between text-gray-600'>
							<span>Год выпуска:</span>
							<span className='font-semibold'>{itemData.year}</span>
						</div>
						<div className='flex justify-between text-gray-600'>
							<span>Пробег:</span>
							<span className='font-semibold'>{itemData.mileage} км</span>
						</div>
					</div>
				)}

				{itemData.type === 'Услуги' && (
					<div className='space-y-2 mb-4'>
						<div className='flex justify-between text-gray-600'>
							<span>Тип услуги:</span>
							<span className='font-semibold'>{itemData.serviceType}</span>
						</div>
						<div className='flex justify-between text-gray-600'>
							<span>Опыт работы:</span>
							<span className='font-semibold'>
								{itemData.experience}{' '}
								{getExperienceLabel(Number(itemData.experience))}
							</span>
						</div>
						<div className='flex justify-between text-gray-600'>
							<span>График:</span>
							<span className='font-semibold'>{itemData.workSchedule}</span>
						</div>
					</div>
				)}

				{itemData.type !== 'Авто' && (
					<div className='mt-6 border-t pt-4'>
						<div className='flex justify-between items-center'>
							<span className='text-gray-600'>
								{itemData.type === 'Услуги' ? `Стоимость` : `Цена`}:
							</span>
							<span className='text-2xl font-bold text-blue-600'>
								{itemData.type === 'Услуги'
									? `${itemData.cost} ₽`
									: `${itemData.price} ₽`}
							</span>
						</div>
					</div>
				)}

				{isUserAd && (
					<div className='mt-4'>
						<button
							onClick={onEdit}
							className='w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
						>
							Редактировать
						</button>
					</div>
				)}
			</div>
		</div>
	</div>
)

const EditForm = ({ itemData }: { itemData: ItemDataType }) => {
	const [isAuth, setIsAuth] = useState<boolean>(false)
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState(itemData)
	const [userItems, setUserItems] = useState<number[]>([])
	// console.log('Item ->', itemData)
	useEffect(() => {
		const items = getItems()
		setUserItems(items)
	}, [])

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
			} catch (err) {
				console.error('Ошибка проверки сессии:', err)
			}
		}
		checkSession()
	}, [])

	const isUserAd = userItems.includes(itemData.id)

	const [state, formAction] = useActionState(editAd, {
		success: false,
		error: false,
		message: '',
	})

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		// console.log('Проверка handlechange ', name, value) // проверка, что приходит из input
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const formRef = useRef<HTMLFormElement | null>(null)

	if (!isEditing) {
		return (
			<AdCard
				itemData={itemData}
				isUserAd={isUserAd}
				onEdit={() => setIsEditing(true)}
			/>
		)
	}

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
		<div>
			{state.error && (
				<div className='mt-4 mx-auto flex flex-col sm:flex-row items-center p-4 bg-red-100 border border-red-400 rounded-lg shadow-md max-w-md'>
					<div className='w-16 h-16 flex-shrink-0'>
						<Image
							src='/error.webp'
							alt='Ошибка'
							width={64}
							height={64}
							className='rounded-full object-cover'
							priority
						/>
					</div>
					<div className='mt-2 sm:mt-0 sm:ml-4 text-center sm:text-left'>
						<h2 className='text-lg font-semibold text-red-700'>Ошибка!</h2>
						<p className='text-red-600'>{state.message}</p>
					</div>
				</div>
			)}

			{state.success && state.message === 'Объявление успешно обновлено!' && (
				<div className='mt-4 mx-auto flex flex-col sm:flex-row items-center p-4 bg-green-100 border border-green-400 rounded-lg shadow-md max-w-md'>
					<div className='w-16 h-16 flex-shrink-0'>
						<Image
							src='/success.webp'
							alt='Успех'
							width={64}
							height={64}
							className='rounded-full object-cover'
							priority
						/>
					</div>
					<div className='mt-2 sm:mt-0 sm:ml-4 text-center sm:text-left'>
						<h2 className='text-lg font-semibold text-green-700'>Успех!</h2>
						<p className='text-gray-800'>Объявление успешно изменено!</p>
					</div>
				</div>
			)}

			<form
				ref={formRef}
				action={formAction}
				className='space-y-6 bg-white rounded-lg shadow-lg p-6'
			>
				<input type='hidden' name='step' value={2} />
				<input type='hidden' name='id' value={itemData.id} />
				<input type='hidden' name='type' value={itemData.type} />

				{/* Базовая информация (всегда показываем) */}
				<div className='space-y-4'>
					<div>
						<label
							htmlFor='name'
							className='block text-sm font-medium text-gray-700'
						>
							Название
						</label>
						<input
							type='text'
							name='name'
							id='name'
							value={formData.name}
							onChange={handleChange}
							className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
						/>
					</div>

					<div>
						<label
							htmlFor='description'
							className='block text-sm font-medium text-gray-700'
						>
							Описание
						</label>
						<input
							name='description'
							id='desc'
							value={formData.description}
							onChange={handleChange}
							className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
						/>
					</div>

					<div>
						<label
							htmlFor='location'
							className='block text-sm font-medium text-gray-700'
						>
							Местоположение
						</label>
						<input
							type='text'
							name='location'
							id='location'
							value={formData.location}
							onChange={handleChange}
							className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
						/>
					</div>

					<div>
						<label
							htmlFor='image'
							className='block text-sm font-medium text-gray-700'
						>
							URL изображения
						</label>
						<input
							type='text'
							name='image'
							id='image'
							value={formData.image}
							onChange={handleChange}
							className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
						/>
					</div>

					{/* Поля для недвижимости */}
					{formData.type === 'Недвижимость' && (
						<div className='space-y-4'>
							<div>
								<label
									htmlFor='propertyType'
									className='block text-sm font-medium text-gray-700'
								>
									Тип недвижимости
								</label>
								<select
									name='propertyType'
									id='propertyType'
									value={formData.propertyType}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								>
									<option value='Квартира'>Квартира</option>
									<option value='Дом'>Дом</option>
									<option value='Коттедж'>Коттедж</option>
								</select>
							</div>

							<div>
								<label
									htmlFor='area'
									className='block text-sm font-medium text-gray-700'
								>
									Площадь (м²)
								</label>
								<input
									type='number'
									name='area'
									id='area'
									value={formData.area}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label
									htmlFor='rooms'
									className='block text-sm font-medium text-gray-700'
								>
									Количество комнат
								</label>
								<input
									type='number'
									name='rooms'
									id='rooms'
									value={formData.rooms}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label
									htmlFor='price'
									className='block text-sm font-medium text-gray-700'
								>
									Цена (₽)
								</label>
								<input
									type='number'
									name='price'
									id='price'
									value={formData.price}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								/>
							</div>
						</div>
					)}

					{/* Поля для авто */}
					{formData.type === 'Авто' && (
						<div className='space-y-4'>
							<div>
								<label
									htmlFor='brand'
									className='block text-sm font-medium text-gray-700'
								>
									Марка
								</label>
								<input
									type='text'
									name='brand'
									id='brand'
									value={formData.brand}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label
									htmlFor='model'
									className='block text-sm font-medium text-gray-700'
								>
									Модель
								</label>
								<input
									type='text'
									name='model'
									id='model'
									value={formData.model}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label
									htmlFor='year'
									className='block text-sm font-medium text-gray-700'
								>
									Год выпуска
								</label>
								<input
									type='number'
									name='year'
									id='year'
									value={formData.year}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label
									htmlFor='mileage'
									className='block text-sm font-medium text-gray-700'
								>
									Пробег (км)
								</label>
								<input
									type='number'
									name='mileage'
									id='mileage'
									value={formData.mileage}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								/>
							</div>
						</div>
					)}

					{/* Поля для услуг */}
					{formData.type === 'Услуги' && (
						<div className='space-y-4'>
							<div>
								<label
									htmlFor='serviceType'
									className='block text-sm font-medium text-gray-700'
								>
									Тип услуги
								</label>
								<input
									type='text'
									name='serviceType'
									id='serviceType'
									value={formData.serviceType}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label
									htmlFor='experience'
									className='block text-sm font-medium text-gray-700'
								>
									Опыт ({getExperienceLabel(Number(formData.experience))})
								</label>
								<input
									type='number'
									name='experience'
									id='experience'
									value={formData.experience}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label
									htmlFor='schedule'
									className='block text-sm font-medium text-gray-700'
								>
									График работы
								</label>
								<input
									type='text'
									name='workSchedule'
									id='workSchedule'
									value={formData.workSchedule}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label
									htmlFor='cost'
									className='block text-sm font-medium text-gray-700'
								>
									Стоимость (₽)
								</label>
								<input
									type='number'
									name='cost'
									id='cost'
									value={formData.cost}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								/>
							</div>
						</div>
					)}

					<div className='flex space-x-4 pt-4'>
						<button
							type='submit'
							className='flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors'
						>
							Опубликовать изменения
						</button>
						<button
							type='button'
							onClick={() => setIsEditing(false)}
							className='flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors'
						>
							Назад
						</button>
					</div>
				</div>
			</form>
		</div>
	)
}

export default EditForm

'use client'
import { addAd } from '@/action'
import { addItem } from '@/db/db'
import { getExperienceLabel } from '@/lib/utils'
import Image from 'next/image'

import { useActionState, useEffect, useRef, useState } from 'react'

// Хук для управления formData
export const useFormData = () => {
	const [formData, setFormData] = useState({
		name: '',
		desc: '',
		location: '',
		image: '',
		type: 'Авто',
		propertyType: 'Квартира',
		area: 1,
		rooms: 1,
		price: 1,
		brand: '',
		model: '',
		year: 1,
		mileage: 1,
		serviceType: 'Ремонт',
		experience: 1,
		cost: 1,
		schedule: 'По договоренности',
	})

	// Функция для получения текущего значения formData
	const getFormData = () => formData

	return { formData, setFormData, getFormData }
}

const SubmitForm = () => {
	const [currentStep, setCurrentStep] = useState<number>(1)

	const { formData, setFormData } = useFormData()

	const [state, formAction] = useActionState(addAd, {
		success: false,
		error: false,
		step: currentStep,
		message: '',
		id: '',
	})

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		// console.log({ name, value })
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const formRef = useRef<HTMLFormElement | null>(null)

	useEffect(() => {
		// console.log('Look at step -> ', currentStep)
		if (state.success) {
			if (currentStep === 2) {
				formRef.current?.reset()
				setFormData({
					name: '',
					desc: '',
					location: '',
					image: '',
					type: 'Авто',
					propertyType: 'Квартира',
					area: 1,
					rooms: 1,
					price: 1,
					brand: '',
					model: '',
					year: 1,
					mileage: 1,
					serviceType: 'Ремонт',
					experience: 1,
					cost: 1,
					schedule: 'По договоренности',
				})
				if (state.id) {
					addItem(state.id)
				}
				setCurrentStep(1)
				state.step = 1
			} else {
				setCurrentStep(2)
			}
		} else {
			if (state.step === 1) {
				setCurrentStep(1)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state])

	return (
		<>
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

			{state.success && state.message === 'Успех!' && (
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
						<p className='text-gray-800'>Объявление успешно опубликовано!</p>
					</div>
				</div>
			)}
			{/* {state.error && (
				<div className='mt-4 p-4 text-red-700 bg-red-100 border border-red-400 rounded-md'>
					<p>{state.message}</p>
				</div>
			)}

			{state.success && state.message === 'Успех!' && (
				<div className='mt-4 p-4 text-gray-800 bg-green-100 border border-green-400 rounded-md'>
					<p>Объявление успешно опубликовано!</p>
				</div>
			)} */}

			<form ref={formRef} className='p-4 space-y-6' action={formAction}>
				<input type='text' name='step' value={currentStep} hidden readOnly />

				<div className={`space-y-6`}>
					<div className='space-y-2'>
						<label
							htmlFor='name'
							className='text-lg font-semibold text-gray-700'
						>
							Название объявления
						</label>
						<input
							type='text'
							name='name'
							value={formData.name}
							onChange={handleChange}
							placeholder='Квартира в центре Москвы'
							className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400'
						/>
					</div>

					<div className='space-y-2'>
						<label
							htmlFor='desc'
							className='text-lg font-semibold text-gray-700'
						>
							Описание объявления
						</label>
						<input
							type='text'
							name='desc'
							value={formData.desc}
							onChange={handleChange}
							placeholder='Квартира в центре Москвы продается срочно!'
							className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400'
						/>
					</div>

					<div className='space-y-2'>
						<label
							htmlFor='location'
							className='text-lg font-semibold text-gray-700'
						>
							Локация объявления
						</label>
						<input
							type='text'
							name='location'
							value={formData.location}
							onChange={handleChange}
							placeholder='Москва, ЦАО'
							className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400'
						/>
					</div>

					<div className='space-y-2'>
						<label
							htmlFor='image'
							className='text-lg font-semibold text-gray-700'
						>
							Ссылка на картинку или фото
						</label>
						<input
							type='text'
							name='image'
							value={formData.image}
							onChange={handleChange}
							placeholder='pinterest.com/pin32'
							className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400'
						/>
					</div>

					<div className='space-y-2'>
						<label
							htmlFor='type'
							className='text-lg font-semibold text-gray-700'
						>
							Тип объявления
						</label>
						<select
							name='type'
							value={formData.type}
							onChange={handleChange}
							className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						>
							<option value='Недвижимость'>Недвижимость</option>
							<option value='Авто'>Авто</option>
							<option value='Услуги'>Услуги</option>
						</select>
					</div>

					{currentStep === 1 && (
						<div className='mt-6'>
							<button className='w-full px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300'>
								Перейти на следующий шаг
							</button>
						</div>
					)}
				</div>

				{currentStep === 2 && formData.type === 'Недвижимость' && (
					<div className='space-y-6'>
						<div className='space-y-2'>
							<label
								htmlFor='propertyType'
								className='text-lg font-semibold text-gray-700'
							>
								Тип недвижимости
							</label>
							<select
								name='propertyType'
								value={formData.propertyType}
								onChange={handleChange}
								className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							>
								<option value='Квартира'>Квартира</option>
								<option value='Дом'>Дом</option>
								<option value='Коттедж'>Коттедж</option>
							</select>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='area'
								className='text-lg font-semibold text-gray-700'
							>
								Площадь (кв. м)
							</label>
							<input
								type='number'
								name='area'
								value={formData.area}
								onChange={handleChange}
								className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='rooms'
								className='text-lg font-semibold text-gray-700'
							>
								Количество комнат
							</label>
							<input
								type='number'
								name='rooms'
								value={formData.rooms}
								onChange={handleChange}
								className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='price'
								className='text-lg font-semibold text-gray-700'
							>
								Цена
							</label>
							<input
								type='number'
								name='price'
								value={formData.price}
								onChange={handleChange}
								className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
					</div>
				)}

				{currentStep === 2 && formData.type === 'Авто' && (
					<div className='space-y-6'>
						<div className='space-y-2'>
							<label
								htmlFor='brand'
								className='text-lg font-semibold text-gray-700'
							>
								Марка
							</label>
							<select
								name='brand'
								value={formData.brand}
								onChange={handleChange}
								className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							>
								<option value='Toyota'>Toyota</option>
								<option value='BMW'>BMW</option>
								<option value='Audi'>Audi</option>
							</select>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='model'
								className='text-lg font-semibold text-gray-700'
							>
								Модель
							</label>
							<input
								type='text'
								name='model'
								value={formData.model}
								onChange={handleChange}
								className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='year'
								className='text-lg font-semibold text-gray-700'
							>
								Год выпуска
							</label>
							<input
								type='number'
								name='year'
								value={formData.year}
								onChange={handleChange}
								className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='mileage'
								className='text-lg font-semibold text-gray-700'
							>
								Пробег (км)
							</label>
							<input
								type='number'
								name='mileage'
								value={formData.mileage}
								onChange={handleChange}
								className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
					</div>
				)}

				{currentStep === 2 && formData.type === 'Услуги' && (
					<div className='space-y-6'>
						<div className='space-y-2'>
							<label
								htmlFor='serviceType'
								className='text-lg font-semibold text-gray-700'
							>
								Тип услуги
							</label>
							<select
								name='serviceType'
								value={formData.serviceType}
								onChange={handleChange}
								className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							>
								<option value='Ремонт'>Ремонт</option>
								<option value='Уборка'>Уборка</option>
								<option value='Доставка'>Доставка</option>
							</select>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='experience'
								className='text-lg font-semibold text-gray-700'
							>
								Опыт работы ({getExperienceLabel(Number(formData.experience))})
							</label>
							<input
								type='number'
								name='experience'
								value={formData.experience}
								onChange={handleChange}
								className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='cost'
								className='text-lg font-semibold text-gray-700'
							>
								Стоимость
							</label>
							<input
								type='number'
								name='cost'
								value={formData.cost}
								onChange={handleChange}
								className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='schedule'
								className='text-lg font-semibold text-gray-700'
							>
								График работы
							</label>
							<input
								type='text'
								name='schedule'
								value={formData.schedule}
								onChange={handleChange}
								className='w-full px-4 py-2 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
					</div>
				)}
				{currentStep === 2 && (
					<div className='mt-6'>
						<button className='w-full px-6 py-3 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300'>
							Опубликовать объявление
						</button>
					</div>
				)}
			</form>
		</>
	)
}

export default SubmitForm

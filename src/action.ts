'use server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Валидационная схема для общих данных из submitForm
const baseSchema = z.object({
	name: z.string().min(1, { message: 'Введите название!' }),
	description: z.string().min(1, { message: 'Введите описание!' }),
	location: z.string().min(1, { message: 'Введите локацию!' }),
	type: z.string().min(1, { message: 'Выберите категорию!' }),
	image: z
		.string()
		.optional()
		.refine(
			value =>
				!value || value.startsWith('http://') || value.startsWith('https://'),
			{
				message:
					'Ссылка на изображение должна быть пустой или начинаться с http:// или https://',
			}
		),
})

// Валидационная схема для общих данных из editForm
const editBaseSchema = baseSchema.merge(
	z.object({
		id: z.number().gt(-1, {
			message:
				'id объявления должно быть больше -1! Но вы эту информацию и не должны видеть...что-то пошло не так',
		}),
	})
)

// Валидационные схемы данных под каждую из категорий
const realEstateSchema = z.object({
	propertyType: z.string().min(1, { message: 'Выберите тип недвижимости!' }),
	area: z.number().positive({ message: 'Введите площадь!' }),
	rooms: z.number().positive({ message: 'Введите количество комнат!' }),
	price: z.number().positive({ message: 'Введите цену!' }),
})

const autoSchema = z.object({
	brand: z.string().min(1, { message: 'Выберите марку!' }),
	model: z.string().min(1, { message: 'Введите модель!' }),
	year: z.number().positive({ message: 'Введите год выпуска!' }),
	mileage: z.number().optional(),
})

const serviceSchema = z.object({
	serviceType: z.string().min(1, { message: 'Выберите тип услуги!' }),
	experience: z.number().positive({ message: 'Введите опыт работы!' }),
	cost: z.number().positive({ message: 'Введите стоимость!' }),
	workSchedule: z.string().optional(),
})

// Валидационная схема для авторизации
const loginSchema = z.object({
	username: z
		.string()
		.min(4, { message: 'Минимальная длина логина 4 символов!' }),
	password: z
		.string()
		.min(4, { message: 'Минимальная длина пароля 4 символов!' }),
})

// Базовый URL для отправки запросов
const API_ITEMS_URL = 'http://localhost:3000/api/items'
const API_BASE_URL = 'http://localhost:3000'

export const addAd = async (
	prevState: {
		success: boolean
		error: boolean
		step: number
		message: string
		id: string
	},
	formData: FormData
) => {
	const baseData = {
		name: formData.get('name'),
		description: formData.get('desc'),
		location: formData.get('location'),
		type: formData.get('type'),
		image: formData.get('image'),
	}
	const baseValidation = baseSchema.safeParse(baseData)
	if (!baseValidation.success) {
		return {
			success: false,
			error: true,
			step: 1,
			id: '',
			message: baseValidation.error.errors[0].message,
		}
	}
	if (prevState.step === 1) {
		return {
			success: true,
			error: false,
			step: 2,
			id: '',
			message: '',
		}
	}
	let additionalData = {}
	switch (baseData.type) {
		case 'Недвижимость':
			// Проверка на начальные нули и недопустимые символы
			if (
				!/^[1-9]\d*$/.test(String(formData.get('area'))) || // Только цифры, начиная с 1-9
				!/^[1-9]\d*$/.test(String(formData.get('rooms'))) ||
				!/^[1-9]\d*$/.test(String(formData.get('price')))
			) {
				return {
					success: false,
					error: true,
					step: 2,
					id: '',
					message:
						'Поля "Площадь", "Количество комнат" и "Цена" должны содержать только цифры и не начинаться с нуля.',
				}
			}

			additionalData = {
				propertyType: formData.get('propertyType'),
				area: Number(formData.get('area')),
				rooms: Number(formData.get('rooms')),
				price: Number(formData.get('price')),
			}

			const realEstateValidation = realEstateSchema.safeParse(additionalData)
			if (!realEstateValidation.success) {
				return {
					success: false,
					error: true,
					step: 2,
					id: '',
					message: realEstateValidation.error.errors[0].message,
				}
			}

			break

		case 'Авто':
			// Проверка на начальные нули
			if (
				!/^(0|[1-9]\d*)$/.test(String(formData.get('year'))) ||
				!/^(0|[1-9]\d*)$/.test(String(formData.get('mileage')))
			) {
				return {
					success: false,
					error: true,
					step: 2,
					id: '',
					message:
						'Поля "Год выпуска" и "Пробег" не должны содержать начальных нулей.',
				}
			}
			additionalData = {
				brand: formData.get('brand'),
				model: formData.get('model'),
				year: Number(formData.get('year')),
				mileage: Number(formData.get('mileage')),
			}

			const autoValidation = autoSchema.safeParse(additionalData)
			if (!autoValidation.success) {
				return {
					success: false,
					error: true,
					step: 2,
					id: '',
					message: autoValidation.error.errors[0].message,
				}
			}

			break

		case 'Услуги':
			// Проверка на начальные нули
			if (
				!/^(0|[1-9]\d*)$/.test(String(formData.get('experience'))) ||
				!/^(0|[1-9]\d*)$/.test(String(formData.get('cost')))
			) {
				return {
					success: false,
					error: true,
					step: 2,
					id: '',
					message:
						'Поля "Опыт работы" и "Стоимость" не должны содержать начальных нулей.',
				}
			}

			additionalData = {
				serviceType: formData.get('serviceType'),
				experience: Number(formData.get('experience')),
				cost: Number(formData.get('cost')),
				workSchedule: formData.get('schedule'),
			}

			const serviceValidation = serviceSchema.safeParse(additionalData)
			if (!serviceValidation.success) {
				return {
					success: false,
					error: true,
					step: 2,
					id: '',
					message: serviceValidation.error.errors[0].message,
				}
			}

			break

		default:
			break
	}
	// Комбинируем данные для body запроса
	const fullData = {
		...baseData,
		...additionalData,
	}
	// Отправляем запрос
	const response = await fetch(API_ITEMS_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(fullData),
	})

	if (!response) {
		return {
			success: false,
			error: true,
			step: 2,
			id: '',
			message: 'Ошибка при отправке объявления!',
		}
	}

	try {
		// Проверяем ответ
		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.error || 'Ошибка при отправке данных')
		}

		// Парсим успешный ответ
		const result = await response.json()
		console.log('Успешно отправлено:', result)
		return {
			success: true,
			error: false,
			step: 2,
			message: 'Успех!',
			id: result.id,
		}
	} catch (error) {
		console.error('Ошибка при отправке объявления:', error)
		return {
			success: false,
			error: true,
			step: 2,
			id: '',
			message: 'Ошибка при отправке объявления!',
		}
	}
}

export const editAd = async (
	prevState: {
		success: boolean
		error: boolean
		message: string
	},
	formData: FormData
) => {
	const baseData = {
		id: Number(formData.get('id')),
		name: formData.get('name'),
		description: formData.get('description'),
		location: formData.get('location'),
		type: formData.get('type'),
		image: formData.get('image'),
	}
	console.log('baseData -> ', baseData)

	// Валидируем общие данные
	const baseValidation = editBaseSchema.safeParse(baseData)

	if (!baseValidation.success) {
		return {
			success: false,
			error: true,
			message: baseValidation.error.errors[0].message,
		}
	}

	let additionalData = {}
	let validationResult

	// Валидируем спефические данные
	switch (baseData.type) {
		case 'Недвижимость':
			// Проверка на начальные нули и недопустимые символы
			if (
				!/^[1-9]\d*$/.test(String(formData.get('area'))) || // Только цифры, начиная с 1-9
				!/^[1-9]\d*$/.test(String(formData.get('rooms'))) ||
				!/^[1-9]\d*$/.test(String(formData.get('price')))
			) {
				return {
					success: false,
					error: true,
					step: 2,
					id: '',
					message:
						'Поля "Площадь", "Количество комнат" и "Цена" должны содержать только цифры и не начинаться с нуля.',
				}
			}

			additionalData = {
				propertyType: formData.get('propertyType'),
				area: Number(formData.get('area')),
				rooms: Number(formData.get('rooms')),
				price: Number(formData.get('price')),
			}
			validationResult = realEstateSchema.safeParse(additionalData)
			break

		case 'Авто':
			// Проверяем на наличие незначащих нулей в начале
			if (
				!/^(0|[1-9]\d*)$/.test(String(formData.get('year'))) ||
				!/^(0|[1-9]\d*)$/.test(String(formData.get('mileage')))
			) {
				return {
					success: false,
					error: true,
					message:
						'Поля "Год выпуска" и"Пробег" не должны содержать начальных нулей.',
				}
			}

			additionalData = {
				brand: formData.get('brand'),
				model: formData.get('model'),
				year: Number(formData.get('year')),
				mileage: Number(formData.get('mileage')),
				price: Number(formData.get('price')),
			}
			validationResult = autoSchema.safeParse(additionalData)
			break

		case 'Услуги':
			// Проверяем на наличие незначащих нулей в начале
			if (
				!/^(0|[1-9]\d*)$/.test(String(formData.get('experience'))) ||
				!/^(0|[1-9]\d*)$/.test(String(formData.get('cost')))
			) {
				return {
					success: false,
					error: true,
					message:
						'Поля "Опыт работы" и "Стоимость" не должны содержать начальных нулей.',
				}
			}

			additionalData = {
				serviceType: formData.get('serviceType'),
				experience: Number(formData.get('experience')),
				cost: Number(formData.get('cost')),
				workSchedule: formData.get('workSchedule'),
			}
			validationResult = serviceSchema.safeParse(additionalData)
			break

		default:
			return {
				success: false,
				error: true,
				message: 'Неверный тип объявления!',
			}
	}

	if (!validationResult.success) {
		return {
			success: false,
			error: true,
			message: validationResult.error.errors[0].message,
		}
	}

	// Комбинируем данные для body запроса
	const fullData = {
		...baseData,
		...additionalData,
	}

	try {
		// Отправляем PUT-запрос
		const response = await fetch(`${API_ITEMS_URL}/${baseData.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(fullData),
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.error || 'Ошибка при обновлении объявления')
		}
		// Ревалидация данных
		revalidatePath('/')
		revalidatePath('/list')
		revalidatePath(`/items/${baseData.id}`)
		// const result = await response.json()
		return {
			success: true,
			error: false,
			message: 'Объявление успешно обновлено!',
		}
	} catch (error) {
		console.error('Ошибка при обновлении объявления:', error)
		return {
			success: false,
			error: true,
			message: 'Ошибка при обновлении объявления!',
		}
	}
}

export const login = async (
	prevState: {
		success: boolean
		error: boolean
		message: string
		username: string
		password: string
	},
	formData: FormData
) => {
	const loginData = {
		username: formData.get('username') as string,
		password: formData.get('password') as string,
	}
	const loginValidation = loginSchema.safeParse(loginData)
	if (!loginValidation.success) {
		return {
			success: false,
			error: true,
			message: loginValidation.error.errors[0].message,
			username: loginData.username,
			password: loginData.password,
		}
	}
	try {
		const response = await fetch(`${API_BASE_URL}/api/login`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(loginData),
		})

		if (!response.ok) {
			const errorData = await response.json()
			return {
				success: false,
				error: true,
				message: errorData.error || 'Ошибка при авторизации',
				username: loginData.username,
				password: loginData.password,
			}
		}

		// Проверяем, получили ли мы файл cookie в заголовках ответов
		const cookies = response.headers.get('set-cookie')
		if (!cookies) {
			return {
				success: false,
				error: true,
				message: 'No authentication cookie received',
				username: loginData.username,
				password: loginData.password,
			}
		}
		revalidatePath('/dashboard')
		return {
			success: true,
			error: false,
			message: 'Успешная авторизация!',
			username: loginData.username,
			password: loginData.password,
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return {
			success: false,
			error: true,
			message: 'Network or server error occurred',
			username: loginData.username,
			password: loginData.password,
		}
	}
}

import { NextRequest, NextResponse } from 'next/server'

// Типы данных под каждую категорию
type Reality = {
	propertyType?: number
	rooms?: number
	area?: number
	price?: number
}

type Auto = {
	brand?: string
	model?: string
	year?: number
	mileage?: number
}

type Services = {
	serviceType?: string
	experience?: number
	cost?: number
	workSchedule?: string
}

type Ad = Reality &
	Auto &
	Services & {
		id: string
		name: string
		description: string
		location: string
		type: 'Недвижимость' | 'Авто' | 'Услуги'
		image?: string | null
	}

// Базовый URL для запросов на сервер
const API_BASE_URL = 'http://localhost:3001/items'

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams

	const pageParam = searchParams.get('page')
	const categoryParam = searchParams.get('category') || 'any'
	const search = searchParams.get('searchQuery') || ''
	const welcomePage = searchParams.get('welcome') || ''

	const categoryMap: Record<string, Ad['type'] | null> = {
		real_estate: 'Недвижимость',
		auto: 'Авто',
		services: 'Услуги',
	}

	const category = categoryMap[categoryParam] || 'any'
	if (categoryParam !== 'any' && !category) {
		return new NextResponse('Предоставлен неправильный параметр категории!', {
			status: 400,
		})
	}

	// Специфические фильтры
	const filters: Record<string, string | number | undefined> = {
		propertyType: searchParams.get('propertyType') || undefined,
		area: searchParams.get('area')
			? Number(searchParams.get('area'))
			: undefined,
		rooms: searchParams.get('rooms')
			? Number(searchParams.get('rooms'))
			: undefined,
		price: searchParams.get('price')
			? Number(searchParams.get('price'))
			: undefined,
		brand: searchParams.get('brand') || undefined,
		model: (searchParams.get('model') as string) || undefined,
		year: searchParams.get('year')
			? Number(searchParams.get('year'))
			: undefined,
		mileage: searchParams.get('mileage')
			? Number(searchParams.get('mileage'))
			: undefined,
		serviceType: searchParams.get('serviceType') || undefined,
		experience: searchParams.get('experience')
			? Number(searchParams.get('experience'))
			: undefined,
		cost: searchParams.get('cost')
			? Number(searchParams.get('cost'))
			: undefined,
		workSchedule: searchParams.get('workSchedule') || undefined,
	}

	// Проверяем и парсим параметр "page"
	const page =
		pageParam && !isNaN(Number(pageParam)) ? parseInt(pageParam, 10) : 1
	if (!page)
		return new NextResponse('Отсутствуют необходимые поля!', {
			status: 401,
		})

	// Для пагинации
	const itemsPerPage = 5

	const response = await fetch(API_BASE_URL)
	const data: Ad[] = await response.json()
	if (welcomePage === 'true') {
		// Ответ с данными
		return NextResponse.json({
			items: data,
		})
	}
	// Фильтрация данных
	const filteredAds = data.filter(ad => {
		const matchesCategory = category === 'any' || ad.type === category

		if (matchesCategory) {
			// Фильтры для недвижимости
			if (category === 'Недвижимость') {
				if (
					(filters.propertyType && ad.propertyType !== filters.propertyType) ||
					(filters.area && ad.area !== filters.area) ||
					(filters.rooms && ad.rooms !== filters.rooms) ||
					(filters.price && ad.price !== filters.price)
				) {
					return false
				}
			}

			// Фильтры для авто
			if (category === 'Авто') {
				if (
					(filters.brand && ad.brand !== filters.brand) ||
					(filters.model &&
						!String(ad.model)
							.toLowerCase()
							.includes(String(filters.model).toLowerCase())) ||
					(filters.year && ad.year !== filters.year) ||
					(filters.mileage && ad.mileage !== filters.mileage)
				) {
					return false
				}
			}

			// Фильтры для услуг
			if (category === 'Услуги') {
				if (
					(filters.serviceType && ad.serviceType !== filters.serviceType) ||
					(filters.experience && ad.experience !== filters.experience) ||
					(filters.cost && ad.cost !== filters.cost) ||
					(filters.schedule && ad.workSchedule !== filters.workSchedule)
				) {
					return false
				}
			}
		}

		// Проверка на совпадение по названию объявления
		const matchesSearch = search
			? ad.name.toLowerCase().includes(search.toLowerCase())
			: true

		return matchesCategory && matchesSearch
	})

	// Пагинация
	const safePage = page > 0 ? page : 1
	const start = (safePage - 1) * itemsPerPage
	const end = start + itemsPerPage
	const paginatedAds = filteredAds.slice(start, end)

	// Проверка на отсутствие объявлений
	if (paginatedAds.length === 0) {
		return NextResponse.json(
			{
				items: [],
				total: filteredAds.length,
				page: safePage,
				totalPages: Math.ceil(filteredAds.length / itemsPerPage),
				message: 'Объявления не найдены',
			},
			{ status: 404 }
		)
	}

	// Ответ с данными
	return NextResponse.json({
		items: paginatedAds,
		total: filteredAds.length,
		page: safePage,
		totalPages: Math.ceil(filteredAds.length / itemsPerPage),
	})
}

export async function POST(request: Request) {
	try {
		// Получаем тело запроса
		const body = await request.json()
		console.log('POST REQUEST -> ', JSON.stringify(body))
		// Валидация данных
		const {
			name,
			description,
			location,
			type,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			image,
			propertyType,
			area,
			rooms,
			price,
			brand,
			model,
			year,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			mileage,
			serviceType,
			experience,
			cost,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			workSchedule,
		} = body

		if (!name || !description || !location || !type) {
			return NextResponse.json(
				{
					error:
						'Обязательные поля не заполнены: name, description, location, type',
				},
				{ status: 400 }
			)
		}

		// Проверяем тип объявления и необходимые поля
		if (type === 'Недвижимость') {
			if (!propertyType || !area || !rooms || !price) {
				return NextResponse.json(
					{
						error:
							'Для недвижимости обязательны поля: propertyType, area, rooms, price',
					},
					{ status: 400 }
				)
			}
		} else if (type === 'Авто') {
			if (!brand || !model || !year) {
				return NextResponse.json(
					{ error: 'Для авто обязательны поля: brand, model, year' },
					{ status: 400 }
				)
			}
		} else if (type === 'Услуги') {
			if (!serviceType || !experience || !cost) {
				return NextResponse.json(
					{
						error: 'Для услуг обязательны поля: serviceType, experience, cost',
					},
					{ status: 400 }
				)
			}
		} else {
			return NextResponse.json(
				{
					error:
						'Некорректное значение поля type. Возможные значения: "Недвижимость", "Авто", "Услуги"',
				},
				{ status: 400 }
			)
		}

		// Отправляем данные на сервер
		const response = await fetch(API_BASE_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		const responseData = await response.json()

		if (response.ok) {
			return NextResponse.json(responseData, { status: 201 })
		} else {
			return NextResponse.json(
				{ error: responseData.error || 'Ошибка при создании объявления' },
				{ status: response.status }
			)
		}
	} catch (error) {
		console.error('Ошибка при создании объявления:', error)
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}

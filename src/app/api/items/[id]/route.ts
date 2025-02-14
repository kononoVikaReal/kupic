import { NextResponse } from 'next/server'
// Базовый URL для запросов на сервер
const API_BASE_URL = 'http://localhost:3001/items'

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = await params

	console.log('Param id -> ', id)
	console.log(`API URL -> http://localhost:3001/items/${id}`)
	try {
		const response = await fetch(`${API_BASE_URL}/${id}`)

		// Получаем текстовый ответ, чтобы обработать как строку или JSON
		const text = await response.text()

		let data
		try {
			// Пробуем распарсить ответ как JSON, если это возможно
			data = JSON.parse(text)
		} catch (jsonError) {
			// Если не получилось распарсить, значит, это просто текст
			console.error('Ошибка при парсинге JSON:', jsonError)
			data = text // Используем строку как данные
		}

		// Обрабатываем ошибку, если ответ не 2xx
		if (response.ok && data) {
			return NextResponse.json(data)
		} else {
			return NextResponse.json({ error: data }, { status: 404 })
		}
	} catch (error) {
		console.error('Ошибка при запросе к серверу:', error)
		return NextResponse.json(
			{ error: 'Ошибка при запросе к серверу' },
			{ status: 500 }
		)
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = await params

	try {
		const body = await req.json()

		const response = await fetch(`${API_BASE_URL}/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		const data = await response.json()

		if (response.ok) {
			return NextResponse.json(data)
		} else {
			return NextResponse.json({ error: data }, { status: response.status })
		}
	} catch (error) {
		console.error('Ошибка при обновлении данных:', error)
		return NextResponse.json(
			{ error: 'Ошибка при обновлении данных' },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = await params

	try {
		const response = await fetch(`${API_BASE_URL}/${id}`, {
			method: 'DELETE',
		})

		if (response.ok) {
			return NextResponse.json(
				{ message: `Объявление с ID ${id} успешно удалено.` },
				{ status: 204 }
			)
		} else {
			const data = await response.json()
			return NextResponse.json({ error: data }, { status: response.status })
		}
	} catch (error) {
		console.error('Ошибка при удалении данных:', error)
		return NextResponse.json(
			{ error: 'Ошибка при удалении данных' },
			{ status: 500 }
		)
	}
}

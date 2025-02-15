import { createSession } from '@/lib/session'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const { username, password } = await req.json()
		// Проверка, что логин и пароль переданы
		if (!username || !password) {
			return new NextResponse(
				JSON.stringify({ message: 'Логин и пароль обязательны' }),
				{ status: 400 }
			)
		}

		// Могло бы быть сравнение пароля с хэшированным в базе данных
		const isPasswordValid = password === 'test'

		if (!isPasswordValid) {
			return new NextResponse(JSON.stringify({ message: 'Неверный пароль' }), {
				status: 400,
			})
		}

		const isAdmin = false

		// console.log('Создаём сессию')
		// Создаём сессию
		const session = await createSession(
			username,
			password,
			'testEmail@test.com',
			isAdmin
		)

		// console.log('Устанавливаем куки с сессией')
		// Устанавливаем куки с сессией
		const response = NextResponse.json({
			login: username,
			isAdmin: isAdmin,
		})

		response.cookies.set('session', session, {
			httpOnly: true,
			secure: true,
			path: '/',
			sameSite: 'lax',
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
		})

		// console.log('Авторизация прошла успешно')
		return new NextResponse(
			JSON.stringify({
				message: 'Авторизация прошла успешно',
				login: username,
				isAdmin: isAdmin,
				password: password,
			}),
			{ status: 200 }
		)
	} catch (error: unknown) {
		// console.log('Login error ->', error)
		return new NextResponse(
			JSON.stringify({ message: 'Ошибка при авторизации' }),
			{ status: 500 }
		)
	}
}

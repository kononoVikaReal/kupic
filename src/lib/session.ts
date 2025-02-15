'use server'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { decrypt, encrypt } from './crypt'

export async function createSession(
	name: string,
	password: string,
	email: string,
	isAdmin: boolean
): Promise<string> {
	try {
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
		const session = await encrypt({ name, password, email, isAdmin, expiresAt })
		const cookieStore = await cookies()

		// More detailed debug logging
		console.log('Pre-cookie set state:', {
			currentCookies: cookieStore.getAll(),
			newSession: session.substring(0, 20) + '...',
			cookieStoreState: cookieStore,
		})

		cookieStore.set('session', session, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			expires: expiresAt,
			sameSite: 'lax',
			path: '/',
		})

		// Immediate verification
		const allCookies = cookieStore.getAll()
		console.log('Post-cookie set state:', {
			allCookies,
			sessionCookie: cookieStore.get('session'),
		})

		return session
	} catch (error) {
		console.error('Session creation error:', error)
		throw error
	}
}

export const verifySession = cache(async () => {
	try {
		const cookie = (await cookies()).get('session')?.value
		console.log('cookie: ', cookie)
		if (!cookie) {
			return null // Просто возвращаем null, без throw
		}

		const session = await decrypt(cookie)

		if (!session?.name) {
			return null // Если данные в сессии некорректные
		}

		return {
			isAuth: true,
			name: session.name,
			password: session.password,
			email: session.email,
			isAdmin: session.isAdmin,
		}
	} catch (error) {
		console.error('Ошибка при верификации сессии:', error)
		return null
	}
})

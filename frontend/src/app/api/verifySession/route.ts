import { verifySession } from '@/lib/session'
import { NextRequest, NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
	try {
		const session = await verifySession()

		if (!session) {
			return NextResponse.json({ isAuth: false }, { status: 401 })
		}

		return NextResponse.json(session)
	} catch (error) {
		console.error('Verify session error -> ', error)
		return NextResponse.json(
			{ isAuth: false, message: 'Ошибка сервера' },
			{ status: 500 }
		)
	}
}

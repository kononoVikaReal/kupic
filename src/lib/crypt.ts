import { SignJWT, jwtVerify } from 'jose'
import 'server-only'
import type { SessionPayload } from './definitions'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ['HS256'],
		})
		return payload
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		console.log('Не удалось проверить сессию на подлинность')
	}
}

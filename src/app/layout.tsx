import Header from '@/components/Header/Header'
import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
	variable: '--font-manrope-sans',
	subsets: ['latin'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'KUPIC -> Главная',
	description: 'KUPIC -> Мечтай. Выбирай. Воплощай!',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${manrope.variable} ${manrope.variable} antialiased`}>
				<Header />
				{children}
			</body>
		</html>
	)
}

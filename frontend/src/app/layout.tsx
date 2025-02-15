import Header from '@/components/Header/Header'
import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import Head from 'next/head'
import './globals.css'

const manrope = Manrope({
	variable: '--font-manrope-sans',
	subsets: ['latin'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'KUPIC -> Главная',
	description:
		'KUPIC -> Онлайн-площадка для размещения объявлений. Мечтай. Выбирай. Воплощай!',
	keywords:
		'KUPIC, Купис, КУПИ-С, КУПИС онлайн, Купис клон авито, авито клон купис',
	viewport: 'width=device-width, initial-scale=1.0',
	openGraph: {
		title: 'KUPIC -> Онлайн-площадка для размещения объявлений.',
		description:
			'KUPIC -> Онлайн-площадка для размещения объявлений. Мечтай. Выбирай. Воплощай!',
		url: 'https://kupic.best/',
		siteName: 'KUPIC -> Онлайн-площадка для размещения объявлений.',
		images: [
			{
				url: 'https://kupic.best/kupic.png',
				width: 800,
				height: 600,
			},
		],
		locale: 'ru_RU',
		type: 'website',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<Head>
				<link rel='icon' href='/favicon.ico' sizes='any' />
			</Head>

			<body className={`${manrope.variable} ${manrope.variable} antialiased`}>
				<Header />
				{children}
			</body>
		</html>
	)
}

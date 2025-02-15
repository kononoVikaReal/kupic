import WelcomeSection from '@/components/WelcomeSection/WelcomeSection'
import Link from 'next/link'

// https://medium.com/@harisbaig100/error-occurred-prerendering-page-heres-the-fix-1b7d60aa6396
// Принудительный динамический рендеринг, чтобы обеспечить рендеринг страницы во время запроса
export const dynamic = 'force-dynamic'
// Отключаем кэширование запросов на выборку, чтобы всегда получать свежие данные
export const fetchCache = 'force-no-store'
export const revalidate = 0

export default function Home() {
	return (
		<div className='max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl mx-auto flex flex-col justify-center items-center gap-28'>
			<h1 className='text-6xl xl:text-7xl xxl:text-9xl'>Привет!</h1>
			<div className='flex flex-col items-center justify-center'>
				<div className='rounded-2xl mx-4 p-2 text-2xl text-center lg:p-6 bg-[#000000] text-white lg:text-3xl lg:mx-auto'>
					<span>Мечтай. Выбирай. Воплощай!</span>
				</div>
				<Link
					href={'/list'}
					className='rounded-lg p-3 text-white text-lg font-bold bg-gradient-to-br from-[#04E061] [#00AAFF] to-[#037c2f]'
				>
					Посмотреть объявления
				</Link>
			</div>
			<WelcomeSection />
		</div>
	)
}

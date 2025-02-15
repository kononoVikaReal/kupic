// Базовый URL для запросов на сервер
const API_BASE_URL = 'http://localhost:3000/api/items'
const WelcomeSection = async () => {
	const res = await fetch(`${API_BASE_URL}?welcome=true`)
	if (!res.ok) {
		return <div>Ошибка загрузки данных с сервера</div>
	}
	const data = await res.json()
	// console.log('Полученные данные:', data)
	// console.log('Тип данных:', Array.isArray(data)) // Проверяем, это ли массив
	const counts = data.items.reduce(
		(
			acc: { carsCount: number; realtyCount: number; servicesCount: number },
			ad: { type: string }
		) => {
			if (ad.type === 'Авто') {
				acc.carsCount += 1
			} else if (ad.type === 'Недвижимость') {
				acc.realtyCount += 1
			} else if (ad.type === 'Услуги') {
				acc.servicesCount += 1
			}
			return acc
		},
		{ carsCount: 0, realtyCount: 0, servicesCount: 0 }
	)

	const { carsCount, realtyCount, servicesCount } = counts

	// Орфографическая функция
	const getCountText = (
		count: number,
		singular: string,
		plural: string,
		plural2: string
	): string => {
		if (count % 10 === 1 && count % 100 !== 11) {
			return `${count} ${singular}`
		} else if (
			[2, 3, 4].includes(count % 10) &&
			!(count % 100 >= 10 && count % 100 <= 20)
		) {
			return `${count} ${plural}`
		} else {
			return `${count} ${plural2}`
		}
	}

	return (
		<div className='flex h-full w-full items-center justify-center mb-24'>
			<div className='grid  h-full w-full gap-4 bg-gray-200 p-3 lg:grid-cols-3 lg:grid-rows-3 rounded-3xl shadow-md'>
				<div className='lg:col-span-1 col-span-2 row-span-1 bg-[#04E061] rounded-3xl shadow-md flex items-center justify-center text-white text-4xl gap-4 p-4 text-center flex-col lg:flex-row'>
					<p>{getCountText(carsCount, 'машина', 'машины', 'машин')}</p>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						width={48}
						height={48}
						color={'#white'}
						fill={'none'}
					>
						<path
							d='M9.0072 17C9.0072 18.1046 8.11177 19 7.0072 19C5.90263 19 5.0072 18.1046 5.0072 17C5.0072 15.8954 5.90263 15 7.0072 15C8.11177 15 9.0072 15.8954 9.0072 17Z'
							stroke='currentColor'
							strokeWidth='1.5'
						/>
						<path
							d='M19.0072 17C19.0072 18.1046 18.1118 19 17.0072 19C15.9026 19 15.0072 18.1046 15.0072 17C15.0072 15.8954 15.9026 15 17.0072 15C18.1118 15 19.0072 15.8954 19.0072 17Z'
							stroke='currentColor'
							strokeWidth='1.5'
						/>
						<path
							d='M2.00722 10H18.0072M2.00722 10C2.00722 10.78 1.98723 13.04 2.01122 15.26C2.04719 15.98 2.1671 16.58 5.00893 17M2.00722 10C2.22306 8.26 3.16234 6.2 3.64197 5.42M9.00722 10V5M14.9973 17H9.00189M2.02321 5H12.2394C12.2394 5 12.779 5 13.2586 5.048C14.158 5.132 14.9134 5.54 15.6688 6.56C16.4687 7.64 17.0837 9.008 17.8991 9.74C19.2541 10.9564 21.8321 10.58 21.976 13.16C22.012 14.48 22.012 15.92 21.952 16.16C21.8557 16.8667 21.3108 16.9821 20.633 17C20.0448 17.0156 19.3357 16.9721 18.9903 17'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
						/>
					</svg>
				</div>

				<div className='col-span-2 row-span-3 bg-[#FF4053] rounded-3xl shadow-md flex items-center justify-center text-white text-4xl gap-4 p-4 text-center flex-col lg:flex-row'>
					<p>{getCountText(servicesCount, 'услуга', 'услуги', 'услуг')}</p>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						width={48}
						height={48}
						color={'#white'}
						fill={'none'}
					>
						<path
							d='M11 21H10C6.22876 21 4.34315 21 3.17157 19.8284C2 18.6569 2 16.7712 2 13V10C2 6.22876 2 4.34315 3.17157 3.17157C4.34315 2 6.22876 2 10 2H12C15.7712 2 17.6569 2 18.8284 3.17157C20 4.34315 20 6.22876 20 10V10.5'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M17.4069 14.4036C17.6192 13.8655 18.3808 13.8655 18.5931 14.4036L18.6298 14.4969C19.1482 15.8113 20.1887 16.8518 21.5031 17.3702L21.5964 17.4069C22.1345 17.6192 22.1345 18.3808 21.5964 18.5931L21.5031 18.6298C20.1887 19.1482 19.1482 20.1887 18.6298 21.5031L18.5931 21.5964C18.3808 22.1345 17.6192 22.1345 17.4069 21.5964L17.3702 21.5031C16.8518 20.1887 15.8113 19.1482 14.4969 18.6298L14.4036 18.5931C13.8655 18.3808 13.8655 17.6192 14.4036 17.4069L14.4969 17.3702C15.8113 16.8518 16.8518 15.8113 17.3702 14.4969L17.4069 14.4036Z'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M7 7H15M7 11.5H15M7 16H11'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				</div>

				<div className='lg:col-span-1 col-span-2 row-span-2 bg-[#00AAFF] rounded-3xl  shadow-md flex items-center justify-center text-white text-4xl gap-4 p-4 text-center flex-col lg:flex-row'>
					<p>{getCountText(realtyCount, 'квартира', 'квартиры', 'квартир')}</p>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						width={48}
						height={48}
						color={'#white'}
						fill={'none'}
					>
						<path
							d='M15 2H9C5.69067 2 5 2.69067 5 6V22H19V6C19 2.69067 18.3093 2 15 2Z'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinejoin='round'
						/>
						<path
							d='M3 22H21'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M15 22V19C15 17.3453 14.6547 17 13 17H11C9.34533 17 9 17.3453 9 19V22'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinejoin='round'
						/>
						<path
							d='M13.5 6H10.5M13.5 9.5H10.5M13.5 13H10.5'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
						/>
					</svg>
				</div>
			</div>
		</div>
	)
}

export default WelcomeSection

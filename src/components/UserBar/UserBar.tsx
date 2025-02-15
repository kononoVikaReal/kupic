'use client'
import { login } from '@/action'
import Image from 'next/image'
import Link from 'next/link'
import { useActionState, useEffect, useRef, useState } from 'react'

const UserBar = () => {
	const [isAuth, setIsAuth] = useState<boolean>(false)
	const [showMenu, setShowMenu] = useState<boolean>(false)
	const [username, setUsername] = useState<string>('гость')
	const [loginForm, setLoginForm] = useState<boolean>(false)

	const [state, formAction] = useActionState(login, {
		success: false,
		error: false,
		message: '',
		username: '',
		password: '',
	})
	const formRef = useRef<HTMLFormElement | null>(null)
	useEffect(() => {
		const checkSession = async () => {
			try {
				const response = await fetch('/api/verifySession', {
					method: 'GET',
					credentials: 'include', // ВАЖНО: чтобы куки передавались
				})
				if (response.status === 200) {
					setIsAuth(true)
					const data = await response.json()
					setUsername(data.name)
				}
			} catch (err) {
				console.error('Ошибка проверки сессии:', err)
			}
		}
		checkSession()

		const handleLogin = async () => {
			const response = await fetch('/api/login', {
				method: 'POST',
				credentials: 'include', // ВАЖНО: чтобы куки передавались
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: state.username,
					password: state.password,
				}),
			})
			// console.log('login response -> ', response)
			if (response.status === 200) {
				checkSession()
				setShowMenu(false)
				setLoginForm(false)
			}
		}
		if (state.success && state.message === 'Успешная авторизация!')
			handleLogin()
	}, [state])

	return (
		<div>
			<div className='grid items-center justify-center p-2 lg:p-4 border-2 rounded-full border-[#EEEDF2] dark:border-[#444]'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 rounded-full bg-[#E2D6F7] dark:bg-[#3C3C3C] relative overflow-hidden'>
						<Image
							src='/userLogo.webp'
							alt='User Logo'
							layout='fill'
							objectFit='cover'
							className='p-1'
						/>
					</div>
					<span className='text-xl text-gray-800 dark:text-gray-200'>
						Привет, {username}!
					</span>
					<svg
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='cursor-pointer'
						onClick={() => {
							setShowMenu(!showMenu)
						}}
					>
						<path
							d='M7 11C7 11 12.1554 18 14 18C15.8447 18 21 11 21 11'
							stroke='black'
							strokeWidth='1.75'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				</div>
			</div>
			<div className='flex justify-center'>
				{/* АВТОРИЗОВАТЬСЯ */}
				{showMenu && !isAuth && (
					<button
						className='bg-[#00AAFF] rounded-3xl shadow-md max-w-md text-center p-2 text-white'
						onClick={() => setLoginForm(true)}
					>
						Авторизоваться
					</button>
				)}
				{/* ПРОСМОТРЕТЬ СВОИ ОБЪЯВЛЕНИЯ */}
				{showMenu && isAuth && (
					<Link
						className='bg-[#00AAFF] rounded-3xl shadow-md max-w-md p-2 text-white'
						href={'/dashboard'}
					>
						Посмотреть мои объявления
					</Link>
				)}
				{loginForm && (
					<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50'>
						<div className='bg-white p-8 rounded-lg shadow-lg'>
							<div
								className='flex justify-end cursor-pointer'
								onClick={() => setLoginForm(false)}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									width={20}
									height={20}
									color={'#000000'}
									fill={'none'}
								>
									<path
										d='M14.9994 15L9 9M9.00064 15L15 9'
										stroke='currentColor'
										strokeWidth='1.5'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
									<path
										d='M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z'
										stroke='currentColor'
										strokeWidth='1.5'
									/>
								</svg>
							</div>
							{state.error && (
								<div className='mt-4 mx-auto flex flex-col sm:flex-row items-center p-4 bg-red-100 border border-red-400 rounded-lg shadow-md max-w-md'>
									<div className='w-16 h-16 flex-shrink-0'>
										<Image
											src='/error.webp'
											alt='Ошибка'
											width={64}
											height={64}
											className='rounded-full object-cover'
											priority
										/>
									</div>
									<div className='mt-2 sm:mt-0 sm:ml-4 text-center sm:text-left'>
										<h2 className='text-lg font-semibold text-red-700'>
											Ошибка!
										</h2>
										<p className='text-red-600'>{state.message}</p>
									</div>
								</div>
							)}

							{state.success && state.message === 'Успешная авторизация!' && (
								<div className='mt-4 mx-auto flex flex-col sm:flex-row items-center p-4 bg-green-100 border border-green-400 rounded-lg shadow-md max-w-md'>
									<div className='w-16 h-16 flex-shrink-0'>
										<Image
											src='/success.webp'
											alt='Успех'
											width={64}
											height={64}
											className='rounded-full object-cover'
											priority
										/>
									</div>
									<div className='mt-2 sm:mt-0 sm:ml-4 text-center sm:text-left'>
										<h2 className='text-lg font-semibold text-green-700'>
											Успех!
										</h2>
										<p className='text-gray-800'>Успешная авторизация!</p>
									</div>
								</div>
							)}
							<h2 className='text-2xl text-center font-bold mb-4'>Вход</h2>
							<form ref={formRef} action={formAction}>
								<div className='mb-4'>
									<label
										htmlFor='username'
										className='block text-gray-700 font-bold mb-2'
									>
										Имя пользователя
									</label>
									<input
										type='text'
										id='username'
										name='username'
										className='border border-gray-300 rounded-lg px-4 py-2 w-full'
									/>
								</div>
								<div className='mb-4'>
									<label
										htmlFor='password'
										className='block text-gray-700 font-bold mb-2'
									>
										Пароль
									</label>
									<input
										type='password'
										id='password'
										name='password'
										className='border border-gray-300 rounded-lg px-4 py-2 w-full'
									/>
								</div>
								<div className='flex justify-center'>
									<button
										type='submit'
										className='bg-blue-500 text-white px-4 py-2 rounded-lg'
									>
										Войти
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default UserBar

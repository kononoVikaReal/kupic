'use client'

export const addItem = (id: number): void => {
	// Считываем текущие данные из localStorage
	const currentData = JSON.parse(localStorage.getItem('items') || '[]')

	// Проверяем, что данные — это массив и преобразуем все элементы в числа
	if (Array.isArray(currentData)) {
		const numberArray = currentData.map(Number)

		// Добавляем новый id, если его ещё нет в массиве
		if (!numberArray.includes(id)) {
			numberArray.push(id)
			localStorage.setItem('items', JSON.stringify(numberArray))
		}
	} else {
		// Если данные в localStorage не массив, перезаписываем их массивом с новым id
		localStorage.setItem('items', JSON.stringify([id]))
	}
}

export const getItems = (): number[] => {
	// Проверяем, работаем ли мы на стороне клиента
	if (typeof window === 'undefined') {
		return []
	}

	try {
		const currentData = JSON.parse(localStorage.getItem('items') || '[]')

		// Проверяем, что данные представляют собой массив и преобразуем все элементы в числа
		if (Array.isArray(currentData)) {
			return currentData.map(Number)
		}

		return []
	} catch (error) {
		console.error('Error reading from localStorage:', error)
		return []
	}
}

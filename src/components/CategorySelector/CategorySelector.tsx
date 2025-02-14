import { FiltersState } from '@/app/list/page'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Dispatch, SetStateAction } from 'react'

// Интерфейс и типы для типов данных
type FilterType = 'text' | 'number' | 'dropdown'

interface FilterConfigItem {
	label: string
	name: string
	type: FilterType
	required: boolean
	options?: string[] // только для dropdown
}

type FilterConfig = Record<string, FilterConfigItem[]>

const filterConfig: FilterConfig = {
	real_estate: [
		{
			label: 'Тип недвижимости',
			name: 'propertyType',
			type: 'dropdown',
			required: true,
			options: ['Квартира', 'Дом', 'Коттедж'],
		},
		{ label: 'Площадь (кв. м)', name: 'area', type: 'number', required: true },
		{
			label: 'Количество комнат',
			name: 'rooms',
			type: 'number',
			required: true,
		},
		{ label: 'Цена', name: 'price', type: 'number', required: true },
	],
	auto: [
		{
			label: 'Марка',
			name: 'brand',
			type: 'dropdown',
			required: true,
			options: ['Toyota', 'BMW', 'Audi'],
		},
		{ label: 'Модель', name: 'model', type: 'text', required: true },
		{ label: 'Год выпуска', name: 'year', type: 'number', required: true },
	],
	services: [
		{
			label: 'Тип услуги',
			name: 'serviceType',
			type: 'dropdown',
			required: true,
			options: ['Ремонт', 'Уборка', 'Доставка'],
		},
		{
			label: 'Опыт работы (лет)',
			name: 'experience',
			type: 'number',
			required: true,
		},
		{ label: 'Стоимость', name: 'cost', type: 'number', required: true },
	],
}

const CategorySelector = ({
	category,
	setCategory,
	subFilters,
	setSubFilters,
}: {
	category: string
	setCategory: Dispatch<SetStateAction<string>>
	subFilters: FiltersState
	setSubFilters: Dispatch<SetStateAction<FiltersState>>
}) => {
	const handleCategoryChange = (selectedCategory: string) => {
		setCategory(selectedCategory)

		const initialFilters: FiltersState = {}
		filterConfig[selectedCategory]?.forEach(filter => {
			initialFilters[filter.name] = filter.type === 'number' ? 0 : ''
		})

		setSubFilters(initialFilters)
	}

	const SpecificCategories = () => {
		if (!category || !filterConfig[category]) return null

		return filterConfig[category].map(filter => (
			<div key={filter.name} className='mb-4'>
				<label className='block text-gray-700 text-sm font-bold mb-2'>
					{filter.label}
					{/* {filter.required && <span className='text-red-500'>*</span>} */}
				</label>
				{filter.type === 'dropdown' ? (
					<select
						className='border rounded w-full py-2 px-3 text-gray-700'
						value={subFilters[filter.name] as string}
						onChange={e =>
							setSubFilters(prev => ({
								...prev,
								[filter.name]: e.target.value,
							}))
						}
					>
						<option value=''>Выберите...</option>
						{filter.options?.map(option => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				) : (
					<input
						type={filter.type}
						className='border rounded w-full py-2 px-3 text-gray-700'
						value={
							filter.type === 'number' && subFilters[filter.name] === 0
								? ''
								: subFilters[filter.name] || ''
						}
						onChange={e =>
							setSubFilters(prev => ({
								...prev,
								[filter.name]:
									filter.type === 'number'
										? Number(e.target.value)
										: e.target.value,
							}))
						}
					/>
				)}
			</div>
		))
	}

	return (
		<div className='flex items-center flex-col text-center lg:max-w-min mt-4 gap-2'>
			{/* Общие категории (используем AntDesign) */}
			<div className=''>
				<Select value={category} onValueChange={handleCategoryChange}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Категория' />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Общие категории</SelectLabel>
							<SelectItem value='real_estate'>Недвижимость</SelectItem>
							<SelectItem value='auto'>Авто</SelectItem>
							<SelectItem value='services'>Услуги</SelectItem>
							<SelectItem value='any'>Все предложения</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			{/* Специфические категории */}
			<div className='lg:flex gap-4 lg:flex-col lg:gap-0 grid grid-cols-1 xsm:grid-cols-2'>
				{SpecificCategories()}
			</div>
		</div>
	)
}

export default CategorySelector

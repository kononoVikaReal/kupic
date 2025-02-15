import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// Проверка на "Лет"/"Год"/"Года"
export function getExperienceLabel(years: number): string {
	if (years % 10 === 1 && years % 100 !== 11) {
		return 'год'
	} else if (
		[2, 3, 4].includes(years % 10) &&
		![12, 13, 14].includes(years % 100)
	) {
		return 'года'
	} else {
		return 'лет'
	}
}

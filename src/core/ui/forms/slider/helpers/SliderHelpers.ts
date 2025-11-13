import type { StandardSize } from '@src-types/ui/base';
import { twMerge } from 'tailwind-merge';

export interface GetSliderClassesOptions {
	size: StandardSize;
	className?: string | undefined;
}

export function getSliderClasses(options: GetSliderClassesOptions): string {
	const baseClasses = 'relative w-full';
	const sizeClasses = {
		sm: 'h-1',
		md: 'h-2',
		lg: 'h-3',
	};

	return twMerge(baseClasses, sizeClasses[options.size], options.className);
}

export interface GetSliderTrackClassesOptions {
	size: StandardSize;
}

export function getSliderTrackClasses(options: GetSliderTrackClassesOptions): string {
	const baseClasses =
		'absolute top-1/2 -translate-y-1/2 w-full rounded-full bg-gray-200 dark:bg-gray-700';
	const sizeClasses = {
		sm: 'h-1',
		md: 'h-2',
		lg: 'h-3',
	};

	return twMerge(baseClasses, sizeClasses[options.size]);
}

export interface GetSliderThumbClassesOptions {
	size: StandardSize;
	value?: number | undefined;
	min?: number | undefined;
	max?: number | undefined;
}

export function getSliderThumbClasses(options: GetSliderThumbClassesOptions): string {
	const baseClasses =
		'absolute top-1/2 -translate-y-1/2 rounded-full bg-blue-600 cursor-pointer transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400';
	const sizeClasses = {
		sm: 'h-3 w-3',
		md: 'h-4 w-4',
		lg: 'h-5 w-5',
	};

	return twMerge(baseClasses, sizeClasses[options.size]);
}

export function getAriaDescribedBy(
	sliderId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${sliderId}-error`);
	if (helperText) ids.push(`${sliderId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generateSliderId(
	generatedId: string,
	sliderId?: string,
	label?: string
): string | undefined {
	if (sliderId) {
		return sliderId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `slider-${cleanId}`;
}

export function calculatePercentage(value: number, min: number, max: number): number {
	if (max === min) {
		return 0;
	}
	return ((value - min) / (max - min)) * 100;
}

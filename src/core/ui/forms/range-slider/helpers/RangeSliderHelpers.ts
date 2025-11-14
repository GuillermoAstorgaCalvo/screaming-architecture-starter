import type { StandardSize } from '@src-types/ui/base';
import { twMerge } from 'tailwind-merge';

export interface GetRangeSliderClassesOptions {
	size: StandardSize;
	className?: string | undefined;
}

export function getRangeSliderClasses(options: GetRangeSliderClassesOptions): string {
	const baseClasses = 'relative w-full';
	const sizeClasses = {
		sm: 'h-1',
		md: 'h-2',
		lg: 'h-3',
	};

	return twMerge(baseClasses, sizeClasses[options.size], options.className);
}

export interface GetRangeSliderTrackClassesOptions {
	size: StandardSize;
}

export function getRangeSliderTrackClasses(options: GetRangeSliderTrackClassesOptions): string {
	const baseClasses = 'absolute top-1/2 -translate-y-1/2 w-full rounded-full bg-muted';
	const sizeClasses = {
		sm: 'h-1',
		md: 'h-2',
		lg: 'h-3',
	};

	return twMerge(baseClasses, sizeClasses[options.size]);
}

export function getRangeSliderActiveTrackClasses(
	options: GetRangeSliderTrackClassesOptions
): string {
	const baseClasses = 'absolute top-1/2 -translate-y-1/2 rounded-full bg-primary';
	const sizeClasses = {
		sm: 'h-1',
		md: 'h-2',
		lg: 'h-3',
	};

	return twMerge(baseClasses, sizeClasses[options.size]);
}

export interface GetRangeSliderThumbClassesOptions {
	size: StandardSize;
}

export function getRangeSliderThumbClasses(options: GetRangeSliderThumbClassesOptions): string {
	const baseClasses =
		'absolute top-1/2 -translate-y-1/2 rounded-full bg-primary cursor-pointer transition-all hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10';
	const sizeClasses = {
		sm: 'h-3 w-3',
		md: 'h-4 w-4',
		lg: 'h-5 w-5',
	};

	return twMerge(baseClasses, sizeClasses[options.size]);
}

export function getAriaDescribedBy(
	rangeSliderId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${rangeSliderId}-error`);
	if (helperText) ids.push(`${rangeSliderId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generateRangeSliderId(
	generatedId: string,
	rangeSliderId?: string,
	label?: string
): string | undefined {
	if (rangeSliderId) {
		return rangeSliderId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `range-slider-${cleanId}`;
}

export function calculatePercentage(value: number, min: number, max: number): number {
	if (max === min) {
		return 0;
	}
	return ((value - min) / (max - min)) * 100;
}

export function getThumbOffset(percentage: number): string {
	if (percentage === 0) return '0px';
	if (percentage === 100) return '100%';
	return '50%';
}

export function clampValue(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

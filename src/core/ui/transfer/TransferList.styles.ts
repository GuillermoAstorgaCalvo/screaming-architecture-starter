import type { StandardSize } from '@src-types/ui/base';
import { twMerge } from 'tailwind-merge';

/**
 * Gets the minimum width class based on size
 */
export function getMinWidth(size: StandardSize): string {
	if (size === 'sm') {
		return 'min-w-[200px]';
	}
	if (size === 'lg') {
		return 'min-w-[300px]';
	}
	return 'min-w-[250px]';
}

/**
 * Gets the header padding classes based on size
 */
export function getHeaderPadding(size: StandardSize): string {
	if (size === 'sm') {
		return 'px-3 py-1.5';
	}
	if (size === 'lg') {
		return 'px-5 py-3';
	}
	return 'px-4 py-2';
}

/**
 * Gets the header text size class based on size
 */
export function getHeaderTextSize(size: StandardSize): string {
	if (size === 'sm') {
		return 'text-sm';
	}
	if (size === 'lg') {
		return 'text-lg';
	}
	return '';
}

/**
 * Gets the list padding class based on size
 */
export function getListPadding(size: StandardSize): string {
	if (size === 'sm') {
		return 'p-2';
	}
	if (size === 'lg') {
		return 'p-4';
	}
	return 'p-3';
}

/**
 * Gets the container classes for the transfer list
 */
export function getContainerClasses(minWidth: string): string {
	return twMerge(
		'flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
		minWidth
	);
}

/**
 * Gets the header classes for the transfer list
 */
export function getHeaderClasses(headerPadding: string, headerTextSize: string): string {
	return twMerge(
		'border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800',
		headerPadding,
		headerTextSize
	);
}

/**
 * Gets the list container classes
 */
export function getListContainerClasses(listPadding: string): string {
	return twMerge('overflow-y-auto', listPadding);
}

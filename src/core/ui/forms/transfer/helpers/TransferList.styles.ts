import type { StandardSize } from '@src-types/ui/base';
import { twMerge } from 'tailwind-merge';

/**
 * Gets the minimum width class based on size
 * Uses design tokens for customizable widths
 */
export function getMinWidth(size: StandardSize): string {
	if (size === 'sm') {
		// Uses spacing tokens: 200px = 50 * 4px (spacing-xs)
		return 'min-w-[calc(var(--spacing-xs)*50)]';
	}
	if (size === 'lg') {
		// Uses spacing tokens: 300px = 75 * 4px (spacing-xs)
		return 'min-w-[calc(var(--spacing-xs)*75)]';
	}
	// Default: 250px = 62.5 * 4px (spacing-xs)
	return 'min-w-[calc(var(--spacing-xs)*62.5)]';
}

/**
 * Gets the header padding classes based on size
 * Uses design tokens: xs=4px, sm=8px, md=12px, lg=16px, xl=24px
 */
export function getHeaderPadding(size: StandardSize): string {
	if (size === 'sm') {
		// px-md (12px), py uses xs + xs/2 (6px) for better visual balance
		return 'px-md py-[calc(var(--spacing-xs)+var(--spacing-xs)/2)]';
	}
	if (size === 'lg') {
		// px uses lg + xs (20px), py-md (12px)
		return 'px-[calc(var(--spacing-lg)+var(--spacing-xs))] py-md';
	}
	// px-lg (16px), py-sm (8px)
	return 'px-lg py-sm';
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
 * Uses design tokens: sm=8px, md=12px, lg=16px
 */
export function getListPadding(size: StandardSize): string {
	if (size === 'sm') {
		return 'p-sm';
	}
	if (size === 'lg') {
		return 'p-lg';
	}
	return 'p-md';
}

/**
 * Gets the container classes for the transfer list
 */
export function getContainerClasses(minWidth: string): string {
	return twMerge(
		'flex flex-col border border-border dark:border-border rounded-lg overflow-hidden',
		minWidth
	);
}

/**
 * Gets the header classes for the transfer list
 */
export function getHeaderClasses(headerPadding: string, headerTextSize: string): string {
	return twMerge(
		'border-b border-border dark:border-border bg-muted dark:bg-muted',
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

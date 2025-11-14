import { twMerge } from 'tailwind-merge';

/**
 * Get base classes for InfiniteScroll container
 */
export function getInfiniteScrollClasses(className?: string): string {
	return twMerge('w-full', className);
}

/**
 * Get classes for the sentinel element
 */
export function getSentinelClasses(): string {
	return 'h-1 w-full';
}

/**
 * Get classes for the loading container
 */
export function getLoadingContainerClasses(): string {
	return 'flex items-center justify-center py-4';
}

/**
 * Get classes for the end message container
 */
export function getEndMessageClasses(): string {
	return 'flex items-center justify-center py-4 text-sm text-text-muted';
}

/**
 * Get classes for the error container
 */
export function getErrorContainerClasses(): string {
	return 'flex flex-col items-center justify-center py-4 gap-2';
}

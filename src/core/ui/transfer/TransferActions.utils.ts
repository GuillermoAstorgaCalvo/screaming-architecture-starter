import type { StandardSize } from '@src-types/ui/base';
import { twMerge } from 'tailwind-merge';

import type { ButtonSize } from './TransferActions.types';

/**
 * Determines the button size based on the transfer size prop
 */
export function getButtonSize(size: StandardSize): ButtonSize {
	if (size === 'sm') {
		return 'sm';
	}
	if (size === 'lg') {
		return 'lg';
	}
	return 'md';
}

/**
 * Determines the gap class based on the transfer size prop
 */
export function getGapClass(size: StandardSize): string {
	if (size === 'sm') {
		return 'gap-1';
	}
	if (size === 'lg') {
		return 'gap-3';
	}
	return '';
}

/**
 * Builds the container classes with gap styling
 */
export function getContainerClasses(gapClass: string): string {
	return twMerge('flex flex-col justify-center items-center gap-2', gapClass);
}

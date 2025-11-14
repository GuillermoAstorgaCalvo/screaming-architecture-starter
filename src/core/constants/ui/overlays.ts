/**
 * Overlay component constants
 * Constants for Modal, Spinner, and Backdrop components
 */

import type { ModalSize, StandardSize } from '@src-types/ui/base';

/**
 * Spinner size classes (height + width)
 */
export const SPINNER_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-4 w-4',
	md: 'h-8 w-8',
	lg: 'h-12 w-12',
} as const;

/**
 * Modal size classes (max-width)
 */
export const MODAL_SIZE_CLASSES: Record<ModalSize, string> = {
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
	full: 'max-w-full mx-4',
} as const;

/**
 * Backdrop base classes
 * Fixed positioning covering the entire viewport with transition
 * Uses design tokens for transitions
 */
export const BACKDROP_BASE_CLASSES = 'fixed inset-0 transition-opacity duration-slower ease-in-out';

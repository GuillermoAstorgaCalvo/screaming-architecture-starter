import type { EmptyStateSize } from './types/emptyState.types';

/**
 * Empty state size classes
 * Uses design tokens for spacing
 */
export const SIZE_CLASSES: Record<EmptyStateSize, string> = {
	sm: 'py-lg gap-sm',
	md: 'py-xl gap-md',
	lg: 'py-2xl gap-lg',
};

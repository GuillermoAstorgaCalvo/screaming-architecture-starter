import type { EmptyStateSize } from '@core/ui/feedback/empty-state/types/emptyState.types';

export function getSizeVariant(size: EmptyStateSize): EmptyStateSize {
	if (size === 'sm') return 'sm';
	if (size === 'lg') return 'lg';
	return 'md';
}

import { useAffixHooks } from './useAffix.composition';
import type { UseAffixOptions, UseAffixReturn } from './useAffix.types';

/**
 * Hook to manage affix/sticky behavior
 *
 * Tracks scroll position and determines when element should become sticky
 * based on threshold and position settings.
 */
export function useAffix({
	threshold,
	position,
	offset: _offset,
	container,
	enabled,
	onStickyChange,
}: UseAffixOptions): UseAffixReturn {
	const { isSticky, elementRef } = useAffixHooks({
		threshold,
		position,
		container,
		enabled,
		onStickyChange,
	});

	return {
		isSticky,
		elementRef,
	};
}

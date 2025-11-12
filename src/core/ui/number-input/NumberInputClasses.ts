import { getInputVariantClasses } from '@core/ui/variants/input';
import type { StandardSize } from '@src-types/ui/base';

export interface GetNumberInputClassesOptions {
	size: StandardSize;
	hasError: boolean;
	className?: string | undefined;
}

/**
 * Gets CSS classes for the number input component
 *
 * Applies input variant classes based on size and error state,
 * accounting for the increment/decrement buttons on the right.
 *
 * @param options - Options containing size, error state, and optional className
 * @returns CSS classes string
 *
 * @internal
 */
export function getNumberInputClasses(options: GetNumberInputClassesOptions): string {
	return getInputVariantClasses({
		size: options.size,
		state: options.hasError ? 'error' : 'normal',
		hasLeftIcon: false,
		hasRightIcon: true, // Always has increment/decrement buttons
		className: options.className,
	});
}

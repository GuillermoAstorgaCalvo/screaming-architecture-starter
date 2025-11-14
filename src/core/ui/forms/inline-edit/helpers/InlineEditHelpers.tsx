import { getInputVariantClasses } from '@core/ui/variants/input';
import type { StandardSize } from '@src-types/ui/base';
import type { InlineEditProps } from '@src-types/ui/forms-inputs';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Display text base classes
 * Uses design tokens for customizable min-height and padding
 * min-height uses line-height token, padding uses spacing tokens
 */
export const DISPLAY_BASE_CLASSES =
	'min-h-[var(--line-height-base)] cursor-text rounded-md px-xs py-[calc(var(--spacing-xs)/2)] transition-colors hover:bg-muted dark:hover:bg-muted';

/**
 * Display text size classes
 */
export const DISPLAY_SIZE_CLASSES = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
} as const;

/**
 * Placeholder text classes
 */
export const PLACEHOLDER_CLASSES = 'text-text-muted italic dark:text-text-muted';

export interface DisplayContentOptions {
	readonly isEmpty: boolean;
	readonly showEmptyPlaceholder: boolean;
	readonly placeholder: string;
	readonly displayValue: string;
	readonly renderDisplay: ((value: string) => ReactNode) | undefined;
}

/**
 * Get display content based on state
 */
export function getDisplayContent(options: Readonly<DisplayContentOptions>): ReactNode {
	const { isEmpty, showEmptyPlaceholder, placeholder, displayValue, renderDisplay } = options;
	if (isEmpty && showEmptyPlaceholder) {
		return <span className={PLACEHOLDER_CLASSES}>{placeholder}</span>;
	}
	if (renderDisplay) {
		return renderDisplay(displayValue);
	}
	return displayValue;
}

/**
 * Build hook options with only defined values
 */
export function buildHookOptions(props: Readonly<InlineEditProps>) {
	const { value, defaultValue, onSave, onCancel, onChange } = props;
	return {
		...(value !== undefined && { value }),
		...(defaultValue !== undefined && { defaultValue }),
		...(onSave && { onSave }),
		...(onCancel && { onCancel }),
		...(onChange && { onChange }),
	};
}

/**
 * Get display classes
 */
export function getDisplayClasses(
	size: StandardSize,
	disabled: boolean,
	displayClassName?: string
): string {
	return twMerge(
		DISPLAY_BASE_CLASSES,
		DISPLAY_SIZE_CLASSES[size],
		disabled && 'cursor-not-allowed opacity-disabled',
		displayClassName
	);
}

/**
 * Get input classes
 */
export function getInputClasses(size: StandardSize, inputClassName?: string): string {
	return getInputVariantClasses({
		size,
		state: 'normal',
		className: twMerge('min-w-0', inputClassName),
	});
}

export interface ComputedValuesOptions {
	readonly controlledValue?: string | undefined;
	readonly defaultValue?: string | undefined;
	readonly size: StandardSize;
	readonly disabled: boolean;
	readonly displayClassName?: string | undefined;
	readonly inputClassName?: string | undefined;
}

export interface ComputedValues {
	readonly displayValue: string;
	readonly isEmpty: boolean;
	readonly displayClasses: string;
	readonly inputClasses: string;
}

/**
 * Compute derived values for the component
 */
export function computeValues(options: Readonly<ComputedValuesOptions>): ComputedValues {
	const { controlledValue, defaultValue, size, disabled, displayClassName, inputClassName } =
		options;
	const displayValue = controlledValue ?? defaultValue ?? '';
	const isEmpty = displayValue === '';
	const displayClasses = getDisplayClasses(size, disabled, displayClassName);
	const inputClasses = getInputClasses(size, inputClassName);

	return {
		displayValue,
		isEmpty,
		displayClasses,
		inputClasses,
	};
}

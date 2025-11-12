import { INPUT_BASE_CLASSES, INPUT_SIZE_CLASSES } from '@core/constants/ui/forms';
import { FORM_ERROR_CLASSES } from '@core/constants/ui/shared';
import { classNames } from '@core/utils/classNames';
import { useId } from 'react';

import type { MultiSelectProps } from './MultiSelect';
import type { UseMultiSelectStateOptions, UseMultiSelectStateReturn } from './MultiSelectTypes';

export function generateMultiSelectId(
	generatedId: string,
	multiSelectId?: string,
	label?: string
): string {
	if (multiSelectId) {
		return multiSelectId;
	}
	if (label) {
		return generatedId;
	}
	return generatedId;
}

export function getAriaDescribedBy(
	id: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) {
		ids.push(`${id}-error`);
	}
	if (helperText) {
		ids.push(`${id}-helper`);
	}
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function getMultiSelectClasses({
	size = 'md',
	hasError,
	className,
}: {
	readonly size?: 'sm' | 'md' | 'lg';
	readonly hasError: boolean;
	readonly className?: string | undefined;
}): string {
	return classNames(
		INPUT_BASE_CLASSES,
		INPUT_SIZE_CLASSES[size],
		hasError && FORM_ERROR_CLASSES,
		className
	);
}

export function useMultiSelectState({
	multiSelectId,
	label,
	error,
	helperText,
	size = 'md',
	className,
}: Readonly<UseMultiSelectStateOptions>): UseMultiSelectStateReturn {
	const generatedId = useId();
	const finalId = generateMultiSelectId(generatedId, multiSelectId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const inputClasses = getMultiSelectClasses({ size, hasError, className });
	return { finalId, hasError, ariaDescribedBy, inputClasses };
}

export function defaultFilterFn(option: { readonly label: unknown }, inputValue: string): boolean {
	if (!inputValue.trim()) {
		return true;
	}
	const labelStr = typeof option.label === 'string' ? option.label : String(option.label);
	return labelStr.toLowerCase().includes(inputValue.toLowerCase());
}

export function extractMultiSelectProps(props: Readonly<MultiSelectProps>) {
	const {
		label,
		error,
		helperText,
		fullWidth = false,
		required,
		disabled,
		placeholder,
		maxHeight = 280,
		emptyState = 'No options found',
		...rest
	} = props;
	return {
		label,
		error,
		helperText,
		fullWidth,
		required,
		disabled,
		placeholder,
		maxHeight,
		emptyState,
		rest,
	};
}

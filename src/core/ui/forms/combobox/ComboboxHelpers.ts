import { INPUT_BASE_CLASSES, INPUT_SIZE_CLASSES } from '@core/constants/ui/forms';
import { FORM_ERROR_CLASSES } from '@core/constants/ui/shared';
import { classNames } from '@core/utils/classNames';
import { useId } from 'react';

import type { UseComboboxStateOptions, UseComboboxStateReturn } from './ComboboxTypes';

export function generateComboboxId(
	generatedId: string,
	comboboxId?: string,
	label?: string
): string {
	if (comboboxId) {
		return comboboxId;
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

export function getComboboxClasses({
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

export function useComboboxState({
	comboboxId,
	label,
	error,
	helperText,
	size = 'md',
	className,
}: Readonly<UseComboboxStateOptions>): UseComboboxStateReturn {
	const generatedId = useId();
	const finalId = generateComboboxId(generatedId, comboboxId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const inputClasses = getComboboxClasses({ size, hasError, className });
	return { finalId, hasError, ariaDescribedBy, inputClasses };
}

export function defaultFilterFn(option: { readonly label: unknown }, inputValue: string): boolean {
	if (!inputValue.trim()) {
		return true;
	}
	const labelStr = typeof option.label === 'string' ? option.label : String(option.label);
	return labelStr.toLowerCase().includes(inputValue.toLowerCase());
}

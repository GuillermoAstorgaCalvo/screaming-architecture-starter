import { INPUT_BASE_CLASSES, INPUT_SIZE_CLASSES } from '@core/constants/ui/forms';
import { FORM_ERROR_CLASSES, FORM_NORMAL_CLASSES } from '@core/constants/ui/shared';
import { classNames } from '@core/utils/classNames';
import type { StandardSize } from '@src-types/ui/base';

export interface GetColorPickerClassesOptions {
	readonly size: StandardSize;
	readonly hasError: boolean;
	readonly className?: string | undefined;
}

/**
 * Generate color picker ID
 */
export function generateColorPickerId(
	generatedId: string,
	colorPickerId: string | undefined,
	label: string | undefined
): string | undefined {
	if (colorPickerId) return colorPickerId;
	if (label) return generatedId;
	return undefined;
}

/**
 * Get ARIA described-by attribute value
 */
export function getAriaDescribedBy(
	colorPickerId: string,
	error: string | undefined,
	helperText: string | undefined
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${colorPickerId}-error`);
	if (helperText) ids.push(`${colorPickerId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

/**
 * Get color picker input classes
 */
export function getColorPickerClasses({
	size,
	hasError,
	className,
}: Readonly<GetColorPickerClassesOptions>): string {
	const stateClasses = hasError ? FORM_ERROR_CLASSES : FORM_NORMAL_CLASSES;
	return classNames(
		INPUT_BASE_CLASSES,
		INPUT_SIZE_CLASSES[size],
		stateClasses,
		'h-10 w-10 cursor-pointer',
		className
	);
}

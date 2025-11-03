import { getInputVariantClasses } from '@core/ui/variants/input';
import type { StandardSize } from '@src-types/ui';

export interface GetInputClassesOptions {
	size: StandardSize;
	hasError: boolean;
	hasLeftIcon: boolean;
	hasRightIcon: boolean;
	className?: string | undefined;
}

export function getInputClasses(options: GetInputClassesOptions): string {
	return getInputVariantClasses({
		size: options.size,
		state: options.hasError ? 'error' : 'normal',
		hasLeftIcon: options.hasLeftIcon,
		hasRightIcon: options.hasRightIcon,
		className: options.className,
	});
}

export function getAriaDescribedBy(
	inputId: string,
	error?: string,
	helperText?: string
): string | undefined {
	if (error) return `${inputId}-error`;
	if (helperText) return `${inputId}-helper`;
	return undefined;
}

export function generateInputId(
	generatedId: string,
	inputId?: string,
	label?: string
): string | undefined {
	if (inputId) {
		return inputId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `input-${cleanId}`;
}

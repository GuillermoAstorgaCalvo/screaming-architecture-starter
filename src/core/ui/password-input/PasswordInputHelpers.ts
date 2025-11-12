import { getInputVariantClasses } from '@core/ui/variants/input';
import type { StandardSize } from '@src-types/ui/base';

export interface GetPasswordInputClassesOptions {
	size: StandardSize;
	hasError: boolean;
	className?: string | undefined;
}

export function getPasswordInputClasses(options: GetPasswordInputClassesOptions): string {
	return getInputVariantClasses({
		size: options.size,
		state: options.hasError ? 'error' : 'normal',
		hasLeftIcon: false,
		hasRightIcon: true, // Always has visibility toggle button
		className: options.className,
	});
}

export function getAriaDescribedBy(
	inputId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${inputId}-error`);
	if (helperText) ids.push(`${inputId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generatePasswordInputId(
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
	return `password-input-${cleanId}`;
}

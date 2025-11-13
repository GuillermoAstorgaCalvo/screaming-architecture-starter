import { getTextareaVariantClasses } from '@core/ui/variants/textarea';
import type { StandardSize } from '@src-types/ui/base';

export interface GetTextareaClassesOptions {
	size: StandardSize;
	hasError: boolean;
	className?: string | undefined;
}

export function getTextareaClasses(options: GetTextareaClassesOptions): string {
	return getTextareaVariantClasses({
		size: options.size,
		state: options.hasError ? 'error' : 'normal',
		className: options.className,
	});
}

export function getAriaDescribedBy(
	textareaId: string,
	error?: string,
	helperText?: string
): string | undefined {
	if (error) return `${textareaId}-error`;
	if (helperText) return `${textareaId}-helper`;
	return undefined;
}

export function generateTextareaId(
	generatedId: string,
	textareaId?: string,
	label?: string
): string | undefined {
	if (textareaId) {
		return textareaId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `textarea-${cleanId}`;
}

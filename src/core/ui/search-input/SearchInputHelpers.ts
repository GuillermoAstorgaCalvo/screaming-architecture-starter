import { getInputVariantClasses } from '@core/ui/variants/input';
import type { StandardSize } from '@src-types/ui/base';

export interface GetSearchInputClassesOptions {
	size: StandardSize;
	hasError: boolean;
	hasClearButton: boolean;
	className?: string | undefined;
}

export function getSearchInputClasses(options: GetSearchInputClassesOptions): string {
	return getInputVariantClasses({
		size: options.size,
		state: options.hasError ? 'error' : 'normal',
		hasLeftIcon: true, // Always has search icon
		hasRightIcon: options.hasClearButton,
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

export function generateSearchInputId(
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
	return `search-input-${cleanId}`;
}

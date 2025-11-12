import { getInputVariantClasses } from '@core/ui/variants/input';
import type { StandardSize } from '@src-types/ui/base';

export interface GetColorInputClassesOptions {
	size: StandardSize;
	hasError: boolean;
	className?: string | undefined;
}

export function getColorInputClasses(options: GetColorInputClassesOptions): string {
	return getInputVariantClasses({
		size: options.size,
		state: options.hasError ? 'error' : 'normal',
		hasLeftIcon: false,
		hasRightIcon: false,
		className: options.className,
	});
}

export function getAriaDescribedBy(
	colorInputId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${colorInputId}-error`);
	if (helperText) ids.push(`${colorInputId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generateColorInputId(
	generatedId: string,
	colorInputId?: string,
	label?: string
): string | undefined {
	if (colorInputId) {
		return colorInputId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `color-input-${cleanId}`;
}

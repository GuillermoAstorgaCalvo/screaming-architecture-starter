import { getInputVariantClasses } from '@core/ui/variants/input';
import type { StandardSize } from '@src-types/ui/base';

export interface GetDatePickerClassesOptions {
	size: StandardSize;
	className?: string | undefined;
}

export function getDatePickerClasses(options: GetDatePickerClassesOptions): string {
	return getInputVariantClasses({
		size: options.size,
		className: options.className,
	});
}

export function getAriaDescribedBy(
	datePickerId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${datePickerId}-error`);
	if (helperText) ids.push(`${datePickerId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generateDatePickerId(
	generatedId: string,
	datePickerId?: string,
	label?: string
): string | undefined {
	if (datePickerId) {
		return datePickerId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `datepicker-${cleanId}`;
}
